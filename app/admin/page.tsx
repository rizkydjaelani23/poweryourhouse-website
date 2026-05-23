"use client";
import { useState, useEffect, useCallback } from "react";
import { verifyAdminPassword, getAdminData, adminAddCredits } from "./actions";

// ── tiny helpers ──────────────────────────────────────────────────────────────

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

const CARD: React.CSSProperties = {
  background: "#0d1424", border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "16px", padding: "24px",
};
const TH: React.CSSProperties = {
  padding: "10px 14px", fontSize: "11px", fontWeight: 700,
  color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em",
  textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.06)",
};
const TD: React.CSSProperties = {
  padding: "11px 14px", fontSize: "13px", color: "#cbd5e1",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
};

// ── Login screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw]       = useState("");
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const ok = await verifyAdminPassword(pw);
    if (ok) {
      sessionStorage.setItem("admin_pw", pw);
      onLogin(pw);
    } else {
      setErr("Wrong password");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#040912" }}>
      <form onSubmit={submit} style={{
        background: "#0d1424", border: "1px solid rgba(59,130,246,0.2)",
        borderRadius: "20px", padding: "48px 40px", width: "100%", maxWidth: "380px",
        display: "flex", flexDirection: "column", gap: "16px",
      }}>
        <div style={{ fontSize: "28px", textAlign: "center" }}>🔐</div>
        <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, textAlign: "center", margin: 0 }}>Admin Access</h1>
        <input
          type="password" placeholder="Password" value={pw}
          onChange={e => setPw(e.target.value)} autoFocus
          style={{
            background: "#0b1120", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", padding: "12px 16px", color: "#fff",
            fontSize: "15px", outline: "none", width: "100%", boxSizing: "border-box",
          }}
        />
        {err && (
          <p style={{ color: "#f87171", fontSize: "13px", margin: 0, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "10px 12px" }}>
            {err}
          </p>
        )}
        <button type="submit" disabled={loading} style={{
          background: "linear-gradient(135deg,#3b82f6,#4f46e5)", color: "#fff",
          fontWeight: 700, fontSize: "15px", padding: "13px", borderRadius: "10px",
          border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Checking…" : "Sign in →"}
        </button>
      </form>
    </div>
  );
}

// ── Credit top-up row ─────────────────────────────────────────────────────────

