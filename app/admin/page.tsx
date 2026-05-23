import { cookies } from "next/headers";
import { createAdminClient } from "../utils/supabase/server";
import LoginForm from "./LoginForm";
import LogoutButton from "./LogoutButton";
import TopUpRow from "./TopUpRow";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Power Your House", robots: "noindex" };
export const dynamic = "force-dynamic";

// ── helpers ─────────────────────────────────────────────────────────────────

function fmt(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-AU", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function ago(date: string | null) {
  if (!date) return "—";
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const CARD = {
  background: "#0d1424",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px",
  padding: "24px",
} as const;

const TH: React.CSSProperties = {
  padding: "10px 14px", fontSize: "11px", fontWeight: 700,
  color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em",
  textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)",
};
const TD: React.CSSProperties = {
  padding: "11px 14px", fontSize: "13px", color: "#cbd5e1",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
};

// ── page ────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  // ── Auth gate ───────────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const token = cookieStore.get("pyh_admin")?.value;
  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return <LoginForm />;
  }

  // ── Fetch data ──────────────────────────────────────────────────────────
  const admin = await createAdminClient();

  const nowIso   = new Date().toISOString();
  const todayIso = nowIso.slice(0, 10) + "T00:00:00.000Z";
  const weekAgo  = new Date(Date.now() - 7 * 86400000).toISOString();

  // Parallel fetches
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
    admin.from("saas_guest_usage").select("*", { count: "exact", head: true }),
    admin.from("saas_generations").select("id,user_id,type,colour_hex,status,created_at").order("created_at", { ascending: false }).limit(40),
    admin.from("saas_guest_usage").select("*").order("last_used", { ascending: false }),
    admin.from("saas_credit_ledger").select("user_id,type,delta"),
    admin.auth.admin.listUsers({ page: 1, perPage: 100 }),
  ]);

  const users = authResult.data?.users ?? [];

  // Build credit balance map: { userId: { STANDARD: n, HD: n } }
  const balanceMap: Record<string, { STANDARD: number; HD: number }> = {};
  for (const row of (ledgerRows ?? [])) {
    if (!balanceMap[row.user_id]) balanceMap[row.user_id] = { STANDARD: 0, HD: 0 };
    balanceMap[row.user_id][row.type as "STANDARD" | "HD"] += row.delta;
  }

  // Build email map
  const emailMap: Record<string, string> = {};
  for (const u of users) emailMap[u.id] = u.email ?? u.id.slice(0, 8);

  // Generation count per user
  const genCountMap: Record<string, number> = {};
  for (const g of (recentGens ?? [])) {
    genCountMap[g.user_id] = (genCountMap[g.user_id] ?? 0) + 1;
  }

  // Users sorted by sign-up date desc
  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Low-credit users (0 standard left)
  const lowCreditUsers = sortedUsers.filter(u => (balanceMap[u.id]?.STANDARD ?? 0) <= 0);

  // Total guest gens
  const totalGuestGens = (guestRows ?? []).reduce((s, r) => s + (r.count ?? 0), 0);

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#040912", paddingTop: "80px" }}>
      <style>{`
        .stat-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 14px; }
        .two-col   { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media(max-width:1100px){ .stat-grid { grid-template-columns: repeat(3,1fr); } }
        @media(max-width:760px) { .stat-grid { grid-template-columns: repeat(2,1fr); } .two-col { grid-template-columns:1fr; } }
        table { width: 100%; border-collapse: collapse; }
        tr:last-child td { border-bottom: none !important; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 900, margin: 0 }}>
              ⚡ Admin Dashboard
            </h1>
            <p style={{ color: "#475569", fontSize: "13px", margin: "4px 0 0" }}>
              Power Your House · {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* ── Stat cards ── */}
        <div className="stat-grid" style={{ marginBottom: "24px" }}>
          {[
            { label: "Total Generations", value: totalGens ?? 0,      colour: "#3b82f6", icon: "🖼️" },
            { label: "Today",             value: todayGens ?? 0,      colour: "#22c55e", icon: "📅" },
            { label: "This Week",         value: weekGens ?? 0,       colour: "#8b5cf6", icon: "📈" },
            { label: "HD Generations",    value: hdGens ?? 0,         colour: "#f59e0b", icon: "✨" },
            { label: "Guest Trials",      value: totalGuestGens,      colour: "#06b6d4", icon: "👤" },
          ].map(s => (
            <div key={s.label} style={{ ...CARD, borderTop: `3px solid ${s.colour}` }}>
              <div style={{ fontSize: "22px", marginBottom: "10px" }}>{s.icon}</div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{s.value.toLocaleString()}</div>
              <div style={{ fontSize: "12px", color: "#475569", fontWeight: 600, marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Second row: users + guests */}
        <div className="stat-grid" style={{ marginBottom: "32px" }}>
          {[
            { label: "Signed-up Users",  value: users.length,              colour: "#ec4899", icon: "👥" },
            { label: "Guest Sessions",   value: totalGuests ?? 0,          colour: "#f97316", icon: "🕵️" },
            { label: "Standard Gens",    value: (totalGens ?? 0) - (hdGens ?? 0), colour: "#64748b", icon: "⚡" },
            { label: "Out of Credits",   value: lowCreditUsers.length,     colour: "#ef4444", icon: "🔴" },
            { label: "Avg / User",       value: users.length ? Math.round((totalGens ?? 0) / users.length * 10) / 10 : 0, colour: "#a78bfa", icon: "📊" },
          ].map(s => (
            <div key={s.label} style={{ ...CARD, borderTop: `3px solid ${s.colour}` }}>
              <div style={{ fontSize: "22px", marginBottom: "10px" }}>{s.icon}</div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{s.value.toLocaleString()}</div>
              <div style={{ fontSize: "12px", color: "#475569", fontWeight: 600, marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Recent Generations ── */}
        <div style={{ ...CARD, marginBottom: "20px" }}>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "0 0 18px" }}>
            🖼️ Recent Generations
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  {["User", "Type", "Colour", "Status", "When"].map(h => (
                    <th key={h} style={TH}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(recentGens ?? []).slice(0, 30).map(g => (
                  <tr key={g.id}>
                    <td style={TD}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {emailMap[g.user_id] ?? g.user_id.slice(0, 8)}
                      </span>
                    </td>
                    <td style={TD}>
                      <span style={{
                        fontSize: "11px", fontWeight: 700, padding: "2px 8px",
                        borderRadius: "999px",
                        background: g.type === "HD" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.12)",
                        color: g.type === "HD" ? "#f59e0b" : "#60a5fa",
                      }}>
                        {g.type}
                      </span>
                    </td>
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                          width: "18px", height: "18px", borderRadius: "4px",
                          background: g.colour_hex ?? "#888",
                          border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0,
                        }} />
                        <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#64748b" }}>
                          {g.colour_hex ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td style={TD}>
                      <span style={{
                        fontSize: "11px", fontWeight: 700, padding: "2px 8px",
                        borderRadius: "999px",
                        background: g.status === "done" ? "rgba(34,197,94,0.12)" : "rgba(100,116,139,0.12)",
                        color: g.status === "done" ? "#22c55e" : "#64748b",
                      }}>
                        {g.status}
                      </span>
                    </td>
                    <td style={{ ...TD, color: "#475569", fontSize: "12px" }}>{ago(g.created_at)}</td>
                  </tr>
                ))}
                {!recentGens?.length && (
                  <tr><td colSpan={5} style={{ ...TD, textAlign: "center", color: "#475569" }}>No generations yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="two-col">
          {/* ── Users ── */}
          <div style={CARD}>
            <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "0 0 18px" }}>
              👥 Users ({users.length})
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    {["Email", "⚡ Std", "✨ HD", "Joined"].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map(u => (
                    <TopUpRow
                      key={u.id}
                      userId={u.id}
                      email={u.email ?? "—"}
                      initStd={Math.max(0, balanceMap[u.id]?.STANDARD ?? 0)}
                      initHd={Math.max(0, balanceMap[u.id]?.HD ?? 0)}
                      joinDate={new Date(u.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                    />
                  ))}
                  {!users.length && (
                    <tr><td colSpan={4} style={{ ...TD, textAlign: "center", color: "#475569" }}>No users yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Guest Trials + Low Credits ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Guest trials */}
            <div style={CARD}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "0 0 18px" }}>
                🕵️ Guest Trials
              </h2>
              <table>
                <thead>
                  <tr>
                    {["Token", "Uses", "Last seen"].map(h => (
                      <th key={h} style={TH}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(guestRows ?? []).map(g => (
                    <tr key={g.token}>
                      <td style={{ ...TD, fontFamily: "monospace", fontSize: "11px", color: "#64748b" }}>
                        {g.token?.slice(0, 12)}…
                      </td>
                      <td style={TD}>
                        <span style={{ fontWeight: 700, color: g.count >= 2 ? "#f59e0b" : "#22c55e" }}>
                          {g.count}/2
                        </span>
                      </td>
                      <td style={{ ...TD, fontSize: "12px", color: "#475569" }}>
                        {ago(g.last_used)}
                      </td>
                    </tr>
                  ))}
                  {!guestRows?.length && (
                    <tr><td colSpan={3} style={{ ...TD, textAlign: "center", color: "#475569" }}>No guest sessions yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Out of credits — potential upsell */}
            {lowCreditUsers.length > 0 && (
              <div style={{ ...CARD, borderColor: "rgba(239,68,68,0.25)" }}>
                <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "0 0 6px" }}>
                  🔴 Out of Standard Credits
                </h2>
                <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 16px" }}>
                  These users are out — prime upsell targets
                </p>
                <table>
                  <thead>
                    <tr>
                      {["Email", "HD left"].map(h => (
                        <th key={h} style={TH}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lowCreditUsers.map(u => (
                      <tr key={u.id}>
                        <td style={{ ...TD, fontSize: "12px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {u.email ?? "—"}
                        </td>
                        <td style={TD}>
                          <span style={{ fontWeight: 700, color: "#a78bfa" }}>
                            {Math.max(0, balanceMap[u.id]?.HD ?? 0)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
