import { NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";
import { createAdminClient } from "../../../utils/supabase/server";
import { addCredits } from "../../../utils/credits";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // "next" is set to "/reset-password" by the password-reset flow; defaults to /generate
  const next = searchParams.get("next") ?? "/generate";

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // Password-reset flow — session is established, just redirect to the
      // new-password form. Skip profile creation / credit grant for recovery.
      if (next === "/reset-password") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }

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
          id:                user.id,
          email:             user.email,
          marketing_consent: marketing,
          plan:              "free",
        });

        // Grant signup bonus: 5 standard + 1 HD
        await addCredits(user.id, "STANDARD", 5, "signup_bonus");
        await addCredits(user.id, "HD",       1, "signup_bonus");
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
