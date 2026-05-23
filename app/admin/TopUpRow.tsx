"use client";
import { useState } from "react";
import { adminAddCredits } from "./actions";

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
  const [std, setStd]       = useState(initStd);
  const [hd, setHd]         = useState(initHd);
  const [adding, setAdding] = useState<"STANDARD" | "HD" | null>(null);
  const [amount, setAmount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash]   = useState("");
  const [err, setErr]       = useState("");

  async function topUp(type: "STANDARD" | "HD") {
    setLoading(true);
    setErr("");

    const result = await adminAddCredits(userId, type, Number(amount));

    if (result.error) {
      setErr(result.error);
      setLoading(false);
      return; // keep input open so they see the error
    }

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
    const accentMuted = type === "STANDARD" ? "rgba(59,130,246,0.2)" : "rgba(139,92,246,0.2)";
    const accentText  = type === "STANDARD" ? "#60a5fa" : "#a78bfa";

    return (
      <td style={TD}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, color: value === 0 ? "#ef4444" : colour, minWidth: "24px" }}>
            {value}
          </span>

          {isOpen ? (
            <span style={{ display: "flex", gap: "4px", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="number"
                value={amount}
                min={1}
                autoFocus
                onChange={e => setAmount(Number(e.target.value))}
                style={{
                  width: "60px", background: "#0b1120",
                  border: `1px solid ${accentMuted}`,
                  borderRadius: "6px", padding: "3px 8px",
                  color: "#fff", fontSize: "13px", outline: "none",
                }}
              />
              <button
                onClick={() => topUp(type)}
                disabled={loading}
                style={{
                  background: accent, border: "none", borderRadius: "6px",
                  color: "#fff", fontSize: "12px", fontWeight: 700,
                  padding: "4px 12px", cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Adding…" : "Add"}
              </button>
              <button
                onClick={() => { setAdding(null); setErr(""); }}
                style={{ background: "transparent", border: "none", color: "#475569", fontSize: "16px", cursor: "pointer", lineHeight: 1 }}
              >
                ✕
              </button>
              {err && (
                <span style={{ fontSize: "11px", color: "#f87171", width: "100%", marginTop: "2px" }}>
                  ⚠ {err}
                </span>
              )}
            </span>
          ) : (
            <button
              onClick={() => { setAdding(type); setErr(""); }}
              style={{
                background: `rgba(${type === "STANDARD" ? "59,130,246" : "139,92,246"},0.1)`,
                border: `1px solid ${accentMuted}`,
                borderRadius: "5px", color: accentText,
                fontSize: "12px", fontWeight: 700,
                padding: "2px 8px", cursor: "pointer",
              }}
            >
              +
            </button>
          )}
        </div>
      </td>
    );
  }

  return (
    <tr>
      <td style={{ ...TD, maxWidth: "200px" }}>
        <span style={{ fontSize: "12px", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {email}
        </span>
      </td>

      <CreditCell type="STANDARD" value={std} colour="#60a5fa" />
      <CreditCell type="HD"       value={hd}  colour="#a78bfa" />

      <td style={{ ...TD, fontSize: "12px", color: "#475569" }}>
        {joinDate}
        {flash && (
          <span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: 700, color: "#22c55e" }}>
            ✓ {flash}
          </span>
        )}
      </td>
    </tr>
  );
}
