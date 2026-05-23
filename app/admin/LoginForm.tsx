"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [pw, setPw]       = useState("");
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (res.ok) { router.refresh(); }
    else { setErr("Wrong password"); }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#040912",
    }}>
      <form onSubmit={submit} style={{
        background: "#0d1424", border: "1px solid rgba(59,130,246,0.2)",
        borderRadius: "20px", padding: "48px 40px", width: "100%", maxWidth: "380px",
        display: "flex", flexDirection: "column", gap: "16px",
      }}>
        <div style={{ fontSize: "28px", textAlign: "center" }}>🔐</div>
        <h1 style={{ color: "#fff", fontSize: "20px", fontWeight: 800, textAlign: "center", margin: 0 }}>
          Admin Access
        </h1>
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          autoFocus
          style={{
            background: "#0b1120", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", padding: "12px 16px",
            color: "#fff", fontSize: "15px", outline: "none", width: "100%",
          }}
        />
        {err && <p style={{ color: "#ef4444", fontSize: "13px", margin: 0 }}>{err}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "linear-gradient(135deg,#3b82f6,#4f46e5)",
            color: "#fff", fontWeight: 700, fontSize: "15px",
            padding: "13px", borderRadius: "10px", border: "none",
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Checking…" : "Sign in →"}
        </button>
      </form>
    </div>
  );
}
