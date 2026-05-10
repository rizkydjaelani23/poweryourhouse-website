import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing – Power Your House",
  description: "One simple plan. Everything you need to show fabric colour previews on your Shopify store.",
};

const features = [
  "Unlimited colour preview generation",
  "All fabric families (Plush, Velvet, Suede, Venice & more)",
  "Bulk generation — upload multiple swatches at once",
  "Storefront gallery embed (works with any Shopify 2.0 theme)",
  "Approval workflow — control what customers see",
  "Preview manager with search & filters",
  "Recent swatch library",
  "Email support",
];

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes — Shopify gives you a free trial period when you install any paid app. You can test everything before you're charged.",
  },
  {
    q: "What counts as a colour preview?",
    a: "A preview is one generated colour image for one product. Approving, hiding or deleting a preview doesn't affect your count.",
  },
  {
    q: "Can I cancel at any time?",
    a: "Yes. Cancel directly from your Shopify admin at any time. Billing is handled through Shopify — no hidden fees.",
  },
  {
    q: "Do you offer refunds?",
    a: "If you're unhappy within the first 7 days, contact us at hello@poweryourhouse.io and we'll sort it out.",
  },
  {
    q: "What themes does the gallery work with?",
    a: "The storefront colour gallery works with any Shopify 2.0 theme. No coding required — add it directly from the theme editor.",
  },
  {
    q: "Can I use this for any furniture product?",
    a: "Yes. It works with beds, sofas, armchairs, ottomans, and any upholstered product. Just upload a fabric swatch and the app generates the preview.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section style={{
        padding: "72px 0 56px",
        textAlign: "center",
        background: "linear-gradient(180deg, #0d1424 0%, #080d1a 100%)",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
      }}>
        <div className="container">
          <div className="badge section-eyebrow">💳 Pricing</div>
          <h1 className="section-title" style={{ margin: "14px auto 0", maxWidth: "520px" }}>
            One plan. Everything included.
          </h1>
          <p className="section-sub" style={{ margin: "14px auto 0" }}>
            No tiers, no feature limits, no surprises. Just one simple price for everything the app offers.
          </p>
        </div>
      </section>

      {/* Single plan card */}
      <section className="section">
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            background: "linear-gradient(160deg, #1a2440, #111827)",
            border: "2px solid #4f46e5",
            borderRadius: "28px",
            padding: "48px 44px",
            maxWidth: "480px",
            width: "100%",
            position: "relative",
            boxShadow: "0 0 60px rgba(79,70,229,0.15)",
          }}>
            {/* badge */}
            <div style={{
              position: "absolute", top: "-16px", left: "50%", transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
              color: "#fff", padding: "6px 20px", borderRadius: "999px",
              fontSize: "12px", fontWeight: 800, whiteSpace: "nowrap",
            }}>
              Shopify App
            </div>

            {/* plan name */}
            <div style={{
              display: "inline-block",
              background: "rgba(79,70,229,0.15)",
              border: "1px solid rgba(79,70,229,0.4)",
              color: "#818cf8",
              padding: "4px 14px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "24px",
            }}>
              Standard
            </div>

            {/* price */}
            <div style={{ marginBottom: "8px" }}>
              <span style={{ fontSize: "64px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                $29
              </span>
              <span style={{ fontSize: "28px", fontWeight: 900, color: "#fff" }}>.99</span>
              <span style={{ fontSize: "15px", color: "#64748b", marginLeft: "8px" }}>/ month</span>
            </div>

            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "32px", lineHeight: 1.6 }}>
              Everything you need to show fabric colour previews on your Shopify store. Billed monthly through Shopify.
            </p>

            {/* features */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", marginBottom: "32px" }}>
              {features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ color: "#818cf8", fontSize: "15px", marginTop: "1px", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "14px", color: "#cbd5e1", lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://apps.shopify.com/image-colour-remake"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "16px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
                color: "#fff",
                textAlign: "center",
                fontSize: "15px",
                fontWeight: 700,
                boxShadow: "0 4px 20px rgba(79,70,229,0.4)",
                textDecoration: "none",
              }}
            >
              Install on Shopify →
            </a>

            <p style={{ textAlign: "center", fontSize: "12px", color: "#475569", marginTop: "14px" }}>
              Free trial included · Cancel anytime
            </p>
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
