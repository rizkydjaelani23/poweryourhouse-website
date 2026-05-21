import type { Metadata } from "next";
import Link from "next/link";
import HeroDemo from "./components/HeroDemo";
import SaaSPricingSection from "./components/SaaSPricingSection";
import ScrollReveal from "./components/ScrollReveal";

export const metadata: Metadata = {
  title: "AI Image Recolouring Tool — Recolour Any Photo Instantly | Power Your House",
  description:
    "Upload any product photo or room image, pick a colour or describe the change, and get a photorealistic result in seconds. Free credits on signup. No Photoshop needed.",
  alternates: { canonical: "https://poweryourhouse.io" },
  openGraph: {
    title: "AI Image Recolouring — Recolour Any Photo Instantly",
    description:
      "Upload any photo, pick a colour, download a photorealistic result in seconds. Free to try.",
    url: "https://poweryourhouse.io",
    type: "website",
  },
};

const steps = [
  { num: "1", icon: "🖼️", colour: "#3b82f6", title: "Upload your photo", desc: "Any product shot, room photo or fabric image. JPG, PNG or WebP up to 10 MB." },
  { num: "2", icon: "🎨", colour: "#8b5cf6", title: "Pick a colour", desc: "Use the colour picker, type a hex code, or upload a fabric swatch — we extract the colour automatically." },
  { num: "3", icon: "✨", colour: "#10b981", title: "Get your result", desc: "Standard delivers in seconds. HD uses FLUX AI for photorealistic results in 30–60 seconds." },
];

const modes = [
  {
    icon: "⚡",
    label: "Standard",
    colour: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.25)",
    credit: "1 standard credit",
    title: "Fast colour shift",
    points: [
      "Applies colour while preserving texture",
      "Result in under 3 seconds",
      "Perfect for bulk recolouring",
      "Works on any image type",
    ],
  },
  {
    icon: "✨",
    label: "HD Photorealistic",
    colour: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.25)",
    credit: "1 HD credit",
    title: "FLUX AI render",
    points: [
      "Photorealistic material & lighting",
      "Understands fabric, wood, metal",
      "Prompt-guided — describe the result",
      "30–60 second generation",
    ],
  },
];

const useCases = [
  { icon: "🛋️", title: "Product photography", desc: "Recolour sofas, beds, chairs and furniture without a new photoshoot." },
  { icon: "🏠", title: "Interior design", desc: "Show rooms in different wall colours, flooring or upholstery options." },
  { icon: "🧵", title: "Fabric & textiles", desc: "Visualise a swatch in a finished product before sampling." },
  { icon: "👗", title: "Fashion & apparel", desc: "Show garments in every colourway from a single hero image." },
  { icon: "🎨", title: "Creative work", desc: "Rapid concept exploration without opening Photoshop." },
  { icon: "🏪", title: "E-commerce stores", desc: "Give customers confidence by showing every colour option." },
];

