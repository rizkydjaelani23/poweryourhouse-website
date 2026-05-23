"use client";
import { useState } from "react";

const TD: React.CSSProperties = {
  padding: "11px 14px", fontSize: "13px", color: "#cbd5e1",
  borderBottom: "1px solid rgba(255,255,255,0.04)",
};

interface Props {
  userId: string;
  email: string;
  initStd: number;
  initHd: number;
  joinDate: string;
}

export default function TopUpRow({ userId, email, initStd, initHd, joinDate }: Props) {
  const [std, setStd]         = useState(initStd);
  const [hd, setHd]           = useState(initHd);
  const [adding, setAdding]   = useState<"STANDARD" | "HD" | null>(null);
  const [amount, setAmount]   = useState(50);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash]     = useState("");

  async function topUp(type: "STANDARD" | "HD") {
    setLoading(true);
    const res = await fetch("/api/admin-credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type, amount }),
    });
    const data = await res.json();
    if (res.ok) {
      if (type === "STANDARD") setStd(data.balance);
      else setHd(data.balance);
      setFlash(`+${amount} ${type}`);
      setTimeout(() => setFlash(""), 2000);
    }
    setAdding(null);
    setLoading(false);
  }

  return (
    <tr>
      <td style={{ ...TD, maxWidth: "200px" }}>
        <span style={{ fontSize: "12px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {email}
        </span>
      </td>

      {/* Standard credits */}
      <td style={TD}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontWeight: 700, color: std === 0 ? "#ef4444" : "#60a5fa", minWidth: "24px" }}>
            {std}
          </span>
          {adding === "STANDARD" ? (
            <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <input
                type="number"
                value={amount}
                min={1}
                onChange={e => setAmount(Number(e.target.value))}
                style={{
                  width: "52px", background: "#0b1120", border: "1px solid rgba(59,130,246,0.3)",
                  borderRadius: "6px", padding: "2px 6px", color: "#fff", fontSize: "12px",
                }}
              />
              <button
                onClick={() => topUp("STANDARD")}
                disabled={loading}
                style={{ background: "#3b82f6", border: "none", borderRadius: "5px", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "3px 8px", cursor: "pointer" }}
              >
                {loading ? "…" : "✓"}
              </button>
              <button
                onClick={() => setAdding(null)}
                style={{ background: "transparent", border: "none", color: "#64748b", fontSize: "14px", cursor: "pointer", padding: "0 2px" }}
              >
                ✕
              </button>
            </span>
          ) : (
            <button
              onClick={() => setAdding("STANDARD")}
              title="Add standard credits"
              style={{
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: "5px", color: "#60a5fa", fontSize: "11px", fontWeight: 700,
                padding: "2px 7px", cursor: "pointer",
              }}
            >
              +
            </button>
          )}
        </div>
      </td>

      {/* HD credits */}
      <td style={TD}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontWeight: 700, color: hd > 0 ? "#a78bfa" : "#475569", minWidth: "24px" }}>
            {hd}
          </span>
          {adding === "HD" ? (
            <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
              <input
                type="number"
                value={amount}
                min={1}
                onChange={e => setAmount(Number(e.target.value))}
                style={{
                  width: "52px", background: "#0b1120", border: "1px solid rgba(139,92,246,0.3)",
                  borderRadius: "6px", padding: "2px 6px", color: "#fff", fontSize: "12px",
                }}
              />
              <button
                onClick={() => topUp("HD")}
                disabled={loading}
                style={{ background: "#8b5cf6", border: "none", borderRadius: "5px", color: "#fff", fontSize: "11px", fontWeight: 700, padding: "3px 8px", cursor: "pointer" }}
              >
                {loading ? "…" : "✓"}
              </button>
              <button
                onClick={() => setAdding(null)}
                style={{ background: "transparent", border: "none", color: "#64748b", fontSize: "14px", cursor: "pointer", padding: "0 2px" }}
              >
                ✕
              </button>
            </span>
          ) : (
            <button
              onClick={() => setAdding("HD")}
              title="Add HD credits"
              style={{
                background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)",
                borderRadius: "5px", color: "#a78bfa", fontSize: "11px", fontWeight: 700,
                padding: "2px 7px", cursor: "pointer",
              }}
            >
              +
            </button>
          )}
        </div>
      </td>

      <td style={{ ...TD, fontSize: "12px", color: "#475569" }}>
        {joinDate}
        {flash && (
          <span style={{
            marginLeft: "8px", fontSize: "11px", fontWeight: 700, color: "#22c55e",
            animation: "fadeOut 2s ease forwards",
          }}>
            ✓ {flash}
          </span>
        )}
      </td>
    </tr>
  );
}
