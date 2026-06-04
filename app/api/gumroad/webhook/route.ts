/**
 * POST /api/gumroad/webhook
 *
 * Receives Gumroad "ping" events (sale, cancellation, refund, etc.)
 * Verifies seller_id, then grants or revokes credits.
 *
 * Events handled:
 *   sale              — new purchase or subscription renewal → grant credits
 *   cancellation      — subscription cancelled → downgrade to free
 *   refund            — ignore (credits already spent; handle manually if needed)
 *
 * User matching priority:
 *   1. email from Gumroad payload → look up saas_profiles by email
 *   (Gumroad doesn't support custom session data, so email is the only signal.
 *    We pre-fill the email field in the checkout URL to maximise match rate.)
 *
 * Gumroad dashboard setup:
 *   Settings → Advanced → Ping URL → https://poweryourhouse.io/api/gumroad/webhook
 *
 * Env vars required:
 *   GUMROAD_SELLER_ID            — your Gumroad seller ID (Settings → Advanced)
 *   GUMROAD_PRODUCT_STARTER      — product permalink for Starter plan
 *   GUMROAD_PRODUCT_PRO          — product permalink for Pro plan
 *   GUMROAD_PRODUCT_BUSINESS     — product permalink for Business plan
 *   GUMROAD_PRODUCT_STANDARD_PACK — permalink for Standard credit pack
 *   GUMROAD_PRODUCT_HD_PACK      — permalink for HD credit pack
 *   GUMROAD_PRODUCT_SOCIAL_*     — social service permalinks (fulfilled manually)
 */

import { NextResponse }     from "next/server";
import { createAdminClient } from "../../../utils/supabase/server";
import { addCredits }        from "../../../utils/credits";

export const runtime = "nodejs";

/* ── Credit grants per subscription permalink ───────────────────────────── */
const PRODUCT_PLAN: Record<string, { STANDARD: number; HD: number; planName: string }> = {
  [process.env.GUMROAD_PRODUCT_STARTER  || "___"]: { STANDARD: 100,  HD: 10,  planName: "starter"  },
  [process.env.GUMROAD_PRODUCT_PRO      || "___"]: { STANDARD: 500,  HD: 60,  planName: "pro"       },
  [process.env.GUMROAD_PRODUCT_BUSINESS || "___"]: { STANDARD: 9999, HD: 200, planName: "business"  },
};

/* ── One-off credit packs ───────────────────────────────────────────────── */
const PRODUCT_PACK: Record<string, { type: "STANDARD" | "HD"; amount: number }> = {
  [process.env.GUMROAD_PRODUCT_STANDARD_PACK || "___"]: { type: "STANDARD", amount: 100 },
  [process.env.GUMROAD_PRODUCT_HD_PACK       || "___"]: { type: "HD",       amount: 20  },
};

/* ── Manually-fulfilled social service products ─────────────────────────── */
const SERVICE_PRODUCTS = new Set([
  process.env.GUMROAD_PRODUCT_SOCIAL_STARTER     || "pyh-social-starter",
  process.env.GUMROAD_PRODUCT_SOCIAL_GROWTH      || "pyh-social-growth",
  process.env.GUMROAD_PRODUCT_SOCIAL_MAINTENANCE || "pyh-social-maintenance",
  process.env.GUMROAD_PRODUCT_SOCIAL_FIX         || "pyh-social-fix",
  process.env.GUMROAD_PRODUCT_SOCIAL_REFRESH     || "pyh-social-refresh",
]);

/* ── Route handler ──────────────────────────────────────────────────────── */
export async function POST(request: Request) {
  // Gumroad sends application/x-www-form-urlencoded
  let body: URLSearchParams;
  try {
    const text = await request.text();
    body = new URLSearchParams(text);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // ── Verify seller ID ───────────────────────────────────────────────────
  const sellerId    = body.get("seller_id")    ?? "";
  const expectedId  = (process.env.GUMROAD_SELLER_ID ?? "").trim();
  if (expectedId && sellerId !== expectedId) {
    console.error(`[gumroad/webhook] seller_id mismatch: got "${sellerId}"`);
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const eventType   = body.get("alert_name")       ?? "sale";  // Gumroad uses "alert_name"
  const email       = (body.get("email")            ?? "").toLowerCase().trim();
  const permalink   = body.get("short_product_id")  ?? body.get("permalink") ?? "";
  const saleId      = body.get("sale_id")           ?? body.get("charge_id") ?? "";
  const isRecurring = body.get("is_recurring_billing") === "true";
  const productName = body.get("product_name")      ?? "";

  console.log(`[gumroad/webhook] ${eventType} | product="${permalink}" | email="${email}" | recurring=${isRecurring} | sale_id=${saleId}`);

  if (!email) {
    console.warn("[gumroad/webhook] No email in payload — cannot match user");
    return NextResponse.json({ ok: true, skipped: "no email" });
  }

  const admin = await createAdminClient();

  /* ── Resolve user by email ────────────────────────────────────────────── */
  async function resolveUserId(): Promise<string | null> {
    const { data } = await admin
      .from("saas_profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    return data?.id ?? null;
  }

  try {
    /* ── sale (new purchase or subscription renewal) ──────────────────── */
    if (eventType === "sale") {
      const userId = await resolveUserId();
      const plan   = PRODUCT_PLAN[permalink];
      const pack   = PRODUCT_PACK[permalink];

      if (SERVICE_PRODUCTS.has(permalink)) {
        console.log(`[gumroad/webhook] 🛠️ SERVICE ORDER — "${productName}" (${permalink}) purchased by ${email}. Fulfil manually.`);
        return NextResponse.json({ ok: true });
      }

      if (!userId) {
        console.warn(`[gumroad/webhook] sale — no account found for email "${email}". They may need to sign up first.`);
        // Return 200 so Gumroad doesn't retry — investigate manually
        return NextResponse.json({ ok: true, warning: "user_not_found" });
      }

      if (plan) {
        // Subscription (new or renewal)
        await addCredits(userId, "STANDARD", plan.STANDARD, "subscription", saleId);
        await addCredits(userId, "HD",       plan.HD,       "subscription", saleId);
        await admin.from("saas_profiles").update({ plan: plan.planName }).eq("id", userId);
        console.log(`[gumroad/webhook] ${isRecurring ? "renewal" : "new subscription"}: plan=${plan.planName} → user ${userId}`);
      } else if (pack) {
        // One-off credit pack
        await addCredits(userId, pack.type, pack.amount, "pack_purchase", saleId);
        console.log(`[gumroad/webhook] pack_purchase: +${pack.amount} ${pack.type} → user ${userId}`);
      } else {
        console.warn(`[gumroad/webhook] sale — unknown permalink "${permalink}"`);
      }
    }

    /* ── cancellation ─────────────────────────────────────────────────── */
    if (eventType === "cancellation" || eventType === "subscription_cancelled") {
      const userId = await resolveUserId();
      if (userId) {
        await admin.from("saas_profiles").update({ plan: "free" }).eq("id", userId);
        console.log(`[gumroad/webhook] cancellation → downgraded to free, user ${userId}`);
      }
    }

    /* ── refund (log only — handle manually) ─────────────────────────── */
    if (eventType === "refund") {
      console.log(`[gumroad/webhook] refund received for ${email} (${permalink}) — handle manually if needed`);
    }

  } catch (err) {
    console.error("[gumroad/webhook] Processing error:", err);
    // Return 200 so Gumroad doesn't retry endlessly
    return NextResponse.json({ ok: false, error: String(err) });
  }

  return NextResponse.json({ ok: true });
}
