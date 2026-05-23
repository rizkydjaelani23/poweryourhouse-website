"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { Suspense } from "react";

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get("redirect") || "/generate";
  const authError    = searchParams.get("error");

  const [email,    setEmail]    = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(
    authError === "auth" ? "Something went wrong. Please try again." : null
  );

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #3b82f6, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>⚡</div>
            <span style={{ fontSize: "17px", fontWeight: 800, color: "#fff" }}>Power Your House</span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: "12px 0 6px" }}>Welcome back</h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ padding: "24px", borderRadius: "16px", background: "#0d1424", border: "1px solid rgba(59,130,246,0.15)" }}>

            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" style={inputStyle} />
            </div>
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
            {loading ? "Signing in…" : "Sign in →"}
          </button>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#475569" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "#60a5fa", fontWeight: 600 }}>Sign up free</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: 700, color: "#64748b",
  marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em",
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  background: "#111827", border: "1px solid #1e293b",
  color: "#e2e8f0", fontSize: "15px", outline: "none", boxSizing: "border-box",
};
