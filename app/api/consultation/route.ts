/**
 * POST /api/consultation
 *
 * Saves a free-consultation lead. Called right before the user
 * is shown the Calendly booking widget so we have their details
 * even if they don't complete the booking.
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "../../utils/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: {
    businessName?: string;
    email?: string;
    phone?: string;
    facebookPage?: string;
    instagramHandle?: string;
    products?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { businessName, email, phone, facebookPage, instagramHandle, products } = body;

  if (!businessName || !email) {
    return NextResponse.json({ error: "businessName and email are required" }, { status: 400 });
  }

  try {
    const admin = await createAdminClient();
    const { error } = await admin.from("consultation_leads").insert({
      business_name:    businessName,
      email,
      phone:            phone            || null,
      facebook_page:    facebookPage     || null,
      instagram_handle: instagramHandle  || null,
      products:         products         || null,
    });

    if (error) {
      // Table may not exist yet — log but don't fail the user flow
      console.error("[consultation] Supabase insert error:", error.message);
    }
  } catch (err) {
    console.error("[consultation] Unexpected error:", err);
  }

  return NextResponse.json({ ok: true });
}
