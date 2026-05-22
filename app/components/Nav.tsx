"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Credits { standard: number; hd: number }

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/shopify", label: "Shopify App" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [open,    setOpen]    = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user,    setUser]    = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [credits, setCredits] = useState<Credits | null>(null);

  // Scroll shadow
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoadingUser(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setCredits(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Fetch credits whenever user is set
  useEffect(() => {
    if (!user) return;
    fetch("/api/credits")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.standard !== undefined) setCredits(d); })
      .catch(() => {});
  }, [user]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isToolPage = pathname?.startsWith("/generate") || pathname?.startsWith("/dashboard");

  return (
    <header style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: scrolled ? "rgba(8, 13, 26, 0.95)" : "rgba(8, 13, 26, 0.85)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      borderBottom: scrolled
        ? "1px solid rgba(59, 130, 246, 0.2)"
        : "1px solid rgba(59, 130, 246, 0.12)",
      transition: "all 0.3s ease",
    }}>
      {scrolled && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, #3b82f6, #4f46e5, transparent)",
          pointerEvents: "none",
        }} />
      )}

      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", flexShrink: 0,
            animation: "pulse-glow 3s ease-in-out infinite",
          }}>⚡</div>
          <span style={{ fontSize: "17px", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
            Power Your House
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2px", flexWrap: "nowrap", minWidth: 0 }} className="desktop-nav">
          {mainLinks.map((l) => (
            <Link key={l.href} href={l.href} style={{
              padding: "8px 14px", borderRadius: "8px",
              fontSize: "14px", fontWeight: 600,
              color: pathname === l.href ? "#60a5fa" : "#94a3b8",
              background: pathname === l.href ? "rgba(59,130,246,0.1)" : "transparent",
              transition: "color 0.15s, background 0.15s",
              position: "relative",
            }}>
              {l.label}
              {pathname === l.href && (
                <span style={{
                  position: "absolute", bottom: "4px", left: "50%",
                  transform: "translateX(-50%)",
                  width: "4px", height: "4px", borderRadius: "50%",
                  background: "#60a5fa", display: "block",
                }} />
              )}
            </Link>
          ))}

          {/* ── Auth buttons ── */}
          {!loadingUser && (
            user ? (
              <>
                <Link href="/generate" style={{
                  marginLeft: "6px",
                  padding: "8px 14px", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 600,
                  color: pathname === "/generate" ? "#60a5fa" : "#94a3b8",
                  background: pathname === "/generate" ? "rgba(59,130,246,0.1)" : "transparent",
                  transition: "color 0.15s, background 0.15s",
                }}>
                  ✨ Generate
                </Link>
                <Link href="/bulk" style={{
                  padding: "8px 14px", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 600,
                  color: pathname === "/bulk" ? "#60a5fa" : "#94a3b8",
                  background: pathname === "/bulk" ? "rgba(59,130,246,0.1)" : "transparent",
                  transition: "color 0.15s, background 0.15s",
                }}>
                  ⚡ Bulk
                </Link>
                <Link href="/dashboard" style={{
                  padding: "8px 14px", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 600,
                  color: pathname === "/dashboard" ? "#60a5fa" : "#94a3b8",
                  background: pathname === "/dashboard" ? "rgba(59,130,246,0.1)" : "transparent",
                  transition: "color 0.15s, background 0.15s",
                }}>
                  Dashboard
                </Link>

                {/* Credits badge */}
                {credits !== null && (
                  <Link href="/pricing" style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "5px 10px", borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: credits.standard === 0
                      ? "1px solid rgba(239,68,68,0.3)"
                      : "1px solid rgba(255,255,255,0.08)",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}>
                    {/* Standard credits */}
                    <span style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: credits.standard === 0 ? "#ef4444" : "#60a5fa",
                    }}>
                      ⚡ {credits.standard}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px", lineHeight: 1 }}>|</span>
                    {/* HD credits */}
                    <span style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: credits.hd > 0 ? "#a78bfa" : "#475569",
                    }}>
                      ✨ {credits.hd}
                    </span>
                  </Link>
                )}

                <button onClick={handleSignOut} style={{
                  marginLeft: "4px",
                  padding: "8px 14px", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#64748b", transition: "color 0.15s, border-color 0.15s",
                }}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{
                  marginLeft: "6px",
                  padding: "8px 14px", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 600,
                  color: "#94a3b8",
                  transition: "color 0.15s",
                }}>
                  Sign in
                </Link>
                <Link href="/signup" style={{
                  padding: "9px 18px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                  color: "#fff", fontSize: "14px", fontWeight: 700,
                  boxShadow: "0 2px 12px rgba(59,130,246,0.35)",
                }}>
                  Try free →
                </Link>
              </>
            )
          )}

          {/* Shopify app CTA — hide on tool pages */}
          {!isToolPage && (
            <a
              href="https://apps.shopify.com/image-colour-remake"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: user ? "4px" : "10px",
                padding: "9px 18px", borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#cbd5e1", fontSize: "13px", fontWeight: 700,
                transition: "background 0.15s",
              }}
            >
              Shopify App
            </a>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="mobile-menu-btn"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px", padding: "8px",
            color: "#94a3b8", fontSize: "18px", display: "none",
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{ background: "#0d1424", borderTop: "1px solid rgba(59,130,246,0.12)", padding: "16px 24px" }}>
          {mainLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: "block", padding: "12px 0", fontSize: "16px", fontWeight: 600,
              color: pathname === l.href ? "#60a5fa" : "#94a3b8",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}>
              {l.label}
            </Link>
          ))}

          {!loadingUser && user && (
            <>
              <Link href="/generate" onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "16px", fontWeight: 600, color: "#60a5fa", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                ✨ Generate
              </Link>
              <Link href="/bulk" onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "16px", fontWeight: 600, color: "#60a5fa", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                ⚡ Bulk
              </Link>
              <Link href="/dashboard" onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "16px", fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                Dashboard
              </Link>
              <button onClick={() => { setOpen(false); handleSignOut(); }} style={{ display: "block", width: "100%", padding: "12px 0", textAlign: "left", fontSize: "16px", fontWeight: 600, color: "#64748b", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
                Sign out
              </button>
            </>
          )}

          {!loadingUser && !user && (
            <>
              <Link href="/login" onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "16px", fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                Sign in
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)} style={{
                display: "block", marginTop: "14px", padding: "13px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                color: "#fff", fontSize: "15px", fontWeight: 700, textAlign: "center",
              }}>
                Try free →
              </Link>
            </>
          )}

          {!isToolPage && (
            <a
              href="https://apps.shopify.com/image-colour-remake"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", marginTop: "14px", padding: "13px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#cbd5e1", fontSize: "15px", fontWeight: 700, textAlign: "center",
              }}
            >
              Shopify App
            </a>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
