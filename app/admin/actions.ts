"use server";

import { createAdminClient } from "../utils/supabase/server";

function checkPassword(password: string): boolean {
  const expected = (process.env.ADMIN_PASSWORD ?? "").trim();
  return !!expected && password.trim() === expected;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  return checkPassword(password);
}

export async function getAdminData(password: string) {
  if (!checkPassword(password)) return { error: "Wrong password" };

  const admin = await createAdminClient();

  const nowIso  = new Date().toISOString();
  // Use "last 24 hours" instead of UTC midnight so it's timezone-agnostic
  const todayIso = new Date(Date.now() - 24 * 3600_000).toISOString();
  const weekAgo  = new Date(Date.now() - 7 * 86400_000).toISOString();

  const [
    { count: totalGens },
    { count: todayGens },
    { count: weekGens },
    { count: hdGens },
    { count: totalGuests },
    { data: recentGens },
    { data: guestRows },
    { data: ledgerRows },
    authResult,
  ] = await Promise.all([
    admin.from("saas_generations").select("*", { count: "exact", head: true }),
    admin.from("saas_generations").select("*", { count: "exact", head: true }).gte("created_at", todayIso),
    admin.from("saas_generations").select("*", { count: "exact", head: true }).gte("created_at", weekAgo),
    admin.from("saas_generations").select("*", { count: "exact", head: true }).eq("type", "HD"),
    admin.from("saas_guest_usage").select("*", { count: "exact", head: true }).not("token", "like", "ip:%").not("token", "like", "abuse:%"),
    admin.from("saas_generations").select("id,user_id,type,colour_hex,status,created_at").order("created_at", { ascending: false }).limit(40),
    admin.from("saas_guest_usage").select("*").not("token", "like", "ip:%").not("token", "like", "abuse:%").order("last_used", { ascending: false }),
    admin.from("saas_credit_ledger").select("user_id,type,delta").limit(10000),
    admin.auth.admin.listUsers({ page: 1, perPage: 100 }),
  ]);

  const users = authResult.data?.users ?? [];

  const balanceMap: Record<string, { STANDARD: number; HD: number }> = {};
  for (const row of (ledgerRows ?? [])) {
    if (!balanceMap[row.user_id]) balanceMap[row.user_id] = { STANDARD: 0, HD: 0 };
    balanceMap[row.user_id][row.type as "STANDARD" | "HD"] += row.delta;
  }

  const emailMap: Record<string, string> = {};
  for (const u of users) emailMap[u.id] = u.email ?? u.id.slice(0, 8);

  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const totalGuestGens = (guestRows ?? []).reduce((s, r) => s + (r.count ?? 0), 0);

  return {
    totalGens:      totalGens ?? 0,
    todayGens:      todayGens ?? 0,
    weekGens:       weekGens ?? 0,
    hdGens:         hdGens ?? 0,
    totalGuests:    totalGuests ?? 0,
    totalGuestGens,
    recentGens:     recentGens ?? [],
    guestRows:      guestRows ?? [],
    users:          sortedUsers,
    balanceMap,
    emailMap,
  };
}

/** Fetch the live STANDARD + HD balance for a single user (admin only). */
export async function getUserBalances(
  password: string,
  userId: string
): Promise<{ standard: number; hd: number; error?: string }> {
  if (!checkPassword(password)) return { standard: 0, hd: 0, error: "Wrong password" };

  const admin = await createAdminClient();

  const { data, error } = await admin
    .from("saas_credit_ledger")
    .select("type,delta")
    .eq("user_id", userId);

  if (error) return { standard: 0, hd: 0, error: error.message };

  let standard = 0, hd = 0;
  for (const row of (data ?? [])) {
    if (row.type === "STANDARD") standard += row.delta;
    else if (row.type === "HD")  hd       += row.delta;
  }

  return { standard: Math.max(0, standard), hd: Math.max(0, hd) };
}

export async function adminAddCredits(
  password: string,
  userId: string,
  type: "STANDARD" | "HD",
  amount: number
): Promise<{ balance: number; error?: string }> {
  if (!checkPassword(password)) return { balance: 0, error: "Wrong password" };

  // Validate env vars early so we surface a clear error
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return { balance: 0, error: "Missing SUPABASE_URL env var" };
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { balance: 0, error: "Missing SUPABASE_SERVICE_ROLE_KEY env var" };

  const admin = await createAdminClient();

  // Ensure a saas_profiles row exists — users who never confirmed their email
  // won't have one, which causes the FK on saas_credit_ledger to fail.
  const { data: authUser } = await admin.auth.admin.getUserById(userId);
  await admin.from("saas_profiles").upsert(
    {
      id:                userId,
      email:             authUser?.user?.email ?? "",
      marketing_consent: false,
      plan:              "free",
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  // Insert directly so we can inspect the error (addCredits() swallows it)
  const { error: insertError } = await admin.from("saas_credit_ledger").insert({
    user_id: userId,
    type,
    delta:  amount,
    reason: "admin_topup",
    ref_id: null,
  });

  if (insertError) {
    return { balance: 0, error: `Insert failed: ${insertError.message} (code ${insertError.code})` };
  }

  // Read back the new balance
  const { data, error: selectError } = await admin
    .from("saas_credit_ledger")
    .select("delta")
    .eq("user_id", userId)
    .eq("type", type);

  if (selectError) {
    return { balance: 0, error: `Balance fetch failed: ${selectError.message}` };
  }

  const balance = Math.max(0, (data ?? []).reduce((s: number, r: { delta: number }) => s + r.delta, 0));
  return { balance };
}
