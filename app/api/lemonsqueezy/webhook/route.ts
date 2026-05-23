/**
 * POST /api/lemonsqueezy/webhook
 *
 * Handles Lemon Squeezy webhook events.
 * Verifies HMAC-SHA256 signature, then tops up credits.
 *
 * Events handled:
 *   order_created           — one-off credit pack purchase
 *   subscription_created    — new subscription (initial credit grant)
 *   subscription_updated    — plan change / cancellation
 *   subscription_renewed    — monthly renewal (credits top up again)
 *
 * User matching priority:
 *   1. custom_data.user_id  (set in checkout URL when user is logged in)
 *   2. user_email           (fallback — looks up saas_profiles by email)
 */

import { NextResponse }       from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient }  from "../../../utils/supabase/server";
import { addCredits }         from "../../../utils/credits";

export const runtime = "nodejs";

// ── Credits per subscription variant ─────────────────────────────────────────
const VARIANT_PLAN: Record<string, { STANDARD: number; HD: number; planName: string }> = {
  [process.env.LS_VARIANT_STARTER   || ""]: { STANDARD: 100,  HD: 10,  planName: "starter"  },
  [process.env.LS_VARIANT_PRO       || ""]: { STANDARD: 500,  HD: 60,  planName: "pro"       },
  [process.env.LS_VARIANT_BUSINESS  || ""]: { STANDARD: 9999, HD: 200, planName: "business"  },
};

// ── Credits per one-off pack variant ─────────────────────────────────────────
const VARIANT_PACK: Record<string, { type: "STANDARD" | "HD"; amount: number }> = {
  [process.env.LS_VARIANT_STANDARD_PACK || ""]: { type: "STANDARD", amount: 100 },
  [process.env.LS_VARIANT_HD_PACK       || ""]: { type: "HD",       amount: 20  },
};

// ── Signature verification ────────────────────────────────────────────────────
function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";
  if (!secret || !signature) return false;
  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const rawBody   = await request.text();
  const signature = request.headers.get("x-signature") || "";

  if (!verifySignature(rawBody, signature)) {
    console.error("[ls/webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let payload: any;
  try { payload = JSON.parse(rawBody); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const eventName  = payload?.meta?.event_name as string | undefined;
  const customData = payload?.meta?.custom_data as Record<string, string> | undefined;
  const attrs      = payload?.data?.attributes  as Record<string, unknown> | undefined;
  const dataId     = String(payload?.data?.id   ?? "");

  if (!eventName || !attrs) {
    return NextResponse.json({ ok: true, skipped: "no event_name or attrs" });
  }

  const admin = await createAdminClient();

  // ── Resolve user ──────────────────────────────────────────────────────────
  async function resolveUserId(): Promise<string | null> {
    // 1. custom_data.user_id — most reliable (passed via checkout URL)
    const uid = customData?.user_id;
    if (uid) {
      const { data } = await admin
        .from("saas_profiles")
        .select("id")
        .eq("id", uid)
        .maybeSingle();
      if (data) return data.id as string;
    }

    // 2. Email fallback
    const email = attrs?.user_email as string | undefined;
    if (email) {
      const { data } = await admin
        .from("saas_profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (data) return data.id as string;
    }

    return null;
  }

  try {
    // ── order_created — one-off pack ─────────────────────────────────────────
    if (eventName === "order_created" && attrs.status === "paid") {
      const userId    = await resolveUserId();
      // first_order_item carries the variant
      const firstItem = attrs.first_order_item as Record<string, unknown> | undefined;
      const variantId = String(firstItem?.variant_id ?? "");
      const pack      = VARIANT_PACK[variantId];

      if (userId && pack) {
        await addCredits(userId, pack.type, pack.amount, "pack_purchase", dataId);
        console.log(`[ls/webhook] pack_purchase: +${pack.amount} ${pack.type} → user ${userId}`);
      } else {
        console.warn(`[ls/webhook] order_created — unknown variant ${variantId} or user not found`);
      }
    }

    // ── subscription_created / subscription_renewed — grant credits ──────────
    if (
      eventName === "subscription_created" ||
      eventName === "subscription_renewed"
    ) {
      const userId    = await resolveUserId();
      const variantId = String(attrs.variant_id ?? "");
      const plan      = VARIANT_PLAN[variantId];

      if (userId && plan) {
        await addCredits(userId, "STANDARD", plan.STANDARD, "subscription", dataId);
        await addCredits(userId, "HD",       plan.HD,       "subscription", dataId);
        // Set plan name on profile
        await admin
          .from("saas_profiles")
          .update({ plan: plan.planName })
          .eq("id", userId);
        console.log(`[ls/webhook] ${eventName}: plan=${plan.planName} → user ${userId}`);
      } else {
        console.warn(`[ls/webhook] ${eventName} — unknown variant ${variantId} or user not found`);
      }
    }

    // ── subscription_updated — handle plan changes & cancellations ───────────
    if (eventName === "subscription_updated") {
      const userId    = await resolveUserId();
      const variantId = String(attrs.variant_id ?? "");
      const status    = attrs.status as string | undefined;
      const plan      = VARIANT_PLAN[variantId];

      if (userId) {
        if (status === "active" && plan) {
          // Plan changed — update the plan name (credits granted on renewal)
          await admin
            .from("saas_profiles")
            .update({ plan: plan.planName })
            .eq("id", userId);
          console.log(`[ls/webhook] subscription_updated: plan=${plan.planName} → user ${userId}`);
        } else if (status === "cancelled" || status === "expired") {
          // Downgrade to free on cancellation
          await admin
            .from("saas_profiles")
            .update({ plan: "free" })
            .eq("id", userId);
          console.log(`[ls/webhook] subscription_updated: ${status} → downgraded to free, user ${userId}`);
        }
      }
    }

  } catch (err) {
    console.error("[ls/webhook] Processing error:", err);
    // Return 200 so LS doesn't retry — investigate logs manually
    return NextResponse.json({ ok: false, error: String(err) });
  }

  return NextResponse.json({ ok: true });
}
