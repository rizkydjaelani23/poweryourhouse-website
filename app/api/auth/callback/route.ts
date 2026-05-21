import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";
import { createAdminClient } from "../../../utils/supabase/server";
import { addCredits } from "../../../utils/credits";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code     = searchParams.get("code");
  const next     = searchParams.get("next") ?? "/generate";

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      const admin = await createAdminClient();

      // Check if profile already exists (handles duplicate callbacks)
      const { data: existing } = await admin
        .from("saas_profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existing) {
        // New user — create profile and grant free credits
        const marketing = user.user_metadata?.marketing_consent === true;

        await admin.from("saas_profiles").insert({
          id:                 user.id,
          email:              user.email,
          marketing_consent:  marketing,
          plan:               "free",
        });

        // Grant signup bonus: 5 standard + 1 HD
        await addCredits(user.id, "STANDARD", 5, "signup_bonus");
        await addCredits(user.id, "HD",       1, "signup_bonus");
      }

      const redirectUrl = `${origin}${next}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
