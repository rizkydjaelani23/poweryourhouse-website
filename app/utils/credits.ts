import { createAdminClient } from "./supabase/server";

export type CreditType = "STANDARD" | "HD";

/** Returns the current balance for a user (never negative). */
export async function getBalance(
  userId: string,
  type: CreditType
): Promise<number> {
  const admin = await createAdminClient();
  const { data } = await admin
    .from("saas_credit_ledger")
    .select("delta")
    .eq("user_id", userId)
    .eq("type", type);

  if (!data?.length) return 0;
  const total = data.reduce((sum, row) => sum + (row.delta as number), 0);
  return Math.max(0, total);
}

/** Add credits (positive delta). */
export async function addCredits(
  userId: string,
  type: CreditType,
  amount: number,
  reason: string,
  refId?: string
) {
  const admin = await createAdminClient();
  await admin.from("saas_credit_ledger").insert({
    user_id: userId,
    type,
    delta:  amount,
    reason,
    ref_id: refId ?? null,
  });
}

/**
 * Attempt to deduct 1 credit.
 * Returns true if successful, false if insufficient balance.
 */
export async function deductCredit(
  userId: string,
  type: CreditType,
  generationId: string
): Promise<boolean> {
  const balance = await getBalance(userId, type);
  if (balance < 1) return false;

  const admin = await createAdminClient();
  await admin.from("saas_credit_ledger").insert({
    user_id: userId,
    type,
    delta:  -1,
    reason: "generation",
    ref_id: generationId,
  });
  return true;
}
