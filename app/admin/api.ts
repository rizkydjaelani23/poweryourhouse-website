/**
 * Client-side wrappers for the admin API (/api/admin).
 *
 * These replace the old Server Actions in ./actions.ts. Same function names
 * and signatures, so the admin page barely changes — but because they hit a
 * plain API route (stable URL) instead of a hashed Server Action, open admin
 * tabs no longer break with "Failed to find Server Action" after a redeploy.
 */

export interface AdminData {
  totalGens:      number;
  todayGens:      number;
  weekGens:       number;
  hdGens:         number;
  totalGuests:    number;
  totalGuestGens: number;
  recentGens:     Array<{ id: string; user_id: string; type: string; colour_hex: string; status: string; created_at: string }>;
  guestRows:      Array<{ token: string; count: number; last_used: string }>;
  users:          Array<{ id: string; email?: string; created_at: string }>;
  balanceMap:     Record<string, { STANDARD: number; HD: number }>;
  emailMap:       Record<string, string>;
}

async function post(payload: Record<string, unknown>) {
  const res = await fetch("/api/admin", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload),
  });
  return res.json().catch(() => ({ error: "Bad response" }));
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const r = await post({ action: "login", password });
  return r?.ok === true;
}

export async function getAdminData(password: string): Promise<AdminData | { error: string }> {
  return post({ action: "data", password });
}

export async function getUserBalances(
  password: string,
  userId: string
): Promise<{ standard: number; hd: number; error?: string }> {
  const r = await post({ action: "balances", password, userId });
  return { standard: r.standard ?? 0, hd: r.hd ?? 0, error: r.error };
}

export async function adminAddCredits(
  password: string,
  userId: string,
  type: "STANDARD" | "HD",
  amount: number
): Promise<{ balance: number; error?: string }> {
  const r = await post({ action: "addCredits", password, userId, type, amount });
  return { balance: r.balance ?? 0, error: r.error };
}
