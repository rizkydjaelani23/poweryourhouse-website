import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing – Power Your House",
  description:
    "Free plan available. Pro at $29.99/month. SEO Engine add-on from $14.99/month. Show fabric colour previews and rank higher on Google — all through Shopify.",
  alternates: { canonical: "https://poweryourhouse.io/pricing" },
  openGraph: {
    title: "Pricing – Power Your House",
    description:
      "Free plan available. Pro at $29.99/month. Add the SEO Engine for $14.99/month or get Pro + SEO bundled at $44.99/month.",
    url: "https://poweryourhouse.io/pricing",
    type: "website",
  },
};

const freePlanFeatures = [
  "Up to 25 colour previews (lifetime)",
  "3 products",
  "Storefront gallery widget",
  "Approval workflow",
  "Works with any Shopify 2.0 theme",
  "Email support",
];

const proFeatures = [
  "Unlimited colour preview generation",
  "Unlimited products",
  "All fabric families (Plush, Velvet, Suede, Venice & more)",
  "Bulk generation — multiple swatches at once",
  "Storefront gallery embed",
  "Approval workflow",
  "Preview manager with search & filters",
  "Recent swatch library",
  "Priority email support",
];

const seoFeatures = [
  "Auto-generated meta titles & descriptions",
  "Image alt text for every colour preview",
  "Product schema markup (rich results)",
  "Colour & fabric keyword injection",
  "Works on Free or Pro plan",
];

const proSeoFeatures = [
  "Everything in Pro",
  "Everything in SEO Engine",
  "Colour-specific landing page SEO",
  "Best value — save vs buying separately",
];

