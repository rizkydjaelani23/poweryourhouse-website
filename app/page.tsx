import type { Metadata } from "next";
import Link from "next/link";
import DemoSection from "./components/DemoSection";
import ScrollReveal from "./components/ScrollReveal";
import HeroProductCard from "./components/HeroProductCard";

export const metadata: Metadata = {
  title: "Power Your House – AI Colour Visualisation for Shopify",
  description:
    "Show customers every fabric colour option on your Shopify store — no photoshoots needed. Power Your House builds focused AI tools for furniture and home goods merchants.",
  alternates: { canonical: "https://poweryourhouse.io" },
  openGraph: {
    title: "Power Your House – AI Colour Visualisation for Shopify",
    description:
      "Show customers every fabric colour option on your Shopify store — no photoshoots needed.",
    url: "https://poweryourhouse.io",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Image Colour Remake",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Shopify",
  url: "https://poweryourhouse.io",
  description:
    "AI-powered colour visualisation Shopify app. Replace product fabric colours automatically — show customers every option without expensive photoshoots.",
  offers: {
    "@type": "Offer",
    price: "29.99",
    priceCurrency: "USD",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      billingDuration: "P1M",
    },
  },
  publisher: {
    "@type": "Organization",
    name: "Power Your House",
    url: "https://poweryourhouse.io",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style>{`
        @keyframes anim-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: anim-fade-up 0.7s ease both; }
        .hero-grid { display: grid; grid-template-columns: 55fr 45fr; gap: 60px; align-items: center; }
        .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        .stats-grid { display: flex; gap: 0; justify-content: center; }
        .coming-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .coming-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .stats-grid { flex-direction: column; align-items: center; }
          .coming-grid { grid-template-columns: 1fr; }
        }
        .feature-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .feature-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }
        .scroll-bounce {
          animation: scroll-bounce 1.8s ease-in-out infinite;
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50%       { transform: translateY(6px); opacity: 1; }
        }
      `}</style>

      {/* ══════════════════════════════════════════
          SECTION 1: Hero
      ══════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "#040912",
      }}>
        {/* Orb 1 — top right, blue */}
        <div style={{
          position: "absolute",
          top: "-10%",
          right: "-8%",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "float-slow 10s ease-in-out infinite",
        }} />
        {/* Orb 2 — bottom left, violet */}
        <div style={{
          position: "absolute",
          bottom: "-5%",
          left: "-8%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.16) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "float-slow 13s ease-in-out infinite reverse",
          animationDelay: "-4s",
        }} />
        {/* Orb 3 — center, cyan */}
        <div style={{
          position: "absolute",
          top: "30%",
          left: "38%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "float-slow 10s ease-in-out infinite",
          animationDelay: "-7s",
        }} />
        {/* Dot grid overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.06) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1, padding: "100px 24px 80px" }}>
          <div className="hero-grid">
            {/* Left column */}
            <div>
              {/* Badge */}
              <div className="anim-fade-up badge badge-shimmer" style={{ marginBottom: "28px", animationDelay: "0s" }}>
                ⚡ Now live on Shopify App Store
              </div>

              {/* H1 */}
              <h1
                className="anim-fade-up"
                style={{
                  fontSize: "clamp(42px, 6vw, 80px)",
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  marginBottom: "24px",
                  animationDelay: "0.1s",
                }}
              >
                Show your furniture
                <br />
                <span className="gradient-text">in every colour.</span>
              </h1>

              {/* Paragraph */}
              <p
                className="anim-fade-up"
                style={{
                  fontSize: "clamp(17px, 2vw, 20px)",
                  color: "#94a3b8",
                  maxWidth: "480px",
                  lineHeight: 1.7,
                  marginBottom: "36px",
                  animationDelay: "0.2s",
                }}
              >
                Turn fabric swatches into realistic product images. No photoshoot, no designer, no guessing.
              </p>

              {/* CTA buttons */}
              <div
                className="anim-fade-up"
                style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "36px", animationDelay: "0.3s" }}
              >
                <a
                  href="https://apps.shopify.com/image-colour-remake"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Install on Shopify →
                </a>
                <Link href="/pricing" className="btn-ghost">
                  See Pricing
                </Link>
              </div>

              {/* Trust bar */}
              <div
                className="anim-fade-up"
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  animationDelay: "0.4s",
                }}
              >
                {["Free trial included", "Works with any Shopify theme", "No coding required"].map((item) => (
                  <span key={item} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: 500,
                  }}>
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>✓</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right column — Live product card with real images */}
            <div className="anim-fade-up" style={{ animationDelay: "0.25s" }}>
              <HeroProductCard />
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            textAlign: "center",
            marginTop: "64px",
            color: "#475569",
            fontSize: "13px",
            fontWeight: 500,
          }}>
            <div className="scroll-bounce">Scroll to explore ↓</div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2: How It Works
      ══════════════════════════════════════════ */}
      <section className="section" style={{ background: "#080e1c" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <ScrollReveal>
              <div className="badge section-eyebrow">How it works</div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h2 className="section-title" style={{ margin: "14px auto 0", maxWidth: "560px" }}>
                Four steps to stunning colour previews
              </h2>
            </ScrollReveal>
          </div>

          <div className="steps-grid">
            {[
              {
                num: "1",
                color: "#3b82f6",
                title: "Select your product",
                desc: "Pick any upholstered furniture product from your Shopify store.",
              },
              {
                num: "2",
                color: "#4f46e5",
                title: "Draw the fabric zone",
                desc: "Use our visual editor to mark which part of the image is fabric.",
              },
              {
                num: "3",
                color: "#06b6d4",
                title: "Upload swatches",
                desc: "Drop in your fabric colour swatches — we handle the rest.",
              },
              {
                num: "4",
                color: "#10b981",
                title: "Approve & go live",
                desc: "Review the generated previews and publish to your storefront instantly.",
              },
            ].map((step, i) => (
              <ScrollReveal key={step.num} delay={i + 1}>
                <div className="glass card-hover" style={{
                  borderRadius: "18px",
                  padding: "28px 24px",
                  height: "100%",
                  position: "relative",
                }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${step.color}33, ${step.color}11)`,
                    border: `1px solid ${step.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    fontWeight: 900,
                    color: step.color,
                    marginBottom: "16px",
                  }}>
                    {step.num}
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

      {/* ══════════════════════════════════════════
          SECTION 3: Demo
      ══════════════════════════════════════════ */}
      <DemoSection />

      {/* ══════════════════════════════════════════
          SECTION 4: Features
      ══════════════════════════════════════════ */}
      <section className="section" style={{ background: "#080e1c" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <ScrollReveal>
              <div className="badge section-eyebrow">🎨 Features</div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h2 className="section-title" style={{ margin: "14px auto 0" }}>
                Everything you need to sell colour
              </h2>
            </ScrollReveal>
          </div>

          <div className="features-grid">
            {[
              {
                icon: "🖼️",
                color: "#3b82f6",
                title: "AI Colour Visualiser",
                desc: "Upload a swatch, get a photorealistic result. Our AI engine handles masking, lighting, and texture automatically.",
              },
              {
                icon: "🧵",
                color: "#4f46e5",
                title: "Swatch Library",
                desc: "Organise your fabric families. Reuse swatches across products without re-uploading.",
              },
              {
                icon: "🛍️",
                color: "#06b6d4",
                title: "Storefront Gallery",
                desc: "A beautiful, embeddable colour gallery appears on your product page. Customers browse and choose.",
              },
              {
                icon: "✅",
                color: "#8b5cf6",
                title: "Approval Workflow",
                desc: "Every preview goes through your approval before going live. Full control, zero surprises.",
              },
            ].map((f, i) => (
              <ScrollReveal key={f.title} delay={i + 1}>
                <div
                  className="feature-card glass"
                  style={{
                    borderRadius: "18px",
                    padding: "28px",
                    borderLeft: `4px solid ${f.color}`,
                    height: "100%",
                  }}
                >
                  <div style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: `${f.color}22`,
                    border: `1px solid ${f.color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    marginBottom: "18px",
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>
                    {f.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5: Stats Bar
      ══════════════════════════════════════════ */}
      <section className="section" style={{
        background: "linear-gradient(135deg, #0d1830 0%, #080e1c 100%)",
        borderTop: "1px solid rgba(59,130,246,0.1)",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
      }}>
        <div className="container">
          <ScrollReveal>
            <div className="stats-grid">
              {[
                { value: "30 sec", label: "Average generation time" },
                { value: "Zero", label: "Photoshoots needed" },
                { value: "Any", label: "Shopify 2.0 theme" },
              ].map((stat, i) => (
                <div key={stat.label} style={{
                  textAlign: "center",
                  padding: "24px 48px",
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  flex: "1",
                }}>
                  <div className="gradient-text" style={{
                    fontSize: "52px",
                    fontWeight: 900,
                    lineHeight: 1,
                    marginBottom: "10px",
                    display: "block",
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "14px", color: "#64748b", fontWeight: 500 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6: Coming Soon
      ══════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: "48px" }}>
            <ScrollReveal>
              <div className="badge section-eyebrow">🚀 What&apos;s next</div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h2 className="section-title" style={{ marginTop: "14px" }}>More tools coming</h2>
            </ScrollReveal>
          </div>

          <div className="coming-grid">
            {[
              {
                icon: "📊",
                color: "#f59e0b",
                title: "Marketing Tracker",
                desc: "Track ROI across Facebook, Google, TikTok in one dashboard. Know exactly what pays off.",
              },
              {
                icon: "💬",
                color: "#10b981",
                title: "Customer Service App",
                desc: "Smart support templates, order lookup, one-click resolutions.",
              },
            ].map((app, i) => (
              <ScrollReveal key={app.title} delay={i + 1}>
                <div className="glass card-hover" style={{
                  borderRadius: "18px",
                  padding: "32px",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                }}>
                  {/* Coming soon pill */}
                  <div style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: `${app.color}22`,
                    border: `1px solid ${app.color}44`,
                    color: app.color,
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}>
                    Coming 2026
                  </div>

                  <div style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: `${app.color}18`,
                    border: `1px solid ${app.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    marginBottom: "18px",
                  }}>
                    {app.icon}
                  </div>
                  <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>
                    {app.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>
                    {app.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7: CTA
      ══════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        padding: "96px 0",
        textAlign: "center",
        background: "linear-gradient(135deg, #0d1830 0%, #111827 100%)",
        borderTop: "1px solid rgba(59,130,246,0.12)",
      }}>
        {/* Background orb */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          animation: "float-slow 12s ease-in-out infinite",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <ScrollReveal>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "16px",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}>
              Ready to show every colour?
            </h2>
            <p style={{
              fontSize: "18px",
              color: "#94a3b8",
              marginBottom: "40px",
            }}>
              $29.99/month · Free trial included · Cancel anytime
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://apps.shopify.com/image-colour-remake"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ fontSize: "17px", padding: "16px 36px" }}
              >
                Install on Shopify →
              </a>
              <Link href="/contact" className="btn-ghost" style={{ fontSize: "17px", padding: "16px 36px" }}>
                Talk to Us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
