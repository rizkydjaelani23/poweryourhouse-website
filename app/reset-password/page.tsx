"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

export default function ResetPasswordPage() {
  const router   = useRouter();
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState(false);
  const [hasSession, setHasSession] = useState(false);

  // The auth callback exchanged the recovery code for a session before
  // redirecting here — verify we actually have one.
  useEffect(() => {
    createClient().auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters."); return; }

    setLoading(true); setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (err) { setError(err.message); return; }
    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2500);
  }

  if (!hasSession) return (
    <div style={{ minHeight: "100vh", background: "#080d1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#64748b" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔒</div>
        <p>Invalid or expired reset link.</p>
        <a href="/login" style={{ color: "#60a5fa" }}>Back to login →</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px", background: "#0d1424", border: "1px solid rgba(59,130,246,0.15)", borderRadius: "20px", padding: "40px 36px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>Set new password</h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "28px" }}>Choose a strong password for your account.</p>

        {success ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "42px", marginBottom: "12px" }}>✅</div>
            <p style={{ color: "#10b981", fontWeight: 700, fontSize: "15px" }}>Password updated!</p>
            <p style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}>Redirecting to dashboard…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>
              New password
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters" required minLength={8}
              style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", background: "#111827", border: "1px solid #1e293b", color: "#e2e8f0", fontSize: "14px", outline: "none", marginBottom: "16px", boxSizing: "border-box" }}
            />
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>
              Confirm password
            </label>
            <input
              type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat your password" required
              style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", background: "#111827", border: "1px solid #1e293b", color: "#e2e8f0", fontSize: "14px", outline: "none", marginBottom: "20px", boxSizing: "border-box" }}
            />
            {error && (
              <div style={{ padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px", marginBottom: "16px" }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px", borderRadius: "11px",
              background: loading ? "#1e293b" : "linear-gradient(135deg, #3b82f6, #4f46e5)",
              color: loading ? "#475569" : "#fff", fontWeight: 700, fontSize: "15px",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
            }}>
              {loading ? "Updating…" : "Update password →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
