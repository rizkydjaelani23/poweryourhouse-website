import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "../../utils/supabase/server";
import { addCredits } from "../../utils/credits";

export async function POST(req: Request) {
  // Auth check
  const cookieStore = await cookies();
  const token = cookieStore.get("pyh_admin")?.value;

  console.log("[admin-credits] cookie token:", token);

  if (token !== "pyh_admin_ok") {
    return NextResponse.json(
      { error: `Unauthorised — cookie is "${token ?? "missing"}"` },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { userId, type, amount } = body;

  console.log("[admin-credits] payload:", { userId, type, amount });

  if (!userId || !type || !amount || Number(amount) < 1) {
    return NextResponse.json({ error: "Invalid payload — userId, type and amount required" }, { status: 400 });
  }
  if (type !== "STANDARD" && type !== "HD") {
    return NextResponse.json({ error: `Invalid type "${type}" — must be STANDARD or HD` }, { status: 400 });
  }

  await addCredits(userId, type as "STANDARD" | "HD", Number(amount), "admin_topup");

  // Return updated balance
  const admin = await createAdminClient();
  const { data } = await admin
    .from("saas_credit_ledger")
    .select("delta")
    .eq("user_id", userId)
    .eq("type", type);

  const balance = Math.max(0, (data ?? []).reduce((s: number, r: { delta: number }) => s + r.delta, 0));

  console.log("[admin-credits] done — new balance:", balance);

  return NextResponse.json({ ok: true, balance });
}
