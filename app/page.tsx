import type { Metadata } from "next";
import Link from "next/link";
import HeroDemo from "./components/HeroDemo";
import SaaSPricingSection from "./components/SaaSPricingSection";
import ScrollReveal from "./components/ScrollReveal";

export const metadata: Metadata = {
  title: "Skip the Photoshoot — Show Your Product in Every Colour | Power Your House",
  description:
    "Upload one product photo, pick up to 6 colours, and download all variations in seconds. No photographer. No Photoshop. From $0.40 per image.",
  alternates: { canonical: "https://poweryourhouse.io" },
  openGraph: {
    title: "Show Your Product in Every Colour — No Photoshoot Needed",
    description:
      "Pick up to 6 colours, generate all variations at once, download as ZIP. Works for furniture, fabric, fashion, upholstery and more.",
    url: "https://poweryourhouse.io",
    type: "website",
  },
};

const industries = [
  {
    photo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=480&h=340&fit=crop&q=80",
    label: "Sofas & furniture",
    example: "Oak, Walnut, White",
  },
  {
    photo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=480&h=340&fit=crop&q=80",
    label: "Upholstery",
    example: "Velvet, Suede, Linen",
  },
  {
    photo: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=480&h=340&fit=crop&q=80",
    label: "Fabric & textiles",
    example: "Navy, Sage, Blush",
  },
  {
    photo: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=480&h=340&fit=crop&q=80",
    label: "Fashion & apparel",
    example: "Black, Ivory, Camel",
  },
  {
    photo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=480&h=340&fit=crop&q=80",
    label: "Beds & headboards",
    example: "Plush, Boucle, Leather",
  },
  {
    photo: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=480&h=340&fit=crop&q=80",
    label: "Home goods",
    example: "Stone, Charcoal, Cream",
  },
  {
    photo: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=480&h=340&fit=crop&q=80",
    label: "Bags & accessories",
    example: "Tan, Black, Burgundy",
  },
  {
    photo: "/recoloured-all-colours-1.jpg",
    label: "Curtains & blinds",
    example: "Grey, White, Terracotta",
  },
];

const steps = [
  { num: "01", colour: "#3b82f6", title: "Upload one product photo", desc: "Any product shot — fabric, furniture, clothing, bags. JPG, PNG or WebP." },
  { num: "02", colour: "#8b5cf6", title: "Pick your colours", desc: "Add multiple colours at once — including full swatch batches. Use the picker, type a hex, or upload a fabric swatch. Pro users can do up to 20 in one go." },
  { num: "03", colour: "#10b981", title: "Download all variations", desc: "Every colour generated in seconds. Download individually or all at once as a ZIP." },
];

