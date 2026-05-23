"use server";

import { cookies } from "next/headers";
import { createAdminClient } from "../utils/supabase/server";
import { addCredits } from "../utils/credits";

export async function adminAddCredits(
  userId: string,
  type: "STANDARD" | "HD",
  amount: number
): Promise<{ balance: number; error?: string }> {
  // Auth check inside the server action
  const cookieStore = await cookies();
  const token = cookieStore.get("pyh_admin")?.value;
  if (token !== "pyh_admin_ok") {
    return { balance: 0, error: "Not authorised — please refresh and log in again" };
  }

  if (!userId || !type || !amount || amount < 1) {
    return { balance: 0, error: "Invalid input" };
  }

  try {
    await addCredits(userId, type, amount, "admin_topup");
  } catch (e) {
    return { balance: 0, error: `Failed to add credits: ${e instanceof Error ? e.message : String(e)}` };
  }

  // Fetch updated balance
  const admin = await createAdminClient();
  const { data } = await admin
    .from("saas_credit_ledger")
    .select("delta")
    .eq("user_id", userId)
    .eq("type", type);

  const balance = Math.max(0, (data ?? []).reduce((s: number, r: { delta: number }) => s + r.delta, 0));
  return { balance };
}
