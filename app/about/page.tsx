import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About – Power Your House",
  description: "We're a small Australian software studio building focused tools that make Shopify furniture and home goods merchants more competitive.",
  alternates: { canonical: "https://poweryourhouse.io/about" },
  openGraph: {
    title: "About – Power Your House",
    description: "Small Australian software studio. We build focused Shopify apps for furniture and home goods merchants.",
    url: "https://poweryourhouse.io/about",
    type: "website",
  },
};

const values = [
  {
    icon: "🎯",
    title: "Focused over bloated",
    desc: "We don't build feature dumps. Every tool we ship does one thing really well. Complexity kills adoption — clarity wins.",
    color: "#3b82f6",
  },
  {
    icon: "🔬",
    title: "Merchant-led design",
    desc: "We talk to real merchants before we write a single line of code. Problems come first, solutions come second.",
    color: "#4f46e5",
  },
  {
    icon: "⚡",
    title: "Ship fast, iterate faster",
    desc: "We'd rather get something useful in your hands today than something perfect in six months. Feedback beats assumptions.",
    color: "#06b6d4",
  },
  {
    icon: "🤝",
    title: "Support that actually helps",
    desc: "Small team means you talk to someone who built the product, not a tier-1 agent reading from a script.",
    color: "#8b5cf6",
  },
];

const timeline = [
  {
    year: "2024",
    title: "The problem",
    desc: "A furniture merchant friend couldn't show customers what their beds looked like in different fabric colours. Every option needed a separate photoshoot. Expensive and slow.",
  },
  {
    year: "2024",
    title: "First experiment",
    desc: "Built a rough tool to swap fabric colours using AI image masking. Rough but it worked. Merchants saw it and asked when they could use it.",
  },
  {
    year: "2026",
    title: "Image Colour Remake launches",
    desc: "Launched as a proper Shopify app. The storefront gallery, approval workflow, and swatch library make it a complete colour visualisation system.",
  },
  {
    year: "2026",
    title: "Power Your House is born",
    desc: "Realised the pattern: one focused tool becomes many. Registered the studio. More tools are coming — built with the same philosophy.",
  },
];

const apps = [
  { icon: "🎨", name: "Image Colour Remake", status: "Live", color: "#22c55e", desc: "AI-powered colour visualisation for Shopify products." },
  { icon: "📊", name: "Marketing Tracker", status: "Coming Soon", color: "#f59e0b", desc: "Cross-channel ad ROI in one dashboard." },
  { icon: "💬", name: "Customer Service App", status: "Coming Soon", color: "#f59e0b", desc: "Smarter support tools for Shopify merchants." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{
        position: "relative",
        padding: "80px 0 72px",
        background: "linear-gradient(160deg, #0d1424 0%, #111827 100%)",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0, width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="badge section-eyebrow">🏠 Our story</div>
          <h1 className="section-title" style={{ marginTop: "14px", maxWidth: "640px" }}>
            We build the tools we wish existed
          </h1>
          <p style={{ fontSize: "20px", color: "#94a3b8", maxWidth: "580px", lineHeight: 1.7, marginTop: "18px" }}>
            Power Your House is a small software studio from Australia. We don't try to build everything — we pick real merchant problems and build the best possible solution for each one.
          </p>
        </div>
      </section>

      {/* The big idea */}
      <section className="section">
        <div className="container" style={{ maxWidth: "800px" }}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
            <div style={{
              width: "4px", borderRadius: "4px", flexShrink: 0, alignSelf: "stretch",
              background: "linear-gradient(180deg, #3b82f6, #4f46e5)",
            }} />
            <blockquote style={{ fontSize: "22px", fontWeight: 700, color: "#e8efff", lineHeight: 1.5, fontStyle: "italic" }}>
              "Most software tries to do too much. We'd rather build three 10/10 tools than one that's a 5 at everything."
            </blockquote>
          </div>
          <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.8, marginBottom: "20px" }}>
            Power Your House started with a single observation: Shopify merchants selling furniture, bedding, and soft goods were spending thousands on photoshoots just to show customers colour options. Meanwhile, the technology to generate those images automatically already existed — it just wasn't packaged in a way merchants could actually use.
          </p>
          <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.8 }}>
            So we built it. And that became the template for everything else we make: find a real problem, build a focused solution, ship it, listen, improve. No fluff, no buzzwords, no roadmap theater — just tools that work.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: "#0d1424" }}>
        <div className="container">
          <div style={{ marginBottom: "48px" }}>
            <div className="badge section-eyebrow">💡 What we believe</div>
            <h2 className="section-title" style={{ marginTop: "14px" }}>How we work</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}>
            {values.map((v) => (
              <div key={v.title} style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "18px",
                padding: "28px",
              }}>
                <div style={{
                  width: "50px", height: "50px", borderRadius: "14px",
                  background: `${v.color}18`,
                  border: `1px solid ${v.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", marginBottom: "18px",
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  {v.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container" style={{ maxWidth: "720px" }}>
          <div style={{ marginBottom: "48px" }}>
            <div className="badge section-eyebrow">📅 How we got here</div>
            <h2 className="section-title" style={{ marginTop: "14px" }}>Our journey so far</h2>
          </div>

          <div style={{ position: "relative" }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute",
              left: "22px",
              top: "8px",
              bottom: "8px",
              width: "2px",
              background: "linear-gradient(180deg, #3b82f6 0%, rgba(59,130,246,0.1) 100%)",
            }} />

            {timeline.map((t, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "28px",
                marginBottom: "36px",
                position: "relative",
              }}>
                {/* Dot */}
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: i === timeline.length - 1 ? "linear-gradient(135deg, #3b82f6, #4f46e5)" : "#111827",
                  border: "2px solid #3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: i === timeline.length - 1 ? "#fff" : "#3b82f6",
                  flexShrink: 0,
                  zIndex: 1,
                }}>
                  {t.year}
                </div>
                <div style={{ paddingTop: "8px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
                    {t.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App suite */}
      <section className="section" style={{ background: "#0d1424" }}>
        <div className="container">
          <div style={{ marginBottom: "48px", textAlign: "center" }}>
            <div className="badge section-eyebrow">🚀 The suite</div>
            <h2 className="section-title" style={{ marginTop: "14px" }}>Everything we're building</h2>
            <p className="section-sub" style={{ margin: "14px auto 0" }}>
              One studio, multiple focused tools. Each one solves a different problem for Shopify merchants.
            </p>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "640px",
            margin: "0 auto",
          }}>
            {apps.map((app) => (
              <div key={app.name} style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "16px",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px",
                  background: "rgba(59,130,246,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", flexShrink: 0,
                }}>
                  {app.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#fff" }}>{app.name}</span>
                    <span style={{
                      fontSize: "11px", fontWeight: 700, padding: "2px 8px",
                      borderRadius: "999px", color: app.color,
                      background: `${app.color}18`,
                      border: `1px solid ${app.color}33`,
                    }}>{app.status}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#94a3b8" }}>{app.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "72px 0",
        textAlign: "center",
        background: "linear-gradient(135deg, #080d1a 0%, #111827 100%)",
      }}>
        <div className="container">
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>
            Want to work with us?
          </h2>
          <p style={{ fontSize: "16px", color: "#94a3b8", marginBottom: "32px" }}>
            Whether you're a merchant, a potential partner, or just curious — we'd love to chat.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary">Get in Touch →</Link>
            <Link href="/pricing" className="btn-ghost">See Pricing</Link>
          </div>
        </div>
      </section>
    </>
  );
}