const compare = [
  { label: "Cost per colour variation", old: "$150 – $400",      ours: "$0.40 – $2" },
  { label: "Time to get results",       old: "1 – 3 weeks",       ours: "Under 60 seconds" },
  { label: "Revisions / changes",       old: "$200 extra/day",    ours: "Unlimited, instant" },
  { label: "8 colour variations",       old: "$1,200 – $3,200",   ours: "Under $16" },
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

        .hero-grid    { display: grid; grid-template-columns: 52fr 48fr; gap: 56px; align-items: center; }
        .steps-grid   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .ind-grid     { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .compare-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0; }

        @media (max-width: 960px) {
          .hero-grid  { grid-template-columns: 1fr; gap: 40px; }
          .ind-grid   { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 680px) {
          .steps-grid   { grid-template-columns: 1fr; }
          .ind-grid     { grid-template-columns: repeat(2, 1fr); }
          .compare-grid { grid-template-columns: 1fr; }
        }

        .ind-card:hover .ind-img { transform: scale(1.06); }
        .ind-card { border: 1px solid rgba(255,255,255,0.08); transition: box-shadow 0.3s ease; }
        .ind-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.5); }

        .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        @media (max-width: 680px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 720px) { .service-teaser-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", overflow: "hidden",
        background: "#040912",
      }}>
        {/* Subtle ambient glow — one, not three */}
        <div style={{ position: "absolute", top: "10%", right: "0%", width: "640px", height: "640px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 68%)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, padding: "100px 24px 80px" }}>
          <div className="hero-grid">

            {/* Left */}
            <div>
              {/* Eyebrow label — no emoji, no pill */}
              <p className="anim-fade-up" style={{
                fontSize: "11px", fontWeight: 800, color: "#6366f1",
                letterSpacing: "0.14em", textTransform: "uppercase",
                marginBottom: "22px",
              }}>
                AI Colour Generation
              </p>

              <h1 className="anim-fade-up" style={{
                fontSize: "clamp(36px, 5vw, 66px)", fontWeight: 900,
                lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff",
                marginBottom: "22px", animationDelay: "0.1s",
              }}>
                Show your product
                <br />in every colour.
                <br />
                <span style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  No photoshoot.
                </span>
              </h1>

              <p className="anim-fade-up" style={{
                fontSize: "clamp(15px, 1.8vw, 18px)", color: "#94a3b8",
                maxWidth: "480px", lineHeight: 1.75, marginBottom: "14px",
                animationDelay: "0.2s",
              }}>
                Upload one product photo, pick up to 6 colours, and get every variation in seconds —
                realistic results, ready to download as a ZIP.
              </p>

              <p className="anim-fade-up" style={{
                fontSize: "14px", color: "#475569", maxWidth: "420px",
                lineHeight: 1.6, marginBottom: "32px", animationDelay: "0.25s",
              }}>
                Works for furniture, fabric, clothing, bags, upholstery, home goods — anything that comes in multiple colours.
              </p>

              <div className="anim-fade-up" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px", animationDelay: "0.3s" }}>
                <Link href="/generate" style={{
                  padding: "15px 30px", borderRadius: "12px",
                  background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                  color: "#fff", fontWeight: 800, fontSize: "15px",
                  boxShadow: "0 4px 24px rgba(139,92,246,0.45)",
                }}>
                  Try free — no account needed →
                </Link>
                <Link href="/signup" style={{
                  padding: "15px 24px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "#cbd5e1", fontWeight: 700, fontSize: "15px",
                }}>
                  Sign up for 5 free credits
                </Link>
              </div>

              <div className="anim-fade-up" style={{ display: "flex", gap: "20px", flexWrap: "wrap", animationDelay: "0.4s" }}>
                {["No account needed", "No card ever", "Download as ZIP"].map((t) => (
                  <span key={t} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
                    <span style={{ color: "#22c55e", fontWeight: 700, fontSize: "11px" }}>✓</span>{t}
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

      {/* ── REAL RESULTS GALLERY ──────────────────────────────────────────── */}
      <section style={{ background: "#040912", padding: "0 0 80px" }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
                Real results
              </p>
              <h2 style={{
                fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#fff",
                margin: "0 0 12px", letterSpacing: "-0.02em",
              }}>
                One photo. Six colours. Under a minute.
              </h2>
              <p style={{ fontSize: "15px", color: "#64748b", margin: "0 auto", maxWidth: "500px", lineHeight: 1.7 }}>
                Every image below was generated from the same single curtain photo —
                no photographer, no Photoshop, no waiting.
              </p>
            </div>
          </ScrollReveal>

          <div className="gallery-grid">
            {[
              { src: "/recoloured-all-colours-1.jpg", colour: "Lavender" },
              { src: "/recoloured-all-colours-2.jpg", colour: "Periwinkle" },
              { src: "/recoloured-all-colours-3.jpg", colour: "Sage Green" },
              { src: "/recoloured-all-colours-4.jpg", colour: "Peach" },
              { src: "/recoloured-all-colours-5.jpg", colour: "Violet" },
              { src: "/recoloured-all-colours-6.jpg", colour: "Hot Pink" },
            ].map((item, i) => (
              <ScrollReveal key={item.colour} delay={(i % 3) + 1}>
                <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={`Curtain recoloured in ${item.colour}`}
                    loading="lazy"
                    style={{ width: "100%", display: "block", aspectRatio: "3/4", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "14px 16px",
                    background: "linear-gradient(to top, rgba(4,9,18,0.88) 0%, transparent 100%)",
                  }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{item.colour}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div style={{ textAlign: "center", marginTop: "28px" }}>
              <p style={{ fontSize: "13px", color: "#334155", marginBottom: "16px" }}>
                All 6 generated from one upload · Ready to download as a ZIP
              </p>
              <Link href="/generate" style={{
                display: "inline-block", padding: "13px 28px", borderRadius: "12px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#cbd5e1", fontWeight: 700, fontSize: "14px",
              }}>
                Try it with your own photo →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── THE PROBLEM ────────────────────────────────────────────────────── */}
      <section style={{ background: "#06080f", padding: "72px 0" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <ScrollReveal>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
                The old way vs our way
              </p>
              <h2 className="section-title">
                A colour photoshoot costs $500–$2,000.
                <br />
                <span style={{ color: "#60a5fa" }}>We do it for $2.</span>
              </h2>
              <p style={{ color: "#475569", fontSize: "15px", marginTop: "14px" }}>
                If you sell in 8 colours you need 8 sets of photos. That adds up fast.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={1}>
            {/* Compare table */}
            <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* Header row */}
              <div className="compare-grid" style={{ background: "#0d1424", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ padding: "14px 20px" }} />
                <div style={{ padding: "14px 20px", fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
                  Traditional photoshoot
                </div>
                <div style={{ padding: "14px 20px", fontSize: "12px", fontWeight: 800, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "center", background: "rgba(59,130,246,0.06)", borderLeft: "1px solid rgba(59,130,246,0.2)" }}>
                  Power Your House
                </div>
              </div>

              {compare.map((row, i) => (
                <div key={row.label} className="compare-grid" style={{ background: i % 2 === 0 ? "#080d1a" : "#0a1020", borderBottom: i < compare.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ padding: "16px 20px", fontSize: "14px", color: "#94a3b8", fontWeight: 600 }}>
                    {row.label}
                  </div>
                  <div style={{ padding: "16px 20px", fontSize: "14px", color: "#ef4444", fontWeight: 700, textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                    {row.old}
                  </div>
                  <div style={{ padding: "16px 20px", fontSize: "14px", color: "#22c55e", fontWeight: 800, textAlign: "center", background: "rgba(59,130,246,0.04)", borderLeft: "1px solid rgba(59,130,246,0.15)" }}>
                    {row.ours}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={2}>
            <div style={{ textAlign: "center", marginTop: "32px" }}>
              <Link href="/signup" style={{
                display: "inline-block", padding: "14px 32px", borderRadius: "12px",
                background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                color: "#fff", fontWeight: 800, fontSize: "15px",
                boxShadow: "0 4px 20px rgba(139,92,246,0.35)",
              }}>
                Try free — no card needed →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── WHO IT'S FOR ───────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "#080e1c" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <ScrollReveal>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
                Who it&apos;s for
              </p>
              <h2 className="section-title">
                If you sell it in multiple colours,
                <br />this is for you.
              </h2>
              <p className="section-sub" style={{ margin: "14px auto 0" }}>
                Any product. Any material. Any colour. One upload, all variations done.
              </p>
            </ScrollReveal>
          </div>

          <div className="ind-grid">
            {industries.map((ind, i) => (
              <ScrollReveal key={ind.label} delay={(i % 4) + 1}>
                <div className="ind-card" style={{
                  position: "relative", borderRadius: "16px", overflow: "hidden",
                  height: "210px", display: "block",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ind.photo}
                    alt={ind.label}
                    loading="lazy"
                    style={{
                      width: "100%", height: "100%",
                      objectFit: "cover", display: "block",
                      transition: "transform 0.5s ease",
                    }}
                    className="ind-img"
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(4,8,20,0.92) 0%, rgba(4,8,20,0.45) 55%, rgba(4,8,20,0.08) 100%)",
                  }} />
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "14px 16px",
                  }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{ind.label}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "3px" }}>e.g. {ind.example}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "#080d1a" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <ScrollReveal>
              <p style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
                How it works
              </p>
              <h2 className="section-title">Three steps. Under a minute.</h2>
              <p className="section-sub" style={{ margin: "14px auto 0" }}>
                No design skills. No Photoshop. No waiting on a photographer.
              </p>
            </ScrollReveal>
          </div>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i + 1}>
                <div style={{
                  background: "#0d1424",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderTop: `3px solid ${step.colour}`,
                  borderRadius: "18px", padding: "32px", height: "100%",
                }}>
                  {/* Large step number instead of emoji */}
                  <div style={{
                    fontSize: "52px", fontWeight: 900, lineHeight: 1,
                    color: step.colour, opacity: 0.35,
                    marginBottom: "20px", letterSpacing: "-0.03em",
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {step.num}
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>{step.title}</h3>
                  <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BULK COLOUR CALLOUT ────────────────────────────────────────────── */}
      <section style={{ background: "#06080f", padding: "72px 0" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <ScrollReveal>
            <div style={{
              borderRadius: "24px", overflow: "hidden",
              background: "linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.05))",
              border: "1px solid rgba(59,130,246,0.18)",
              padding: "48px",
              position: "relative",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "32px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "260px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 800, color: "#3b82f6", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
                    Bulk swatch generation
                  </p>

                  <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, color: "#fff", marginBottom: "14px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                    Upload your whole
                    <br />swatch range at once.
                    <br />
                    <span style={{ color: "#60a5fa" }}>Download as a ZIP.</span>
                  </h2>

                  <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.7, marginBottom: "12px", maxWidth: "420px" }}>
                    Stop generating one colour at a time. Add your entire swatch range, hit generate, and every variation is ready in under a minute — packaged and ready to upload to your store.
                  </p>

                  <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6, marginBottom: "24px", maxWidth: "420px" }}>
                    Free plan includes up to 6 colours per batch. Pro and Business plans support up to 20 colour variations in a single generation.
                  </p>

                  <Link href="/generate" style={{
                    display: "inline-block", padding: "13px 28px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                    color: "#fff", fontWeight: 800, fontSize: "15px",
                    boxShadow: "0 4px 20px rgba(59,130,246,0.35)",
                  }}>
                    Try multiple colours →
                  </Link>
                </div>

                {/* Colour stack visual */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
                  {[
                    { hex: "#5b3a8b", name: "Plum Velvet" },
                    { hex: "#2563eb", name: "Ocean Blue" },
                    { hex: "#16a34a", name: "Forest Green" },
                    { hex: "#c2410c", name: "Burnt Orange" },
                    { hex: "#475569", name: "Slate Grey" },
                    { hex: "#be185d", name: "Rose" },
                  ].map((c, i) => (
                    <div key={c.hex} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "8px 14px", borderRadius: "10px",
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      animation: `anim-fade-up 0.5s ease ${i * 0.08}s both`,
                    }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: c.hex, flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap" }}>{c.name}</span>
                      <span style={{ marginLeft: "auto", fontSize: "11px", color: "#22c55e", fontWeight: 700 }}>✓</span>
                    </div>
                  ))}
                  <div style={{ textAlign: "center", fontSize: "12px", color: "#334155", marginTop: "4px", fontWeight: 600 }}>
                    All 6 — ready to download
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <SaaSPricingSection />

      {/* ── SOCIAL MEDIA AUTOMATION SERVICE ────────────────────────────────── */}
      <section style={{ background: "#060b17", padding: "72px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="container">
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px",
            alignItems: "center",
          }} className="service-teaser-grid">
            <div>
              <div style={{
                display: "inline-block",
                fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em",
                color: "#60a5fa", textTransform: "uppercase",
                background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
                borderRadius: "999px", padding: "4px 14px", marginBottom: "18px",
              }}>
                Done-For-You Service
              </div>
              <h2 style={{
                fontSize: "clamp(22px, 3.5vw, 34px)", fontWeight: 900, color: "#fff",
                letterSpacing: "-0.025em", lineHeight: 1.2, margin: "0 0 14px",
              }}>
                We automate your social media feed for 30 days
              </h2>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.75, marginBottom: "24px" }}>
                AI-generated product images, captions, hashtags, and scheduled posting to
                Facebook and Instagram — fully automated. You don&apos;t touch a thing.
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link href="/services" style={{
                  padding: "12px 24px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                  color: "#fff", fontWeight: 700, fontSize: "14px",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                }}>
                  See packages →
                </Link>
                <Link href="/consultation" style={{
                  padding: "12px 20px", borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8", fontWeight: 600, fontSize: "14px",
                }}>
                  Free consultation →
                </Link>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {([
                { icon: "🤖", label: "Fully automated", sub: "Posts go live without you" },
                { icon: "🎨", label: "AI-generated images", sub: "Your products in any colour" },
                { icon: "📅", label: "30 days of content", sub: "2 posts/day on FB + IG" },
                { icon: "⚡", label: "From £197", sub: "One-time, no monthly fee" },
              ] as const).map((t) => (
                <div key={t.label} style={{
                  background: "#0d1424", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px", padding: "18px 16px",
                }}>
                  <div style={{ fontSize: "24px", marginBottom: "8px" }}>{t.icon}</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0", marginBottom: "4px" }}>{t.label}</div>
                  <div style={{ fontSize: "12px", color: "#475569" }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: "#080e1c", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container" style={{ maxWidth: "680px", textAlign: "center" }}>
          <ScrollReveal>
            <h2 className="section-title" style={{ marginBottom: "16px" }}>
              Your first 5 images are free.
            </h2>
            <p style={{ fontSize: "17px", color: "#64748b", lineHeight: 1.7, marginBottom: "32px" }}>
              No credit card. No designer. No waiting.
              <br />Just upload, pick your colours, and download.
            </p>
            <Link href="/signup" style={{
              display: "inline-block", padding: "16px 40px", borderRadius: "14px",
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              color: "#fff", fontWeight: 800, fontSize: "16px",
              boxShadow: "0 4px 24px rgba(139,92,246,0.4)",
            }}>
              Start free — no card needed →
            </Link>
            <p style={{ marginTop: "16px", fontSize: "13px", color: "#334155" }}>
              5 standard credits + 1 HD credit on signup · Cancel anytime
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── SHOPIFY APP CTA ────────────────────────────────────────────────── */}
      <section style={{ padding: "56px 0", background: "linear-gradient(135deg, #0d1830, #111827)", borderTop: "1px solid rgba(59,130,246,0.08)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <ScrollReveal>
            <p style={{ fontSize: "11px", fontWeight: 800, color: "#334155", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px" }}>
              Got a Shopify store?
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
