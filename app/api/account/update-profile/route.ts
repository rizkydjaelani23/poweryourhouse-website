/**
 * POST /api/account/update-profile
 * Updates display name (auth user_metadata) and marketing consent (saas_profiles).
 * Body: { displayName?: string; marketingConsent?: boolean }
 */

import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";
import { createAdminClient } from "../../../utils/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { displayName, marketingConsent } = body as {
    displayName?: string;
    marketingConsent?: boolean;
  };

  // Update display name in auth user metadata
  if (displayName !== undefined) {
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim() },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update marketing consent in saas_profiles (needs admin to bypass RLS)
  if (marketingConsent !== undefined) {
    const admin = await createAdminClient();
    const { error } = await admin
      .from("saas_profiles")
      .update({ marketing_consent: marketingConsent })
      .eq("id", user.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