function UserRow({ u, balanceMap, password }: { u: { id: string; email?: string; created_at: string }; balanceMap: Record<string, { STANDARD: number; HD: number }>; password: string }) {
  const [std, setStd]       = useState(Math.max(0, balanceMap[u.id]?.STANDARD ?? 0));
  const [hd, setHd]         = useState(Math.max(0, balanceMap[u.id]?.HD ?? 0));
  const [adding, setAdding] = useState<"STANDARD" | "HD" | null>(null);
  const [amount, setAmount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash]   = useState("");
  const [err, setErr]       = useState("");

  async function topUp(type: "STANDARD" | "HD") {
    setLoading(true); setErr("");
    const result = await adminAddCredits(password, u.id, type, Number(amount));
    if (result.error) { setErr(result.error); setLoading(false); return; }
    if (type === "STANDARD") setStd(result.balance);
    else setHd(result.balance);
    setFlash(`+${amount} ${type === "STANDARD" ? "standard" : "HD"}`);
    setTimeout(() => setFlash(""), 3000);
    setAdding(null);
    setLoading(false);
  }

  function CreditCell({ type, value, colour }: { type: "STANDARD" | "HD"; value: number; colour: string }) {
    const isOpen = adding === type;
    const accent = type === "STANDARD" ? "#3b82f6" : "#8b5cf6";
    const accentFaint = type === "STANDARD" ? "rgba(59,130,246,0.2)" : "rgba(139,92,246,0.2)";
    const accentText  = type === "STANDARD" ? "#60a5fa" : "#a78bfa";
    return (
      <td style={TD}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, color: value === 0 ? "#ef4444" : colour, minWidth: "24px" }}>{value}</span>
          {isOpen ? (
            <span style={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" }}>
              <input type="number" value={amount} min={1} autoFocus
                onChange={e => setAmount(Number(e.target.value))}
                style={{ width: "60px", background: "#0b1120", border: `1px solid ${accentFaint}`, borderRadius: "6px", padding: "3px 8px", color: "#fff", fontSize: "13px", outline: "none" }}
              />
              <button onClick={() => topUp(type)} disabled={loading} style={{ background: accent, border: "none", borderRadius: "6px", color: "#fff", fontSize: "12px", fontWeight: 700, padding: "4px 12px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
                {loading ? "…" : "Add"}
              </button>
              <button onClick={() => { setAdding(null); setErr(""); }} style={{ background: "transparent", border: "none", color: "#475569", fontSize: "16px", cursor: "pointer", lineHeight: 1 }}>✕</button>
              {err && <span style={{ fontSize: "11px", color: "#f87171", width: "100%" }}>⚠ {err}</span>}
            </span>
          ) : (
            <button onClick={() => { setAdding(type); setErr(""); }} style={{ background: `rgba(${type === "STANDARD" ? "59,130,246" : "139,92,246"},0.1)`, border: `1px solid ${accentFaint}`, borderRadius: "5px", color: accentText, fontSize: "12px", fontWeight: 700, padding: "2px 8px", cursor: "pointer" }}>+</button>
          )}
        </div>
      </td>
    );
  }

  return (
    <tr>
      <td style={{ ...TD, maxWidth: "200px" }}>
        <span style={{ fontSize: "12px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email ?? "—"}</span>
      </td>
      <CreditCell type="STANDARD" value={std} colour="#60a5fa" />
      <CreditCell type="HD"       value={hd}  colour="#a78bfa" />
      <td style={{ ...TD, fontSize: "12px", color: "#475569" }}>
        {new Date(u.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
        {flash && <span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: 700, color: "#22c55e" }}>✓ {flash}</span>}
      </td>
    </tr>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────

type AdminData = Awaited<ReturnType<typeof getAdminData>> & { error?: never };

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [data, setData]       = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr]         = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const result = await getAdminData(password);
    if ("error" in result && result.error) { setErr(result.error); setLoading(false); return; }
    setData(result as AdminData);
    setLoading(false);
  }, [password]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#040912", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#475569" }}>Loading…</p>
    </div>
  );

  if (err || !data) return (
    <div style={{ minHeight: "100vh", background: "#040912", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#ef4444" }}>{err || "Failed to load"}</p>
    </div>
  );

  const { totalGens, todayGens, weekGens, hdGens, totalGuests, totalGuestGens, recentGens, guestRows, users, balanceMap, emailMap } = data;
  const lowCredit = users.filter(u => (balanceMap[u.id]?.STANDARD ?? 0) <= 0);

  const stats1 = [
    { label: "Total Generations", value: totalGens,      colour: "#3b82f6", icon: "🖼️" },
    { label: "Today",             value: todayGens,      colour: "#22c55e", icon: "📅" },
    { label: "This Week",         value: weekGens,       colour: "#8b5cf6", icon: "📈" },
    { label: "HD Generations",    value: hdGens,         colour: "#f59e0b", icon: "✨" },
    { label: "Guest Trials",      value: totalGuestGens, colour: "#06b6d4", icon: "👤" },
  ];
  const stats2 = [
    { label: "Signed-up Users",  value: users.length,                           colour: "#ec4899", icon: "👥" },
    { label: "Guest Sessions",   value: totalGuests,                            colour: "#f97316", icon: "🕵️" },
    { label: "Standard Gens",    value: totalGens - hdGens,                     colour: "#64748b", icon: "⚡" },
    { label: "Out of Credits",   value: lowCredit.length,                       colour: "#ef4444", icon: "🔴" },
    { label: "Avg / User",       value: users.length ? Math.round((totalGens / users.length) * 10) / 10 : 0, colour: "#a78bfa", icon: "📊" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#040912", paddingTop: "80px" }}>
      <style>{`
        .sg { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; }
        .tc { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
        @media(max-width:1100px){ .sg { grid-template-columns:repeat(3,1fr); } }
        @media(max-width:760px) { .sg { grid-template-columns:repeat(2,1fr); } .tc { grid-template-columns:1fr; } }
        table { width:100%; border-collapse:collapse; }
        tr:last-child td { border-bottom:none !important; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: 900, margin: 0 }}>⚡ Admin Dashboard</h1>
            <p style={{ color: "#475569", fontSize: "13px", margin: "4px 0 0" }}>
              {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={load} style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "8px", padding: "8px 14px", color: "#60a5fa", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>↻ Refresh</button>
            <button onClick={onLogout} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 16px", color: "#64748b", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Sign out</button>
          </div>
        </div>

        {/* Stat cards row 1 */}
        <div className="sg" style={{ marginBottom: "14px" }}>
          {stats1.map(s => (
            <div key={s.label} style={{ ...CARD, borderTop: `3px solid ${s.colour}` }}>
              <div style={{ fontSize: "22px", marginBottom: "10px" }}>{s.icon}</div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{s.value.toLocaleString()}</div>
              <div style={{ fontSize: "11px", color: "#475569", fontWeight: 600, marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Stat cards row 2 */}
        <div className="sg" style={{ marginBottom: "32px" }}>
          {stats2.map(s => (
            <div key={s.label} style={{ ...CARD, borderTop: `3px solid ${s.colour}` }}>
              <div style={{ fontSize: "22px", marginBottom: "10px" }}>{s.icon}</div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{s.value.toLocaleString()}</div>
              <div style={{ fontSize: "11px", color: "#475569", fontWeight: 600, marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recent generations */}
        <div style={{ ...CARD, marginBottom: "20px" }}>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "0 0 18px" }}>🖼️ Recent Generations</h2>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr>{["User","Type","Colour","Status","When"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
              <tbody>
                {recentGens.slice(0, 30).map((g: { id: string; user_id: string; type: string; colour_hex: string; status: string; created_at: string }) => (
                  <tr key={g.id}>
                    <td style={TD}><span style={{ fontSize: "12px", color: "#64748b" }}>{emailMap[g.user_id] ?? g.user_id.slice(0, 8)}</span></td>
                    <td style={TD}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: g.type === "HD" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.12)", color: g.type === "HD" ? "#f59e0b" : "#60a5fa" }}>{g.type}</span>
                    </td>
                    <td style={TD}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "18px", height: "18px", borderRadius: "4px", background: g.colour_hex ?? "#888", border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
                        <span style={{ fontFamily: "monospace", fontSize: "12px", color: "#64748b" }}>{g.colour_hex ?? "—"}</span>
                      </div>
                    </td>
                    <td style={TD}>
                      <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: g.status === "done" ? "rgba(34,197,94,0.12)" : "rgba(100,116,139,0.12)", color: g.status === "done" ? "#22c55e" : "#64748b" }}>{g.status}</span>
                    </td>
                    <td style={{ ...TD, color: "#475569", fontSize: "12px" }}>{ago(g.created_at)}</td>
                  </tr>
                ))}
                {!recentGens.length && <tr><td colSpan={5} style={{ ...TD, textAlign: "center", color: "#475569" }}>No generations yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="tc">
          {/* Users table */}
          <div style={CARD}>
            <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "0 0 18px" }}>👥 Users ({users.length})</h2>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead><tr>{["Email","⚡ Std","✨ HD","Joined"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                  {users.map(u => <UserRow key={u.id} u={u} balanceMap={balanceMap} password={password} />)}
                  {!users.length && <tr><td colSpan={4} style={{ ...TD, textAlign: "center", color: "#475569" }}>No users yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Guest trials */}
            <div style={CARD}>
              <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "0 0 18px" }}>🕵️ Guest Trials</h2>
              <table>
                <thead><tr>{["Token","Uses","Last seen"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                  {guestRows.map((g: { token: string; count: number; last_used: string }) => (
                    <tr key={g.token}>
                      <td style={{ ...TD, fontFamily: "monospace", fontSize: "11px", color: "#64748b" }}>{g.token?.slice(0, 12)}…</td>
                      <td style={TD}><span style={{ fontWeight: 700, color: g.count >= 2 ? "#f59e0b" : "#22c55e" }}>{g.count}/2</span></td>
                      <td style={{ ...TD, fontSize: "12px", color: "#475569" }}>{ago(g.last_used)}</td>
                    </tr>
                  ))}
                  {!guestRows.length && <tr><td colSpan={3} style={{ ...TD, textAlign: "center", color: "#475569" }}>No guest sessions yet</td></tr>}
                </tbody>
              </table>
            </div>

            {/* Out of credits */}
            {lowCredit.length > 0 && (
              <div style={{ ...CARD, borderColor: "rgba(239,68,68,0.25)" }}>
                <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: 800, margin: "0 0 6px" }}>🔴 Out of Standard Credits</h2>
                <p style={{ color: "#64748b", fontSize: "12px", margin: "0 0 16px" }}>Prime upsell targets</p>
                <table>
                  <thead><tr>{["Email","HD left"].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {lowCredit.map(u => (
                      <tr key={u.id}>
                        <td style={{ ...TD, fontSize: "12px" }}>{u.email ?? "—"}</td>
                        <td style={TD}><span style={{ fontWeight: 700, color: "#a78bfa" }}>{Math.max(0, balanceMap[u.id]?.HD ?? 0)}</span></td>
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

// ── Root page ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [ready, setReady]       = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_pw");
    if (stored) setPassword(stored);
    setReady(true);
  }, []);

  function logout() {
    sessionStorage.removeItem("admin_pw");
    setPassword(null);
  }

  if (!ready) return null;
  if (!password) return <LoginScreen onLogin={setPassword} />;
  return <Dashboard password={password} onLogout={logout} />;
}
