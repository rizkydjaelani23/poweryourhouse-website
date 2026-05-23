"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin-login", { method: "DELETE" });
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      style={{
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        padding: "8px 16px",
        color: "#64748b",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Sign out
    </button>
  );
}
