import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing – Power Your House",
  description: "Simple, transparent pricing for Image Colour Remake. Start free, upgrade when you need more.",
};

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    desc: "Try the core features at no cost. No credit card needed.",
    color: "#64748b",
    highlight: false,
    features: [
      "5 product previews",
      "Basic swatch library",
      "Storefront gallery embed",
      "Email support",
    ],
    cta: "Get Started Free",
    ctaHref: "https://apps.shopify.com",
  },
  {
    name: "Starter",
    price: "14",
    period: "per month",
    desc: "Perfect for small stores launching their colour range.",
    color: "#3b82f6",
    highlight: false,
    features: [
      "50 product previews / month",
      "Unlimited swatch families",
      "Storefront gallery embed",
      "Approval workflow",
      "Priority email support",
    ],
    cta: "Start Starter",
    ctaHref: "https://apps.shopify.com",
  },
  {
    name: "Growth",
    price: "39",
    period: "per month",
    desc: "For stores scaling up with a large catalogue.",
    color: "#4f46e5",
    highlight: true,
    features: [
      "250 product previews / month",
      "Unlimited swatch families",
      "Bulk generation",
      "Custom display name per colour",
      "Approval workflow",
      "Priority support (< 24h)",
    ],
    cta: "Start Growth",
    ctaHref: "https://apps.shopify.com",
  },
  {
    name: "Pro",
    price: "89",
    period: "per month",
    desc: "High-volume stores that need maximum capacity.",
    color: "#06b6d4",
    highlight: false,
    features: [
      "Unlimited product previews",
      "Everything in Growth",
      "White-glove onboarding",
      "Dedicated support channel",
      "Early access to new features",
    ],
    cta: "Start Pro",
    ctaHref: "https://apps.shopify.com",
  },
];

const faqs = [
  {
    q: "Is there really a free plan?",
    a: "Yes. You can install the app and generate up to 5 product previews with no credit card required. Upgrade when you're ready.",
  },
  {
    q: "What counts as a preview?",
    a: "A preview is one generated colour image for one product. Approving or rejecting a preview doesn't count against your limit.",
  },
  {
    q: "Can I change plans at any time?",
    a: "Absolutely. Upgrade or downgrade at any point. Billing is handled through Shopify's standard billing — no surprises.",
  },
  {
    q: "Do you offer refunds?",
    a: "If you're unhappy within the first 7 days of a paid plan, contact us at hello@poweryourhouse.io and we'll sort it out.",
  },
  {
    q: "What themes does the gallery work with?",
    a: "The storefront gallery embed is theme-agnostic and works with any Shopify 2.0 theme. We test against the most popular themes.",
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
            Simple, honest pricing
          </h1>
          <p className="section-sub" style={{ margin: "14px auto 0" }}>
            Start free, scale when you're ready. All plans include the full feature set — you just get more capacity as you grow.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="section">
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            alignItems: "start",
          }}>
            {plans.map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? "linear-gradient(160deg, #1a2440, #111827)" : "#111827",
                border: plan.highlight ? `2px solid ${plan.color}` : "1px solid rgba(255,255,255,0.07)",
                borderRadius: "22px",
                padding: "32px 28px",
                position: "relative",
                boxShadow: plan.highlight ? `0 0 40px ${plan.color}22` : "none",
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    background: `linear-gradient(135deg, ${plan.color}, #3b82f6)`,
                    color: "#fff", padding: "5px 16px", borderRadius: "999px",
                    fontSize: "12px", fontWeight: 800, whiteSpace: "nowrap",
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{
                  display: "inline-block",
                  background: `${plan.color}18`,
                  border: `1px solid ${plan.color}44`,
                  color: plan.color,
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 700,
                  marginBottom: "18px",
                }}>
                  {plan.name}
                </div>

                <div style={{ marginBottom: "6px" }}>
                  <span style={{ fontSize: "42px", fontWeight: 900, color: "#fff" }}>
                    ${plan.price}
                  </span>
                  <span style={{ fontSize: "14px", color: "#64748b", marginLeft: "4px" }}>
                    / {plan.period}
                  </span>
                </div>

                <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "24px", lineHeight: 1.6 }}>
                  {plan.desc}
                </p>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px", marginBottom: "24px" }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
                      <span style={{ color: plan.color, fontSize: "14px", marginTop: "1px", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={plan.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    padding: "13px",
                    borderRadius: "12px",
                    background: plan.highlight
                      ? `linear-gradient(135deg, ${plan.color}, #3b82f6)`
                      : "rgba(255,255,255,0.05)",
                    border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: 700,
                    boxShadow: plan.highlight ? `0 4px 16px ${plan.color}44` : "none",
                  }}
                >
                  {plan.cta} →
                </a>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", marginTop: "32px", fontSize: "13px", color: "#64748b" }}>
            All plans billed through Shopify. Cancel anytime.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: "#0d1424", paddingTop: "72px" }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <div style={{ marginBottom: "48px" }}>
            <div className="badge section-eyebrow">❓ FAQ</div>
            <h2 className="section-title" style={{ marginTop: "14px" }}>Common questions</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
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