export default function HomePage() {
  return (
    <>
      <style>{`
        @keyframes anim-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: anim-fade-up 0.7s ease both; }
        .use-cases-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .modes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .hero-grid { display: grid; grid-template-columns: 52fr 48fr; gap: 56px; align-items: center; }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; }
          .modes-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .use-cases-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .use-cases-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", overflow: "hidden",
        background: "#040912",
      }}>
        {/* Background orbs */}
        <div style={{ position: "absolute", top: "-10%", right: "-8%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)", pointerEvents: "none", animation: "float-slow 10s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-5%", left: "-8%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)", pointerEvents: "none", animation: "float-slow 13s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle at 1px 1px, rgba(139,92,246,0.05) 1px, transparent 0)", backgroundSize: "48px 48px" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, padding: "100px 24px 80px" }}>
          <div className="hero-grid">

            {/* Left */}
            <div>
              <div className="anim-fade-up" style={{ marginBottom: "24px", animationDelay: "0s" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)",
                  color: "#a78bfa", padding: "6px 14px", borderRadius: "999px",
                  fontSize: "12px", fontWeight: 800, letterSpacing: "0.05em",
                }}>
                  ✨ AI IMAGE RECOLOURING
                </span>
              </div>

              <h1 className="anim-fade-up" style={{
                fontSize: "clamp(38px, 5.5vw, 72px)", fontWeight: 900,
                lineHeight: 1.0, letterSpacing: "-0.03em", color: "#fff",
                marginBottom: "22px", animationDelay: "0.1s",
              }}>
                Recolour any image.
                <br />
                <span style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Instantly.
                </span>
              </h1>

              <p className="anim-fade-up" style={{
                fontSize: "clamp(16px, 2vw, 19px)", color: "#94a3b8",
                maxWidth: "460px", lineHeight: 1.7, marginBottom: "32px",
                animationDelay: "0.2s",
              }}>
                Upload a product photo or room image, pick a colour, and get a photorealistic result in seconds. No Photoshop. No designer. No wait.
              </p>

              <div className="anim-fade-up" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "32px", animationDelay: "0.3s" }}>
                <Link href="/signup" style={{
                  padding: "14px 28px", borderRadius: "12px",
                  background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                  color: "#fff", fontWeight: 800, fontSize: "15px",
                  boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
                }}>
                  Try free — 5 credits →
                </Link>
                <Link href="/generate" style={{
                  padding: "14px 24px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#cbd5e1", fontWeight: 700, fontSize: "15px",
                }}>
                  Open the tool
                </Link>
              </div>

              <div className="anim-fade-up" style={{ display: "flex", gap: "20px", flexWrap: "wrap", animationDelay: "0.4s" }}>
                {["Free to start", "No card required", "Works on any image"].map((t) => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>✓</span>{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — interactive demo */}
            <div className="anim-fade-up" style={{ animationDelay: "0.25s" }}>
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="section" style={{ background: "#080e1c" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <ScrollReveal>
              <div className="badge section-eyebrow">How it works</div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h2 className="section-title" style={{ margin: "14px auto 0", maxWidth: "500px" }}>
                Three steps. That&apos;s it.
              </h2>
            </ScrollReveal>
          </div>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i + 1}>
                <div style={{
                  background: "#0d1424", border: `1px solid ${step.colour}22`,
                  borderRadius: "18px", padding: "28px", height: "100%",
                  borderTop: `3px solid ${step.colour}`,
                }}>
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "12px",
                    background: `${step.colour}18`, border: `1px solid ${step.colour}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "22px", marginBottom: "16px",
                  }}>
                    {step.icon}
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 800, color: step.colour, marginBottom: "8px", letterSpacing: "0.06em" }}>
                    STEP {step.num}
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>
                    {step.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── TWO MODES ────────────────────────────────────────── */}
      <section className="section" style={{ background: "#080d1a" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <ScrollReveal>
              <div className="badge section-eyebrow">🎛️ Two modes</div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h2 className="section-title" style={{ margin: "14px auto 0", maxWidth: "520px" }}>
                Fast or photorealistic — you choose
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="section-sub" style={{ margin: "14px auto 0", maxWidth: "440px" }}>
                Standard is instant. HD uses FLUX AI to render a scene-accurate photorealistic result.
              </p>
            </ScrollReveal>
          </div>

          <div className="modes-grid" style={{ maxWidth: "820px", margin: "0 auto" }}>
            {modes.map((m, i) => (
              <ScrollReveal key={m.label} delay={i + 1}>
                <div style={{
                  background: m.bg, border: `1px solid ${m.border}`,
                  borderRadius: "20px", padding: "32px",
                }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>{m.icon}</div>
                  <div style={{
                    display: "inline-block", fontSize: "11px", fontWeight: 800,
                    color: m.colour, background: `${m.colour}18`,
                    border: `1px solid ${m.colour}30`, padding: "3px 10px",
                    borderRadius: "999px", marginBottom: "12px",
                  }}>
                    {m.credit}
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
                    {m.label}
                  </h3>
                  <p style={{ fontSize: "13px", color: m.colour, fontWeight: 700, marginBottom: "18px" }}>
                    {m.title}
                  </p>
                  <div style={{ borderTop: `1px solid ${m.border}`, paddingTop: "16px" }}>
                    {m.points.map((p) => (
                      <div key={p} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                        <span style={{ color: m.colour, fontWeight: 700, flexShrink: 0, fontSize: "13px" }}>✓</span>
                        <span style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ────────────────────────────────────────── */}
      <section className="section" style={{ background: "#080e1c" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <ScrollReveal>
              <div className="badge section-eyebrow">🌍 Who it&apos;s for</div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h2 className="section-title" style={{ margin: "14px auto 0", maxWidth: "520px" }}>
                Works for any industry, anywhere in the world
              </h2>
            </ScrollReveal>
          </div>

          <div className="use-cases-grid">
            {useCases.map((u, i) => (
              <ScrollReveal key={u.title} delay={i % 3 + 1}>
                <div style={{
                  background: "#0d1424", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "16px", padding: "24px",
                }}>
                  <div style={{ fontSize: "28px", marginBottom: "12px" }}>{u.icon}</div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{u.title}</h3>
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>{u.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <SaaSPricingSection />

      {/* ── VISION ───────────────────────────────────────────── */}
      <section className="section" style={{ background: "#080e1c", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container" style={{ maxWidth: "720px", textAlign: "center" }}>
          <ScrollReveal>
            <div className="badge section-eyebrow">🚀 What we&apos;re building</div>
            <h2 className="section-title" style={{ margin: "14px auto 20px" }}>
              AI creative tools for everyone
            </h2>
            <p style={{ fontSize: "16px", color: "#64748b", lineHeight: 1.8, marginBottom: "20px" }}>
              We started with colour — because showing products in every colour option is one of the most
              high-impact things any seller or designer can do, and it&apos;s still painful without the right tool.
            </p>
            <p style={{ fontSize: "16px", color: "#64748b", lineHeight: 1.8, marginBottom: "32px" }}>
              This is the first tool in a suite we&apos;re building. Next up: background replacement, material
              swap, and batch processing for high-volume teams. Sign up now and you&apos;ll get early access
              to everything we ship.
            </p>
            <Link href="/signup" style={{
              display: "inline-block", padding: "15px 36px", borderRadius: "12px",
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              color: "#fff", fontWeight: 800, fontSize: "15px",
              boxShadow: "0 4px 20px rgba(139,92,246,0.35)",
            }}>
              Start free today →
            </Link>
            <p style={{ marginTop: "14px", fontSize: "13px", color: "#334155" }}>
              5 standard credits + 1 HD credit free on signup · No card required
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SHOPIFY APP CTA ──────────────────────────────────── */}
      <section style={{
        padding: "56px 0",
        background: "linear-gradient(135deg, #0d1830, #111827)",
        borderTop: "1px solid rgba(59,130,246,0.1)",
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <ScrollReveal>
            <p style={{ fontSize: "13px", color: "#334155", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.05em" }}>
              🛍️ RUNNING A SHOPIFY FURNITURE STORE?
            </p>
            <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "10px" }}>
              We also have a dedicated Shopify app
            </h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "20px", maxWidth: "440px", margin: "0 auto 20px" }}>
              Auto-generate fabric colour previews directly in your Shopify store with a built-in gallery widget for your product pages.
            </p>
            <Link href="/shopify" style={{
              display: "inline-block", padding: "12px 24px", borderRadius: "10px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: "#94a3b8", fontWeight: 700, fontSize: "14px",
            }}>
              See the Shopify app →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
