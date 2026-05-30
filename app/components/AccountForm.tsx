"use client";
import { useState } from "react";
import { createClient } from "../utils/supabase/client";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: "10px",
  background: "#111827", border: "1px solid #1e293b",
  color: "#e2e8f0", fontSize: "14px", outline: "none",
  boxSizing: "border-box",
};

interface Props {
  initialDisplayName: string;
  initialMarketing:   boolean;
  email:              string;
  memberSince:        string;
}

export default function AccountForm({ initialDisplayName, initialMarketing, email, memberSince }: Props) {
  const [displayName,      setDisplayName]      = useState(initialDisplayName);
  const [marketing,        setMarketing]        = useState(initialMarketing);
  const [saving,           setSaving]           = useState(false);
  const [saveMsg,          setSaveMsg]          = useState("");
  const [resetSending,     setResetSending]     = useState(false);
  const [resetMsg,         setResetMsg]         = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setSaveMsg("");
    const res = await fetch("/api/account/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, marketingConsent: marketing }),
    });
    setSaving(false);
    setSaveMsg(res.ok ? "✓ Saved" : "Failed to save — try again");
    if (res.ok) setTimeout(() => setSaveMsg(""), 3000);
  }

  async function handlePasswordReset() {
    setResetSending(true); setResetMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
    });
    setResetSending(false);
    setResetMsg(error ? `Error: ${error.message}` : "✓ Reset email sent — check your inbox");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "560px" }}>

      {/* Profile form */}
      <form onSubmit={handleSave}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e2e8f0", marginBottom: "18px" }}>Profile</h3>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Display name
          </label>
          <input
            type="text" value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Your name"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Email address
          </label>
          <input
            type="email" value={email} readOnly
            style={{ ...inputStyle, color: "#475569", cursor: "not-allowed" }}
          />
          <p style={{ fontSize: "11px", color: "#334155", marginTop: "4px" }}>Email address cannot be changed. Contact support if needed.</p>
        </div>

        {/* Marketing consent */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", borderRadius: "10px", background: "#111827", border: "1px solid #1e293b", marginBottom: "20px" }}>
          <button
            type="button"
            onClick={() => setMarketing(v => !v)}
            style={{
              flexShrink: 0, width: "40px", height: "22px", borderRadius: "999px",
              background: marketing ? "#3b82f6" : "#1e293b",
              border: "none", cursor: "pointer", position: "relative",
              transition: "background 0.2s",
            }}
          >
            <span style={{
              position: "absolute", top: "3px",
              left: marketing ? "21px" : "3px",
              width: "16px", height: "16px", borderRadius: "50%",
              background: "#fff", transition: "left 0.2s",
            }} />
          </button>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#e2e8f0", marginBottom: "2px" }}>Marketing emails</div>
            <div style={{ fontSize: "12px", color: "#475569" }}>Product updates, tips, and occasional offers. Unsubscribe any time.</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button type="submit" disabled={saving} style={{
            padding: "10px 22px", borderRadius: "10px",
            background: saving ? "#1e293b" : "linear-gradient(135deg, #3b82f6, #4f46e5)",
            color: saving ? "#475569" : "#fff",
            fontWeight: 700, fontSize: "14px", border: "none", cursor: saving ? "not-allowed" : "pointer",
          }}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saveMsg && (
            <span style={{ fontSize: "13px", color: saveMsg.startsWith("✓") ? "#10b981" : "#f87171", fontWeight: 600 }}>
              {saveMsg}
            </span>
          )}
        </div>
      </form>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

      {/* Password reset */}
      <div>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e2e8f0", marginBottom: "6px" }}>Password</h3>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>
          We&apos;ll send a reset link to <strong style={{ color: "#94a3b8" }}>{email}</strong>.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            type="button" onClick={handlePasswordReset} disabled={resetSending}
            style={{
              padding: "10px 20px", borderRadius: "10px",
              background: "transparent", border: "1px solid #1e293b",
              color: "#94a3b8", fontWeight: 700, fontSize: "14px",
              cursor: resetSending ? "not-allowed" : "pointer",
            }}
          >
            {resetSending ? "Sending…" : "Send reset email"}
          </button>
          {resetMsg && (
            <span style={{ fontSize: "13px", color: resetMsg.startsWith("✓") ? "#10b981" : "#f87171", fontWeight: 600 }}>
              {resetMsg}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

      {/* Account info */}
      <div>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#e2e8f0", marginBottom: "12px" }}>Account info</h3>
        <div style={{ fontSize: "13px", color: "#475569", lineHeight: 2 }}>
          <div>Member since: <span style={{ color: "#64748b" }}>{memberSince}</span></div>
        </div>
      </div>
    </div>
  );
}
