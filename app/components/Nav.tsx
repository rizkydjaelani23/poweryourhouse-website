"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Credits { standard: number; hd: number }

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/services", label: "Services" },
  { href: "/shopify", label: "Shopify App" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [open,        setOpen]        = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [user,        setUser]        = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [credits,     setCredits]     = useState<Credits | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Scroll shadow
  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
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

  const isToolPage = pathname?.startsWith("/generate") || pathname?.startsWith("/dashboard") || pathname?.startsWith("/bulk");

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

      {/* ── Launch Sale announcement bar ── */}
      <div style={{
        background: "linear-gradient(90deg, #dc2626, #ea580c, #dc2626)",
        backgroundSize: "200% 100%",
        animation: "salePulse 4s ease infinite",
        textAlign: "center",
        padding: "8px 16px",
        fontSize: "13px",
        fontWeight: 800,
        color: "#fff",
        letterSpacing: "0.02em",
        lineHeight: 1,
      }}>
        <Link href="/pricing" style={{ color: "#fff", textDecoration: "none" }}>
          🔥 50% LAUNCH SALE — All plans half price. Limited time only. Grab it now →
        </Link>
      </div>
      {scrolled && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg, transparent, #3b82f6, #4f46e5, transparent)",
          pointerEvents: "none",
        }} />
      )}

      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Power Your House" style={{ width: "36px", height: "36px", objectFit: "contain", flexShrink: 0 }} />
          <span style={{ fontSize: "17px", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
            Power Your House
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2px", flexWrap: "nowrap", minWidth: 0 }} className="desktop-nav">
          {mainLinks.map((l) => (
            <Link key={l.href} href={l.href} style={{
              padding: "8px 12px", borderRadius: "8px",
              fontSize: "13px", fontWeight: 600,
              color: pathname === l.href ? "#60a5fa" : "#94a3b8",
              background: pathname === l.href ? "rgba(59,130,246,0.1)" : "transparent",
              transition: "color 0.15s, background 0.15s",
              position: "relative",
              whiteSpace: "nowrap",
              flexShrink: 0,
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

          {/* ── Auth-aware section ── */}
          {!loadingUser && (
            user ? (
              /* ── Logged-in user ── */
              <>
                {/* Generate — always visible, it's the primary action */}
                <Link href="/generate" style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  marginLeft: "6px",
                  padding: "8px 14px", borderRadius: "9px",
                  fontSize: "13px", fontWeight: 700,
                  background: pathname === "/generate"
                    ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.1)",
                  border: pathname === "/generate"
                    ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(139,92,246,0.28)",
                  color: "#c4b5fd",
                  whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.15s",
                }}>
                  ✨ Generate
                </Link>

                {/* Bulk */}
                <Link href="/bulk" style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "8px 12px", borderRadius: "8px",
                  fontSize: "13px", fontWeight: 700,
                  background: pathname === "/bulk" ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.06)",
                  border: pathname === "/bulk" ? "1px solid rgba(59,130,246,0.4)" : "1px solid rgba(59,130,246,0.18)",
                  color: pathname === "/bulk" ? "#60a5fa" : "#7dd3fc",
                  transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  ⚡ Bulk
                </Link>

                {/* Credits badge */}
                {credits !== null && (
                  <Link href="/pricing" style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "5px 10px", borderRadius: "8px",
                    background: "rgba(255,255,255,0.04)",
                    border: credits.standard === 0 ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(255,255,255,0.08)",
                    textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                  }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: credits.standard === 0 ? "#ef4444" : "#60a5fa" }}>
                      ⚡ {credits.standard}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px", lineHeight: 1 }}>|</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: credits.hd > 0 ? "#a78bfa" : "#475569" }}>
                      ✨ {credits.hd}
                    </span>
                  </Link>
                )}

                {/* User dropdown */}
                <div ref={userMenuRef} style={{ position: "relative", flexShrink: 0 }}>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "7px",
                      padding: "5px 10px 5px 5px", borderRadius: "10px",
                      background: userMenuOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {/* Avatar circle */}
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 800, fontSize: "13px", flexShrink: 0,
                    }}>
                      {(user.user_metadata?.display_name as string)?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>▾</span>
                  </button>

                  {userMenuOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 8px)", right: 0,
                      width: "220px", background: "#0d1424",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "14px", overflow: "hidden",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.6)", zIndex: 300,
                    }}>
                      {/* User info header */}
                      <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {(user.user_metadata?.display_name as string) || user.email}
                        </div>
                        {(user.user_metadata?.display_name as string) && (
                          <div style={{ fontSize: "11px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                        )}
                      </div>

                      {/* Menu items */}
                      {([
                        { href: "/dashboard",                 icon: "🏠", label: "Dashboard" },
                        { href: "/dashboard?tab=account",     icon: "⚙️", label: "Account settings" },
                        { href: "/dashboard?tab=purchases",   icon: "🧾", label: "Purchase history" },
                        { href: "/dashboard?tab=subscription",icon: "💳", label: "Subscription" },
                      ] as const).map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            padding: "11px 16px", fontSize: "13px", fontWeight: 600,
                            color: "#94a3b8", textDecoration: "none",
                            borderBottom: "1px solid rgba(255,255,255,0.04)",
                            transition: "background 0.1s, color 0.1s",
                          }}
                        >
                          <span style={{ fontSize: "15px" }}>{item.icon}</span>
                          {item.label}
                        </Link>
                      ))}

                      {/* Sign out */}
                      <button
                        onClick={() => { setUserMenuOpen(false); handleSignOut(); }}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px", width: "100%",
                          padding: "11px 16px", fontSize: "13px", fontWeight: 600,
                          color: "#64748b", background: "transparent", border: "none",
                          cursor: "pointer", textAlign: "left",
                        }}
                      >
                        <span style={{ fontSize: "15px" }}>🚪</span>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ── Guest / not logged in ── */
              <>
                {/* Instant try — no account needed */}
                <Link href="/generate" style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  marginLeft: "6px",
                  padding: "7px 13px", borderRadius: "8px",
                  fontSize: "13px", fontWeight: 700,
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.28)",
                  color: "#c4b5fd",
                  whiteSpace: "nowrap", flexShrink: 0,
                  transition: "all 0.15s",
                }}>
                  Try now — no account
                </Link>

                <Link href="/login" style={{
                  marginLeft: "4px",
                  padding: "8px 12px", borderRadius: "8px",
                  fontSize: "13px", fontWeight: 600,
                  color: "#94a3b8",
                  whiteSpace: "nowrap", flexShrink: 0,
                  transition: "color 0.15s",
                }}>
                  Sign in
                </Link>
                <Link href="/signup" style={{
                  padding: "9px 16px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                  color: "#fff", fontSize: "13px", fontWeight: 700,
                  boxShadow: "0 2px 12px rgba(59,130,246,0.35)",
                  whiteSpace: "nowrap", flexShrink: 0,
                }}>
                  Get 5 free →
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
                marginLeft: user ? "4px" : "8px",
                padding: "8px 14px", borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#cbd5e1", fontSize: "13px", fontWeight: 700,
                transition: "background 0.15s",
                whiteSpace: "nowrap", flexShrink: 0,
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
            flexShrink: 0,
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
              whiteSpace: "nowrap",
            }}>
              {l.label}
            </Link>
          ))}

          {/* Bulk — always shown in mobile menu */}
          <Link href="/bulk" onClick={() => setOpen(false)} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "12px 0", fontSize: "16px", fontWeight: 700,
            color: "#7dd3fc", borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            ⚡ Bulk Generation
            {!user && (
              <span style={{
                fontSize: "10px", fontWeight: 800, padding: "2px 8px",
                borderRadius: "999px", background: "rgba(59,130,246,0.18)",
                border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa",
                letterSpacing: "0.05em",
              }}>
                TRY FREE
              </span>
            )}
          </Link>

          {!loadingUser && user && (
            <>
              <Link href="/generate" onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "16px", fontWeight: 600, color: "#c4b5fd", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                ✨ Generate
              </Link>
              <Link href="/dashboard" onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "15px", fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                🏠 Dashboard
              </Link>
              <Link href="/dashboard?tab=account" onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "15px", fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                ⚙️ Account settings
              </Link>
              <Link href="/dashboard?tab=purchases" onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "15px", fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                🧾 Purchase history
              </Link>
              <Link href="/dashboard?tab=subscription" onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: "15px", fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                💳 Subscription
              </Link>
              <button onClick={() => { setOpen(false); handleSignOut(); }} style={{
                display: "block", width: "100%", padding: "12px 0",
                textAlign: "left", fontSize: "15px", fontWeight: 600,
                color: "#64748b", background: "transparent", border: "none",
                borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer",
                lineHeight: 1.5,
              }}>
                🚪 Sign out
              </button>
            </>
          )}

          {!loadingUser && !user && (
            <>
              <Link href="/generate" onClick={() => setOpen(false)} style={{
                display: "block", marginTop: "14px", padding: "13px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                color: "#fff", fontSize: "15px", fontWeight: 700, textAlign: "center",
              }}>
                Try free — no account needed →
              </Link>
              <Link href="/login" onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", marginTop: "8px", fontSize: "16px", fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                Sign in
              </Link>
              <Link href="/signup" onClick={() => setOpen(false)} style={{
                display: "block", marginTop: "8px", padding: "13px",
                borderRadius: "10px",
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)",
                color: "#7dd3fc", fontSize: "15px", fontWeight: 700, textAlign: "center",
              }}>
                Sign up for 5 free credits →
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
        @media (max-width: 1080px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
