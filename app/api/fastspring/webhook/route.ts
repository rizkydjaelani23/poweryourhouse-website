/**
 * POST /api/fastspring/webhook
 *
 * Receives FastSpring webhook events, verifies the HMAC-SHA256 signature,
 * then grants / adjusts credits in the credit ledger.
 *
 * Events handled:
 *   order.completed          — one-off credit pack purchase
 *   subscription.activated   — new subscription (initial credit grant)
 *   subscription.charge.completed — monthly renewal (credits top up again)
 *   subscription.canceled    — cancellation → downgrade profile to "free"
 *
 * User matching priority:
 *   1. event.data.tags.user_id  (passed via fastspring.builder.push tags)
 *   2. event.data.customer.email (fallback)
 *
 * Env vars required (server-side only, no NEXT_PUBLIC_ prefix):
 *   FASTSPRING_WEBHOOK_SECRET        — HMAC secret from FastSpring dashboard
 *   FS_PRODUCT_STARTER               — product path for Starter plan
 *   FS_PRODUCT_PRO                   — product path for Pro plan
 *   FS_PRODUCT_BUSINESS              — product path for Business plan
 *   FS_PRODUCT_STANDARD_PACK         — product path for Standard credit pack
 *   FS_PRODUCT_HD_PACK               — product path for HD credit pack
 *
 * Signature verification:
 *   FastSpring sends X-FS-Signature: base64(HMAC-SHA256(rawBody, secret))
 */

import { NextResponse }              from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient }         from "../../../utils/supabase/server";
import { addCredits }                from "../../../utils/credits";

export const runtime = "nodejs";

// ── Credit grants per subscription product path ───────────────────────────────
const PRODUCT_PLAN: Record<string, { STANDARD: number; HD: number; planName: string }> = {
  [process.env.FS_PRODUCT_STARTER  || "___"]: { STANDARD: 100,  HD: 10,  planName: "starter"  },
  [process.env.FS_PRODUCT_PRO      || "___"]: { STANDARD: 500,  HD: 60,  planName: "pro"       },
  [process.env.FS_PRODUCT_BUSINESS || "___"]: { STANDARD: 9999, HD: 200, planName: "business"  },
};

// ── Credits per one-off credit pack ──────────────────────────────────────────
const PRODUCT_PACK: Record<string, { type: "STANDARD" | "HD"; amount: number }> = {
  [process.env.FS_PRODUCT_STANDARD_PACK || "___"]: { type: "STANDARD", amount: 100 },
  [process.env.FS_PRODUCT_HD_PACK       || "___"]: { type: "HD",       amount: 20  },
};

// ── Signature verification ────────────────────────────────────────────────────
function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.FASTSPRING_WEBHOOK_SECRET || "";
  if (!secret || !signature) return false;

  // FastSpring: base64( HMAC-SHA256(rawBody, secret) )
  const computed = createHmac("sha256", secret)
    .update(rawBody)
    .digest()
    .toString("base64");

  try {
    return timingSafeEqual(
      Buffer.from(computed,   "base64"),
      Buffer.from(signature,  "base64"),
    );
  } catch {
    return false;
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const rawBody   = await request.text();
  // Header may arrive lowercase or mixed-case depending on proxy
  const signature =
    request.headers.get("x-fs-signature") ||
    request.headers.get("X-FS-Signature") ||
    "";

  if (!verifySignature(rawBody, signature)) {
    console.error("[fs/webhook] Invalid or missing signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try { body = JSON.parse(rawBody); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  // FastSpring delivers an array of events in one request
  const events: unknown[] = Array.isArray(body?.events) ? body.events : [];
  if (events.length === 0) {
    return NextResponse.json({ ok: true, skipped: "no events" });
  }

  const admin = await createAdminClient();

  // ── User resolver ─────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function resolveUserId(data: any): Promise<string | null> {
    // 1. tags.user_id — passed when logged-in user opens the checkout
    const uid = data?.tags?.user_id;
    if (uid) {
      const { data: row } = await admin
        .from("saas_profiles")
        .select("id")
        .eq("id", uid)
        .maybeSingle();
      if (row) return row.id as string;
    }

    // 2. Customer email fallback
    const email = data?.customer?.email as string | undefined;
    if (email) {
      const { data: row } = await admin
        .from("saas_profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (row) return row.id as string;
    }

    return null;
  }

  // ── Process each event ────────────────────────────────────────────────────
  for (const raw of events) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const event = raw as any;
    const type: string = event?.type  || "";
    const data         = event?.data  || {};
    const eventId      = String(event?.id ?? "");
    const isLive       = event?.live  !== false; // test webhooks have live:false

    if (!isLive) {
      console.log(`[fs/webhook] Skipping test event: ${type} (${eventId})`);
      continue;
    }

    console.log(`[fs/webhook] Processing: ${type} (${eventId})`);

    try {
      // ── order.completed — one-off credit pack ─────────────────────────────
      if (type === "order.completed") {
        const userId = await resolveUserId(data);
        // Items array carries the product path(s)
        const items: { product?: string }[] = Array.isArray(data?.items) ? data.items : [];

        for (const item of items) {
          const pack = PRODUCT_PACK[item.product || ""];
          if (userId && pack) {
            await addCredits(userId, pack.type, pack.amount, "pack_purchase", eventId);
            console.log(`[fs/webhook] pack_purchase: +${pack.amount} ${pack.type} → user ${userId}`);
          } else {
            console.warn(`[fs/webhook] order.completed — unknown product "${item.product}" or user not found`);
          }
        }
      }

      // ── subscription.activated — new subscriber ───────────────────────────
      if (type === "subscription.activated") {
        const userId  = await resolveUserId(data);
        const product = String(data?.product ?? data?.productPath ?? "");
        const plan    = PRODUCT_PLAN[product];

        if (userId && plan) {
          await addCredits(userId, "STANDARD", plan.STANDARD, "subscription", eventId);
          await addCredits(userId, "HD",       plan.HD,       "subscription", eventId);
          await admin.from("saas_profiles").update({ plan: plan.planName }).eq("id", userId);
          console.log(`[fs/webhook] subscription.activated: plan=${plan.planName} → user ${userId}`);
        } else {
          console.warn(`[fs/webhook] subscription.activated — unknown product "${product}" or user not found`);
        }
      }

      // ── subscription.charge.completed — renewal ───────────────────────────
      if (type === "subscription.charge.completed") {
        const userId  = await resolveUserId(data);
        const product = String(data?.product ?? data?.productPath ?? "");
        const plan    = PRODUCT_PLAN[product];

        if (userId && plan) {
          await addCredits(userId, "STANDARD", plan.STANDARD, "subscription", eventId);
          await addCredits(userId, "HD",       plan.HD,       "subscription", eventId);
          console.log(`[fs/webhook] subscription.charge.completed: +credits plan=${plan.planName} → user ${userId}`);
        } else {
          console.warn(`[fs/webhook] subscription.charge.completed — unknown product "${product}" or user not found`);
        }
      }

      // ── subscription.canceled — downgrade to free ─────────────────────────
      if (type === "subscription.canceled") {
        const userId = await resolveUserId(data);
        if (userId) {
          await admin.from("saas_profiles").update({ plan: "free" }).eq("id", userId);
          console.log(`[fs/webhook] subscription.canceled → downgraded to free, user ${userId}`);
        }
      }

    } catch (err) {
      console.error(`[fs/webhook] Error processing event ${type} (${eventId}):`, err);
      // Return 200 so FastSpring doesn't retry — investigate via logs
    }
  }

  return NextResponse.json({ ok: true });
}
