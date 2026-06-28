import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { getBalance } from "../../utils/credits";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const [standard, profileResult] = await Promise.all([
      getBalance(user.id, "STANDARD"),
      supabase.from("saas_profiles").select("plan").eq("id", user.id).single(),
    ]);

    const plan = profileResult.data?.plan ?? "free";

    return NextResponse.json({ standard, plan });
  } catch (err) {
    console.error("[api/credits]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
