import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { getBalance } from "../../utils/credits";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    const [standard, hd, profileResult] = await Promise.all([
      getBalance(user.id, "STANDARD"),
      getBalance(user.id, "HD"),
      supabase.from("saas_profiles").select("plan").eq("id", user.id).single(),
    ]);

    const plan = profileResult.data?.plan ?? "free";

    return NextResponse.json({ standard, hd, plan });
  } catch (err) {
    console.error("[api/credits]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
