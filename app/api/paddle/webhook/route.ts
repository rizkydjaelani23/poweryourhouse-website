/**
 * POST /api/paddle/webhook
 *
 * Handles Paddle Billing webhook events.
 * Verifies signature, then tops up credits based on the event.
 *
 * Events handled:
 *   transaction.completed       — one-off credit pack purchase
 *   subscription.created        — new subscription (monthly grant)
 *   subscription.updated        — plan change
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "../../../utils/supabase/server";
import { addCredits } from "../../../utils/credits";

export const runtime = "nodejs";

// Credits granted per plan per billing cycle
const PLAN_CREDITS: Record<string, { STANDARD: number; HD: number }> = {
  [process.env.PADDLE_PRICE_STARTER  || ""]: { STANDARD: 100, HD: 10  },
  [process.env.PADDLE_PRICE_PRO      || ""]: { STANDARD: 500, HD: 60  },
  [process.env.PADDLE_PRICE_BUSINESS || ""]: { STANDARD: 9999, HD: 200 },
};

// Credits granted for one-off packs
const PACK_CREDITS: Record<string, { type: "STANDARD" | "HD"; amount: number }> = {
  [process.env.PADDLE_PRICE_STANDARD_PACK || ""]: { type: "STANDARD", amount: 100 },
  [process.env.PADDLE_PRICE_HD_PACK       || ""]: { type: "HD",       amount: 20  },
};

async function verifySignature(body: string, signatureHeader: string): Promise<boolean> {
  const secret = process.env.PADDLE_WEBHOOK_SECRET || "";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
  );

  // Paddle signature format: "ts=...;h1=..."
  const parts   = Object.fromEntries(signatureHeader.split(";").map((p) => p.split("=")));
  const ts      = parts["ts"];
  const h1      = parts["h1"];
  if (!ts || !h1) return false;

  const signed  = `${ts}:${body}`;
  const sigBytes = Uint8Array.from(Buffer.from(h1, "hex"));
  return crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(signed));
}

export async function POST(request: Request) {
  const body      = await request.text();
  const sigHeader = request.headers.get("paddle-signature") || "";

  const valid = await verifySignature(body, sigHeader);
  if (!valid) {
    console.error("[paddle/webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event_type: string; data: Record<string, unknown> };
  try { event = JSON.parse(body); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const admin = await createAdminClient();
  const { event_type, data } = event;

  try {
    // ── transaction.completed — one-off pack purchase ──────────────────────
    if (event_type === "transaction.completed") {
      const customerId = data.customer_id as string;
      const items      = (data.items as Array<{ price: { id: string } }>) || [];

      // Resolve user from Paddle customer ID
      const { data: profile } = await admin
        .from("saas_profiles")
        .select("id")
        .eq("paddle_customer_id", customerId)
        .single();

      if (profile) {
        for (const item of items) {
          const priceId = item.price?.id;
          const pack = PACK_CREDITS[priceId];
          if (pack) {
            await addCredits(profile.id, pack.type, pack.amount, "pack_purchase", data.id as string);
          }
        }
      }
    }

    // ── subscription.created / subscription.updated ─────────────────────────
    if (event_type === "subscription.created" || event_type === "subscription.updated") {
      const customerId = data.customer_id as string;
      const items      = (data.items as Array<{ price: { id: string } }>) || [];

      // Find or store paddle_customer_id on the profile
      // Match by email if customer_id not yet stored
      const customerEmail = (data as Record<string, unknown> & { customer?: { email?: string } })?.customer?.email as string | undefined;

      let userId: string | null = null;

      const { data: byCustomer } = await admin
        .from("saas_profiles")
        .select("id")
        .eq("paddle_customer_id", customerId)
        .single();

      if (byCustomer) {
        userId = byCustomer.id;
      } else if (customerEmail) {
        const { data: byEmail } = await admin
          .from("saas_profiles")
          .select("id")
          .eq("email", customerEmail)
          .single();
        if (byEmail) {
          userId = byEmail.id;
          // Store the Paddle customer ID for future lookups
          await admin.from("saas_profiles").update({ paddle_customer_id: customerId }).eq("id", userId);
        }
      }

      if (userId) {
        for (const item of items) {
          const priceId = item.price?.id;
          const planCredits = PLAN_CREDITS[priceId];
          if (planCredits) {
            await addCredits(userId, "STANDARD", planCredits.STANDARD, "subscription", data.id as string);
            await addCredits(userId, "HD",       planCredits.HD,       "subscription", data.id as string);

            // Update plan on profile
            const planName =
              priceId === process.env.PADDLE_PRICE_STARTER  ? "starter"  :
              priceId === process.env.PADDLE_PRICE_PRO      ? "pro"      :
              priceId === process.env.PADDLE_PRICE_BUSINESS ? "business" : "free";
            await admin.from("saas_profiles").update({ plan: planName }).eq("id", userId);
          }
        }
      }
    }
  } catch (err) {
    console.error("[paddle/webhook] Processing error:", err);
    // Return 200 so Paddle doesn't retry — log for manual review
    return NextResponse.json({ ok: false, error: String(err) });
  }

  return NextResponse.json({ ok: true });
}
