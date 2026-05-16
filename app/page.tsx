import type { Metadata } from "next";
import Link from "next/link";
import DemoSection from "./components/DemoSection";
import ScrollReveal from "./components/ScrollReveal";
import HeroProductCard from "./components/HeroProductCard";

export const metadata: Metadata = {
  title: "Power Your House – AI Fabric Colour Visualiser for Shopify Furniture Stores",
  description:
    "Show beds, sofas, armchairs and upholstered furniture in every fabric colour on your Shopify store — no expensive photoshoots needed. AI-powered colour previews for furniture merchants worldwide.",
  alternates: { canonical: "https://poweryourhouse.io" },
  keywords: [
    "shopify furniture app",
    "fabric colour visualiser",
    "bed colour preview shopify",
    "sofa colour options online",
    "furniture ecommerce tool",
    "AI fabric colour changer",
    "upholstery colour shopify app",
    "furniture store shopify",
  ],
  openGraph: {
    title: "AI Fabric Colour Visualiser for Shopify Furniture Stores",
    description:
      "Show beds, sofas and upholstered products in every fabric colour — no photoshoots needed. Built for furniture merchants worldwide.",
    url: "https://poweryourhouse.io",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Image Colour Remake",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Furniture & Home Goods eCommerce",
  operatingSystem: "Shopify",
  url: "https://poweryourhouse.io",
  description:
    "AI-powered fabric colour visualisation Shopify app for furniture, bedding and upholstery stores. Show beds, sofas, armchairs and upholstered products in every fabric colour — no photoshoots needed. Works with any Shopify 2.0 theme.",
  featureList: [
    "AI fabric colour replacement",
    "Unlimited colour preview generation",
    "Storefront colour gallery widget",
    "Works with beds, sofas, armchairs, ottomans",
    "All fabric types: plush, velvet, suede, wool",
    "Approval workflow",
    "Shopify 2.0 compatible",
  ],
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
          SECTION 4.5: SEO Engine Add-on
      ══════════════════════════════════════════ */}
      <section className="section" style={{
        background: "linear-gradient(160deg, #071a12 0%, #080e1c 60%, #071a12 100%)",
        borderTop: "1px solid rgba(16,185,129,0.12)",
        borderBottom: "1px solid rgba(16,185,129,0.12)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background orb */}
        <div style={{
          position: "absolute", top: "0", right: "-10%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <ScrollReveal>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)",
                color: "#10b981", padding: "6px 16px", borderRadius: "999px",
                fontSize: "12px", fontWeight: 800, marginBottom: "16px", letterSpacing: "0.05em",
              }}>
                ✨ NEW ADD-ON
              </div>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <h2 className="section-title" style={{ margin: "0 auto 16px", maxWidth: "600px" }}>
                Fabric SEO Engine
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={2}>
              <p className="section-sub" style={{ margin: "0 auto", maxWidth: "520px" }}>
                Auto-generate SEO-optimised meta titles, descriptions, alt text and schema markup for every product — using your actual fabric and colour data.
              </p>
            </ScrollReveal>
          </div>

          {/* Split layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "48px",
            alignItems: "center",
          }}
          className="seo-split-grid">
            {/* Left: feature list + pricing */}
            <ScrollReveal delay={1}>
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "36px" }}>
                  {[
                    { icon: "🔍", title: "Meta titles & descriptions", desc: "Generated automatically from your product name, fabric type and colour options." },
                    { icon: "🖼️", title: "Image alt text", desc: "Every approved colour preview gets a precise, keyword-rich alt attribute." },
                    { icon: "🏷️", title: "Structured data (Schema)", desc: "Product schema injected automatically — helps Google display rich results." },
                    { icon: "📈", title: "Fabric & colour keywords", desc: "Colour-specific long-tail keywords built in — terms real shoppers search for." },
                  ].map((item) => (
                    <div key={item.title} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      <div style={{
                        width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0,
                        background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>{item.title}</div>
                        <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing pills */}
                <div style={{
                  background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: "16px", padding: "20px 24px",
                }}>
                  <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600, marginBottom: "12px", letterSpacing: "0.05em" }}>
                    AVAILABLE AS
                  </div>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{
                      background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)",
                      borderRadius: "12px", padding: "10px 16px",
                    }}>
                      <div style={{ fontSize: "13px", color: "#10b981", fontWeight: 700 }}>SEO Engine only</div>
                      <div style={{ fontSize: "20px", fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>$14.99<span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>/mo</span></div>
                      <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>Add to any plan</div>
                    </div>
                    <div style={{
                      background: "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(79,70,229,0.18))",
                      border: "1px solid rgba(16,185,129,0.5)", borderRadius: "12px", padding: "10px 16px",
                    }}>
                      <div style={{ fontSize: "13px", color: "#10b981", fontWeight: 700 }}>★ Pro + SEO Engine</div>
                      <div style={{ fontSize: "20px", fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>$44.99<span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>/mo</span></div>
                      <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>Best value · Save $0.98</div>
                    </div>
                  </div>
                  <Link href="/pricing" style={{
                    display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "16px",
                    fontSize: "13px", color: "#10b981", fontWeight: 700, textDecoration: "none",
                  }}>
                    See all plans →
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Visual mock of SEO output */}
            <ScrollReveal delay={2}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Google result mock */}
                <div style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px", padding: "20px 22px",
                }}>
                  <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600, marginBottom: "12px", letterSpacing: "0.05em" }}>
                    🔍 GOOGLE SEARCH PREVIEW
                  </div>
                  <div style={{ fontSize: "12px", color: "#5f9541", marginBottom: "2px" }}>yourstore.com › products › velvet-bed-grey</div>
                  <div style={{ fontSize: "15px", color: "#8ab4f8", fontWeight: 600, marginBottom: "4px", lineHeight: 1.3 }}>
                    Grey Velvet Bed Frame | 14 Fabric Colours | Free Shipping
                  </div>
                  <div style={{ fontSize: "13px", color: "#bdc1c6", lineHeight: 1.5 }}>
                    Shop our Grey Velvet Bed Frame — now available in 14 premium fabric colours including plush, suede and linen. AI colour previews for every option...
                  </div>
                </div>

                {/* Alt text mock */}
                <div style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px", padding: "20px 22px",
                }}>
                  <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600, marginBottom: "12px", letterSpacing: "0.05em" }}>
                    🖼️ IMAGE ALT TEXT — AUTO-GENERATED
                  </div>
                  {[
                    "Velvet Bed Frame in Slate Grey – plush upholstery, queen size",
                    "Cloud Linen Bed Frame in Ivory White – linen fabric, king size",
                    "Suede Ottoman Bed in Midnight Navy – deep button tufting",
                  ].map((alt, i) => (
                    <div key={i} style={{
                      display: "flex", gap: "10px", alignItems: "flex-start",
                      padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}>
                      <span style={{ color: "#10b981", fontWeight: 700, fontSize: "13px", flexShrink: 0, marginTop: "1px" }}>✓</span>
                      <span style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.5 }}>{alt}</span>
                    </div>
                  ))}
                </div>

                {/* Keywords mock */}
                <div style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px", padding: "20px 22px",
                }}>
                  <div style={{ fontSize: "11px", color: "#6b7280", fontWeight: 600, marginBottom: "12px", letterSpacing: "0.05em" }}>
                    🏷️ COLOUR KEYWORDS INJECTED
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {["velvet bed grey", "grey bed frame uk", "fabric bed grey", "upholstered bed grey", "plush bed frame", "grey bedroom furniture"].map((kw) => (
                      <span key={kw} style={{
                        background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                        color: "#6ee7b7", padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600,
                      }}>{kw}</span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .seo-split-grid { grid-template-columns: 1fr !important; } }
        `}</style>
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
              Free plan available · Pro from $29.99/month · SEO Engine add-on from $14.99/month
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
