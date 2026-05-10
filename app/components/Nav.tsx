"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: "rgba(8, 13, 26, 0.85)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(59, 130, 246, 0.12)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", flexShrink: 0,
          }}>⚡</div>
          <span style={{ fontSize: "17px", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
            Power Your House
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }} className="desktop-nav">
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={{
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              color: pathname === l.href ? "#60a5fa" : "#94a3b8",
              background: pathname === l.href ? "rgba(59,130,246,0.1)" : "transparent",
              transition: "color 0.15s, background 0.15s",
            }}>
              {l.label}
            </Link>
          ))}
          <a
            href="https://apps.shopify.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: "10px",
              padding: "9px 18px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              boxShadow: "0 2px 12px rgba(59,130,246,0.35)",
            }}
          >
            Get the App
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="mobile-menu-btn"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px",
            padding: "8px",
            color: "#94a3b8",
            fontSize: "18px",
            display: "none",
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          background: "#0d1424",
          borderTop: "1px solid rgba(59,130,246,0.12)",
          padding: "16px 24px",
        }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: "block",
              padding: "12px 0",
              fontSize: "16px",
              fontWeight: 600,
              color: pathname === l.href ? "#60a5fa" : "#94a3b8",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              {l.label}
            </Link>
          ))}
          <a
            href="https://apps.shopify.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              marginTop: "14px",
              padding: "13px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            Get the App
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