const faqs = [
  {
    q: "Is there a free plan?",
    a: "Yes — the Free plan lets you generate up to 25 colour previews across 3 products and includes the full storefront gallery widget. No credit card required.",
  },
  {
    q: "Is there a free trial on paid plans?",
    a: "Yes — Shopify gives you a free trial period when you install any paid app. You can test Pro or Pro + SEO before you're charged a cent.",
  },
  {
    q: "What does the SEO Engine actually do?",
    a: "It auto-generates SEO meta titles, descriptions, and alt text for every product and colour preview using your actual fabric and colour data. It also injects structured schema markup to help Google display rich results.",
  },
  {
    q: "Can I add the SEO Engine to the Free plan?",
    a: "Yes. The SEO Engine add-on is $14.99/month and can be added to any plan including Free. If you're on Pro, upgrading to Pro + SEO Engine at $44.99/month is better value.",
  },
  {
    q: "What counts as a colour preview?",
    a: "A preview is one AI-generated colour image for one product. Approving, hiding or deleting a preview doesn't affect your count.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. Cancel directly from your Shopify admin at any time. Billing is handled through Shopify — no hidden fees.",
  },
  {
    q: "What themes does the gallery work with?",
    a: "The storefront colour gallery works with any Shopify 2.0 theme. No coding required — add it directly from the theme editor.",
  },
  {
    q: "Do you offer refunds?",
    a: "If you're unhappy within the first 7 days, contact us at hello@poweryourhouse.io and we'll sort it out.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function CheckIcon({ color = "#818cf8" }: { color?: string }) {
  return <span style={{ color, fontSize: "15px", marginTop: "1px", flexShrink: 0, fontWeight: 700 }}>✓</span>;
}

function FeatureRow({ text, color = "#818cf8" }: { text: string; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "11px" }}>
      <CheckIcon color={color} />
      <span style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <style>{`
        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        .seo-addon-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 960px) {
          .pricing-grid { grid-template-columns: 1fr; }
          .seo-addon-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <section style={{
        padding: "72px 0 56px",
        textAlign: "center",
        background: "linear-gradient(180deg, #0d1424 0%, #080d1a 100%)",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
      }}>
        <div className="container">
          <div className="badge section-eyebrow">💳 Pricing</div>
          <h1 className="section-title" style={{ margin: "14px auto 0", maxWidth: "600px" }}>
            Start free. Scale when you&apos;re ready.
          </h1>
          <p className="section-sub" style={{ margin: "14px auto 0", maxWidth: "520px" }}>
            Free plan available. Upgrade to Pro for unlimited previews. Add the SEO Engine to rank higher on Google.
          </p>
        </div>
      </section>

      {/* Main plan cards */}
      <section className="section">
        <div className="container">
          <div className="pricing-grid">

            {/* ── Free ── */}
            <div style={{
              background: "linear-gradient(160deg, #131c2e, #111827)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "36px 32px",
              position: "relative",
            }}>
              <div style={{
                display: "inline-block",
                background: "rgba(100,116,139,0.15)",
                border: "1px solid rgba(100,116,139,0.3)",
                color: "#94a3b8",
                padding: "4px 14px", borderRadius: "999px",
                fontSize: "13px", fontWeight: 700, marginBottom: "20px",
              }}>
                Free
              </div>

              <div style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: "52px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>$0</span>
                <span style={{ fontSize: "14px", color: "#64748b", marginLeft: "8px" }}>/ month</span>
              </div>
              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "28px", lineHeight: 1.6 }}>
                Try the app with 25 colour previews and 3 products. No credit card required.
              </p>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px", marginBottom: "28px" }}>
                {freePlanFeatures.map((f) => <FeatureRow key={f} text={f} color="#64748b" />)}
              </div>

              <a
                href="https://apps.shopify.com/image-colour-remake"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block", padding: "14px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#cbd5e1", textAlign: "center",
                  fontSize: "14px", fontWeight: 700, textDecoration: "none",
                  transition: "background 0.2s",
                }}
              >
                Get started free →
              </a>
            </div>

            {/* ── Pro ── */}
            <div style={{
              background: "linear-gradient(160deg, #1a2440, #111827)",
              border: "2px solid #4f46e5",
              borderRadius: "24px",
              padding: "36px 32px",
              position: "relative",
              boxShadow: "0 0 48px rgba(79,70,229,0.15)",
            }}>
              <div style={{
                position: "absolute", top: "-16px", left: "50%", transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
                color: "#fff", padding: "5px 18px", borderRadius: "999px",
                fontSize: "11px", fontWeight: 800, whiteSpace: "nowrap",
              }}>
                MOST POPULAR
              </div>

              <div style={{
                display: "inline-block",
                background: "rgba(79,70,229,0.15)",
                border: "1px solid rgba(79,70,229,0.4)",
                color: "#818cf8", padding: "4px 14px", borderRadius: "999px",
                fontSize: "13px", fontWeight: 700, marginBottom: "20px",
              }}>
                Pro
              </div>

              <div style={{ marginBottom: "8px" }}>
                <span style={{ fontSize: "52px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>$29</span>
                <span style={{ fontSize: "24px", fontWeight: 900, color: "#fff" }}>.99</span>
                <span style={{ fontSize: "14px", color: "#64748b", marginLeft: "8px" }}>/ month</span>
              </div>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "28px", lineHeight: 1.6 }}>
                Unlimited previews for unlimited products. Everything you need to sell colour at scale.
              </p>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px", marginBottom: "28px" }}>
                {proFeatures.map((f) => <FeatureRow key={f} text={f} color="#818cf8" />)}
              </div>

              <a
                href="https://apps.shopify.com/image-colour-remake"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block", padding: "15px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
                  color: "#fff", textAlign: "center",
                  fontSize: "14px", fontWeight: 700,
                  boxShadow: "0 4px 20px rgba(79,70,229,0.4)",
                  textDecoration: "none",
                }}
              >
                Start Pro →
              </a>
              <p style={{ textAlign: "center", fontSize: "11px", color: "#475569", marginTop: "12px" }}>
                Free trial included · Cancel anytime
              </p>
            </div>

            {/* ── Pro + SEO Engine ── */}
            <div style={{
              background: "linear-gradient(160deg, #0d1f16, #111827, #0d1f16)",
              border: "2px solid #10b981",
              borderRadius: "24px",
              padding: "36px 32px",
              position: "relative",
              boxShadow: "0 0 48px rgba(16,185,129,0.12)",
            }}>
              <div style={{
                position: "absolute", top: "-16px", left: "50%", transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #059669, #10b981)",
                color: "#fff", padding: "5px 18px", borderRadius: "999px",
                fontSize: "11px", fontWeight: 800, whiteSpace: "nowrap",
              }}>
                ★ BEST VALUE
              </div>

              <div style={{
                display: "inline-block",
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.4)",
                color: "#10b981", padding: "4px 14px", borderRadius: "999px",
                fontSize: "13px", fontWeight: 700, marginBottom: "20px",
              }}>
                Pro + SEO Engine
              </div>

              <div style={{ marginBottom: "4px" }}>
                <span style={{ fontSize: "52px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>$44</span>
                <span style={{ fontSize: "24px", fontWeight: 900, color: "#fff" }}>.99</span>
                <span style={{ fontSize: "14px", color: "#64748b", marginLeft: "8px" }}>/ month</span>
              </div>
              <div style={{
                display: "inline-block", fontSize: "11px", fontWeight: 700,
                color: "#10b981", background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)", padding: "3px 10px",
                borderRadius: "999px", marginBottom: "12px",
              }}>
                Save $0.98/mo vs buying separately
              </div>
              <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "28px", lineHeight: 1.6 }}>
                Unlimited colour previews + full SEO automation. The complete growth package.
              </p>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px", marginBottom: "28px" }}>
                {proSeoFeatures.map((f) => <FeatureRow key={f} text={f} color="#10b981" />)}
              </div>

              <a
                href="https://apps.shopify.com/image-colour-remake"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block", padding: "15px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  color: "#fff", textAlign: "center",
                  fontSize: "14px", fontWeight: 700,
                  boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
                  textDecoration: "none",
                }}
              >
                Start Pro + SEO →
              </a>
              <p style={{ textAlign: "center", fontSize: "11px", color: "#475569", marginTop: "12px" }}>
                Free trial included · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Engine Add-on spotlight */}
      <section style={{
        padding: "56px 0",
        background: "linear-gradient(160deg, #071a12 0%, #080e1c 60%, #071a12 100%)",
        borderTop: "1px solid rgba(16,185,129,0.1)",
        borderBottom: "1px solid rgba(16,185,129,0.1)",
      }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
              color: "#10b981", padding: "5px 14px", borderRadius: "999px",
              fontSize: "12px", fontWeight: 800, marginBottom: "14px",
            }}>
              🔍 SEO ENGINE ADD-ON — $14.99/mo
            </div>
            <h2 style={{
              fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 900, color: "#fff",
              marginBottom: "12px", letterSpacing: "-0.02em",
            }}>
              Rank higher for every colour you sell
            </h2>
            <p style={{ fontSize: "15px", color: "#94a3b8", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
              Add the SEO Engine to any plan. Works standalone on Free or included in Pro + SEO Engine.
            </p>
          </div>

          <div className="seo-addon-grid" style={{ maxWidth: "840px", margin: "0 auto" }}>
            {/* Left: features */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "20px", padding: "28px",
            }}>
              <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: 700, marginBottom: "16px", letterSpacing: "0.05em" }}>
                WHAT&apos;S INCLUDED
              </div>
              {seoFeatures.map((f) => <FeatureRow key={f} text={f} color="#10b981" />)}
            </div>

            {/* Right: visual mock */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Google snippet */}
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px", padding: "18px 20px",
              }}>
                <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: 600, marginBottom: "10px", letterSpacing: "0.05em" }}>
                  🔍 GENERATED META TITLE
                </div>
                <div style={{ fontSize: "14px", color: "#8ab4f8", fontWeight: 600, marginBottom: "4px" }}>
                  Mustard Velvet Armchair | 12 Fabric Colours | Free Delivery
                </div>
                <div style={{ fontSize: "12px", color: "#bdc1c6", lineHeight: 1.5 }}>
                  Shop our Mustard Velvet Armchair available in 12 premium fabric colours. AI colour previews for every option. Plush, bouclé & chenille variants...
                </div>
              </div>

              {/* Alt text */}
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px", padding: "18px 20px",
              }}>
                <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: 600, marginBottom: "10px", letterSpacing: "0.05em" }}>
                  🖼️ AUTO ALT TEXT
                </div>
                {["Mustard Velvet Armchair – bouclé fabric, solid oak legs", "Sage Green Corner Sofa – chenille upholstery, 4-seater L-shape"].map((alt, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "8px",
                    padding: "6px 0",
                    borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  }}>
                    <span style={{ color: "#10b981", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>{alt}</span>
                  </div>
                ))}
              </div>

              {/* Pricing CTA */}
              <div style={{
                background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "14px", padding: "18px 20px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
              }}>
                <div>
                  <div style={{ fontSize: "13px", color: "#fff", fontWeight: 700, marginBottom: "2px" }}>Add SEO Engine</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>$14.99/month · add to any plan</div>
                </div>
                <a
                  href="https://apps.shopify.com/image-colour-remake"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "10px 18px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #059669, #10b981)",
                    color: "#fff", fontSize: "13px", fontWeight: 700,
                    textDecoration: "none", whiteSpace: "nowrap",
                  }}
                >
                  Get it →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare table */}
      <section className="section">
        <div className="container" style={{ maxWidth: "780px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div className="badge section-eyebrow">📊 Compare plans</div>
            <h2 className="section-title" style={{ marginTop: "14px" }}>What&apos;s in each plan</h2>
          </div>

          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px", overflow: "hidden",
          }}>
            {/* Table header */}
            <div style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              padding: "16px 24px", gap: "8px",
            }}>
              <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: 700 }}>FEATURE</div>
              {["Free", "Pro $29.99", "Pro+SEO $44.99"].map((h) => (
                <div key={h} style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700, textAlign: "center" }}>{h}</div>
              ))}
            </div>

            {[
              { feature: "Colour previews", free: "25 total", pro: "Unlimited", proseo: "Unlimited" },
              { feature: "Products", free: "3", pro: "Unlimited", proseo: "Unlimited" },
              { feature: "Storefront gallery", free: "✓", pro: "✓", proseo: "✓" },
              { feature: "Approval workflow", free: "✓", pro: "✓", proseo: "✓" },
              { feature: "Bulk generation", free: "—", pro: "✓", proseo: "✓" },
              { feature: "Swatch library", free: "—", pro: "✓", proseo: "✓" },
              { feature: "Meta title & description", free: "—", pro: "—", proseo: "✓" },
              { feature: "Image alt text", free: "—", pro: "—", proseo: "✓" },
              { feature: "Schema markup", free: "—", pro: "—", proseo: "✓" },
              { feature: "Colour keyword SEO", free: "—", pro: "—", proseo: "✓" },
            ].map((row, i) => (
              <div key={row.feature} style={{
                display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
                padding: "14px 24px", gap: "8px",
                borderBottom: i < 9 ? "1px solid rgba(255,255,255,0.05)" : "none",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              }}>
                <div style={{ fontSize: "13px", color: "#cbd5e1" }}>{row.feature}</div>
                {[row.free, row.pro, row.proseo].map((val, j) => (
                  <div key={j} style={{
                    fontSize: "13px",
                    color: val === "✓" ? "#10b981" : val === "—" ? "#374151" : "#e2e8f0",
                    textAlign: "center", fontWeight: val === "✓" ? 700 : 400,
                  }}>
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: "#0d1424", paddingTop: "72px" }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <div style={{ marginBottom: "48px" }}>
            <div className="badge section-eyebrow">❓ FAQ</div>
            <h2 className="section-title" style={{ marginTop: "14px" }}>Common questions</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                borderTop: i === 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                padding: "24px 0",
              }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#e8efff", marginBottom: "8px" }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "40px", textAlign: "center" }}>
            <p style={{ fontSize: "15px", color: "#94a3b8", marginBottom: "16px" }}>
              Still have questions?
            </p>
            <Link href="/contact" className="btn-primary">
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
