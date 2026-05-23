import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "../../utils/supabase/server";
import { addCredits } from "../../utils/credits";

export async function POST(req: Request) {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("pyh_admin")?.value;
  if (token !== "pyh_admin_ok") {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { userId, type, amount } = await req.json();

  if (!userId || !type || !amount || amount < 1) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (type !== "STANDARD" && type !== "HD") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  await addCredits(userId, type, Number(amount), "admin_topup");

  // Return new balance
  const admin = await createAdminClient();
  const { data } = await admin
    .from("saas_credit_ledger")
    .select("delta")
    .eq("user_id", userId)
    .eq("type", type);

  const balance = Math.max(0, (data ?? []).reduce((s, r) => s + r.delta, 0));

  return NextResponse.json({ ok: true, balance });
}
