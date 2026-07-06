/**
 * POST /api/admin
 *
 * Single admin endpoint. Replaces the old Server Actions (which broke with
 * "Failed to find Server Action" after every redeploy, because Next.js hashes
 * action IDs per build). A plain API route has a stable URL, so open admin
 * tabs keep working across deploys.
 *
 * Body: { action, password, ...params }
 *   action "login"      → { ok }                    verify password
 *   action "data"       → full dashboard payload
 *   action "balances"   → { standard, hd }          for one user
 *   action "addCredits" → { balance }               top up one user
 *
 * The password is checked on every call (same as the old actions did).
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "../../utils/supabase/server";

export const runtime = "nodejs";

function checkPassword(password: string): boolean {
  const expected = (process.env.ADMIN_PASSWORD ?? "").trim();
  return !!expected && (password ?? "").trim() === expected;
}

async function getData() {
  const admin = await createAdminClient();

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

  const sortedUsers = [...users]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(u => ({ id: u.id, email: u.email, created_at: u.created_at }));

  const totalGuestGens = (guestRows ?? []).reduce((s, r) => s + (r.count ?? 0), 0);

  return {
    totalGens:   totalGens ?? 0,
    todayGens:   todayGens ?? 0,
    weekGens:    weekGens ?? 0,
    hdGens:      hdGens ?? 0,
    totalGuests: totalGuests ?? 0,
    totalGuestGens,
    recentGens:  recentGens ?? [],
    guestRows:   guestRows ?? [],
    users:       sortedUsers,
    balanceMap,
    emailMap,
  };
}

async function getBalances(userId: string) {
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

async function addCredits(userId: string, type: "STANDARD" | "HD", amount: number) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL)  return { balance: 0, error: "Missing SUPABASE_URL env var" };
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { balance: 0, error: "Missing SUPABASE_SERVICE_ROLE_KEY env var" };
  if (!amount || amount < 1)                  return { balance: 0, error: "Amount must be at least 1" };

  const admin = await createAdminClient();

  // Ensure a saas_profiles row exists (unconfirmed users won't have one → FK fails)
  const { data: authUser } = await admin.auth.admin.getUserById(userId);
  const { error: upsertErr } = await admin.from("saas_profiles").upsert(
    { id: userId, email: authUser?.user?.email ?? "", marketing_consent: false, plan: "free" },
    { onConflict: "id", ignoreDuplicates: true }
  );
  if (upsertErr) return { balance: 0, error: `Profile upsert failed: ${upsertErr.message}` };

  const { error: insertError } = await admin.from("saas_credit_ledger").insert({
    user_id: userId, type, delta: amount, reason: "admin_topup", ref_id: null,
  });
  if (insertError) return { balance: 0, error: `Insert failed: ${insertError.message} (code ${insertError.code})` };

  const { data, error: selectError } = await admin
    .from("saas_credit_ledger")
    .select("delta")
    .eq("user_id", userId)
    .eq("type", type);
  if (selectError) return { balance: 0, error: `Balance fetch failed: ${selectError.message}` };

  const balance = Math.max(0, (data ?? []).reduce((s: number, r: { delta: number }) => s + r.delta, 0));
  return { balance };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { action, password } = body;

    if (!checkPassword(password)) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    switch (action) {
      case "login":
        return NextResponse.json({ ok: true });
      case "data":
        return NextResponse.json(await getData());
      case "balances":
        if (!body.userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
        return NextResponse.json(await getBalances(body.userId));
      case "addCredits": {
        const { userId, type, amount } = body;
        if (!userId || (type !== "STANDARD" && type !== "HD")) {
          return NextResponse.json({ error: "userId and valid type required" }, { status: 400 });
        }
        return NextResponse.json(await addCredits(userId, type, Number(amount)));
      }
      default:
        return NextResponse.json({ error: `Unknown action "${action}"` }, { status: 400 });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[api/admin]", msg);
    return NextResponse.json({ error: `Unexpected error: ${msg}` }, { status: 500 });
  }
}
