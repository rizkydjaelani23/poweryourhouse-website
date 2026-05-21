"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "../utils/supabase/client";

export default function SignupPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [consent,  setConsent]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback?next=/generate`,
        data: { marketing_consent: consent },
      },
    });

    setLoading(false);
    if (signUpError) { setError(signUpError.message); return; }
    setDone(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #3b82f6, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>⚡</div>
            <span style={{ fontSize: "17px", fontWeight: 800, color: "#fff" }}>Power Your House</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: "12px 0 6px" }}>Create your free account</h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>5 free standard images + 1 free HD render included</p>
        </div>

        {done ? (
          <div style={{ padding: "24px", borderRadius: "16px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)", textAlign: "center" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>📧</div>
            <h2 style={{ color: "#34d399", fontWeight: 700, marginBottom: "8px" }}>Check your email</h2>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.7 }}>
              We sent a confirmation link to <strong style={{ color: "#e2e8f0" }}>{email}</strong>.<br />
              Click it to activate your account and get your free credits.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "24px", borderRadius: "16px", background: "#0d1424", border: "1px solid rgba(59,130,246,0.15)" }}>

              <Field label="Email address">
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </Field>

              <Field label="Password" style={{ marginTop: "14px" }}>
                <input
                  type="password" required minLength={8} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  style={inputStyle}
                />
              </Field>

              {/* Marketing consent */}
              <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "18px", cursor: "pointer" }}>
                <div
                  onClick={() => setConsent((v) => !v)}
                  style={{
                    marginTop: "2px", width: "18px", height: "18px", flexShrink: 0, borderRadius: "5px",
                    border: consent ? "2px solid #3b82f6" : "2px solid #334155",
                    background: consent ? "#3b82f6" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                >
                  {consent && <span style={{ color: "#fff", fontSize: "11px", fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>
                  Send me tips, product updates, and special offers. You can unsubscribe at any time.
                </span>
              </label>
            </div>

            {error && (
              <div style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontSize: "14px" }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{ padding: "14px", borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6, #4f46e5)", color: "#fff", fontWeight: 700, fontSize: "15px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating account…" : "Create free account →"}
            </button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#475569" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#60a5fa", fontWeight: 600 }}>Sign in</Link>
            </p>

            <p style={{ textAlign: "center", fontSize: "12px", color: "#334155", lineHeight: 1.6 }}>
              By signing up you agree to our{" "}
              <Link href="/terms" style={{ color: "#475569", textDecoration: "underline" }}>Terms</Link>{" "}
              and{" "}
              <Link href="/privacy" style={{ color: "#475569", textDecoration: "underline" }}>Privacy Policy</Link>.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  background: "#111827", border: "1px solid #1e293b",
  color: "#e2e8f0", fontSize: "15px", outline: "none",
  boxSizing: "border-box",
};
