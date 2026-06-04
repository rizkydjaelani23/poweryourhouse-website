"use client";
/**
 * SaaS Pricing Section — Gumroad popup checkout.
 *
 * Env vars (NEXT_PUBLIC_ so they are embedded at build time):
 *   NEXT_PUBLIC_GUMROAD_PRODUCT_STARTER       — Gumroad product permalink
 *   NEXT_PUBLIC_GUMROAD_PRODUCT_PRO           — Gumroad product permalink
 *   NEXT_PUBLIC_GUMROAD_PRODUCT_BUSINESS      — Gumroad product permalink
 *   NEXT_PUBLIC_GUMROAD_PRODUCT_STANDARD_PACK — Gumroad product permalink
 *   NEXT_PUBLIC_GUMROAD_PRODUCT_HD_PACK       — Gumroad product permalink
 */

import Link from "next/link";
import { useGumroad } from "./GumroadButton";

const PRODUCTS = {
  STARTER:       process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_STARTER       || "",
  PRO:           process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_PRO           || "",
  BUSINESS:      process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_BUSINESS      || "",
  STANDARD_PACK: process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_STANDARD_PACK || "",
  HD_PACK:       process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_HD_PACK       || "",
};

function PlanButton({
  productPath,
  label,
  background,
  color = "#fff",
  border,
  shadow,
}: {
  productPath: string | null;
  label:       string;
  background:  string;
  color?:      string;
  border?:     string;
  shadow?:     string;
}) {
  const { openCheckout } = useGumroad();

  // Free plan — just link to signup
  if (!productPath) {
    return (
      <Link
        href="/signup"
        style={{
          display: "block", padding: "14px", borderRadius: "12px",
          background, border: border || "none",
          color, textAlign: "center", fontSize: "14px", fontWeight: 700,
          textDecoration: "none", boxShadow: shadow,
        }}
      >
        {label}
      </Link>
    );
  }

  return (
    <button
      onClick={() => openCheckout(productPath)}
      style={{
        width: "100%", padding: "14px", borderRadius: "12px",
        background, border: border || "none",
        color, fontSize: "14px", fontWeight: 700, cursor: "pointer",
        boxShadow: shadow, transition: "opacity 0.15s",
      }}
    >
      {label}
    </button>
  );
}

const plans = [
  {
    id: null as string | null,
    badge: "Free",
    badgeBg: "rgba(100,116,139,0.15)",
    badgeBorder: "1px solid rgba(100,116,139,0.3)",
    badgeColor: "#94a3b8",
    price: "$0",
    period: "/ month",
    desc: "Get started instantly. No credit card required.",
    credits: "5 Standard + 1 HD credits",
    features: [
      "5 standard colour remakes",
      "1 HD photorealistic render",
      "Up to 6 colours per generation",
      "Colour picker & swatch upload",
      "Download generated images",
      "Email support",
    ],
    featureColor: "#64748b",
    cardBg: "linear-gradient(160deg, #131c2e, #111827)",
    cardBorder: "1px solid rgba(255,255,255,0.1)",
    buttonLabel: "Start free →",
    buttonBg: "rgba(255,255,255,0.06)",
    buttonBorder: "1px solid rgba(255,255,255,0.12)",
    buttonColor: "#cbd5e1",
    popular: false,
    best: false,
  },
  {
    id: PRODUCTS.STARTER,
    badge: "Starter",
    badgeBg: "rgba(59,130,246,0.12)",
    badgeBorder: "1px solid rgba(59,130,246,0.35)",
    badgeColor: "#60a5fa",
    price: "$9",
    originalPrice: "$18",
    period: "/ month",
    desc: "Perfect for individuals who recolour regularly.",
    credits: "100 Standard + 10 HD / month",
    features: [
      "100 standard credits / month",
      "10 HD photorealistic credits / month",
      "Up to 6 colours per generation",
      "Credits refresh each billing cycle",
      "Colour picker & swatch upload",
      "Full generation history",
      "Download all images",
    ],
    featureColor: "#60a5fa",
    cardBg: "linear-gradient(160deg, #111e36, #111827)",
    cardBorder: "1px solid rgba(59,130,246,0.3)",
    buttonLabel: "Get Starter →",
    buttonBg: "linear-gradient(135deg, #3b82f6, #2563eb)",
    buttonShadow: "0 4px 18px rgba(59,130,246,0.35)",
    buttonColor: "#fff",
    popular: false,
    best: false,
  },
  {
    id: PRODUCTS.PRO,
    badge: "Pro",
    badgeBg: "rgba(79,70,229,0.15)",
    badgeBorder: "1px solid rgba(79,70,229,0.4)",
    badgeColor: "#818cf8",
    price: "$29",
    originalPrice: "$58",
    period: "/ month",
    desc: "For studios & teams with high-volume colour work.",
    credits: "500 Standard + 60 HD / month",
    features: [
      "500 standard credits / month",
      "60 HD photorealistic credits / month",
      "Up to 20 colours per generation",
      "Bulk swatch batches in one go",
      "Credits refresh each billing cycle",
      "Colour picker & swatch upload",
      "Full generation history",
      "Priority support",
    ],
    featureColor: "#818cf8",
    cardBg: "linear-gradient(160deg, #1a2440, #111827)",
    cardBorder: "2px solid #4f46e5",
    cardShadow: "0 0 48px rgba(79,70,229,0.15)",
    buttonLabel: "Get Pro →",
    buttonBg: "linear-gradient(135deg, #4f46e5, #3b82f6)",
    buttonShadow: "0 4px 20px rgba(79,70,229,0.4)",
    buttonColor: "#fff",
    popular: true,
    best: false,
  },
  {
    id: PRODUCTS.BUSINESS,
    badge: "Business",
    badgeBg: "rgba(16,185,129,0.12)",
    badgeBorder: "1px solid rgba(16,185,129,0.4)",
    badgeColor: "#10b981",
    price: "$79",
    originalPrice: "$158",
    period: "/ month",
    desc: "Unlimited standard renders for power users & agencies.",
    credits: "Unlimited Standard + 200 HD / month",
    features: [
      "∞ Unlimited standard credits",
      "200 HD photorealistic credits / month",
      "Up to 20 colours per generation",
      "Bulk swatch batches in one go",
      "Credits refresh each billing cycle",
      "Colour picker & swatch upload",
      "Full generation history",
      "Priority support",
    ],
    featureColor: "#10b981",
    cardBg: "linear-gradient(160deg, #0d1f16, #111827)",
    cardBorder: "2px solid #10b981",
    cardShadow: "0 0 48px rgba(16,185,129,0.12)",
    buttonLabel: "Get Business →",
    buttonBg: "linear-gradient(135deg, #059669, #10b981)",
    buttonShadow: "0 4px 20px rgba(16,185,129,0.3)",
    buttonColor: "#fff",
    popular: false,
    best: true,
  },
];

const packs = [
  {
    id: PRODUCTS.STANDARD_PACK,
    label: "Standard Pack",
    amount: "100 credits",
    price: "$9",
    originalPrice: "$18",
    desc: "One-time top-up",
    colour: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "1px solid rgba(59,130,246,0.25)",
  },
  {
    id: PRODUCTS.HD_PACK,
    label: "HD Pack",
    amount: "20 HD credits",
    price: "$14",
    originalPrice: "$28",
    desc: "One-time top-up",
    colour: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "1px solid rgba(139,92,246,0.25)",
  },
];

function CheckIcon({ color }: { color: string }) {
  return <span style={{ color, fontSize: "14px", flexShrink: 0 }}>✓</span>;
}

export default function SaaSPricingSection() {
  const { openCheckout } = useGumroad();

  return (
    <section style={{ padding: "72px 0 60px", background: "#080d1a" }}>
      <div className="container">

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "16px" }}>
            Pricing
          </p>
          <h2 style={{
            fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, color: "#fff",
            margin: "0 0 12px", letterSpacing: "-0.02em",
          }}>
            Recolour any image in seconds
          </h2>
          <p style={{ fontSize: "15px", color: "#64748b", margin: "0 auto", maxWidth: "480px", lineHeight: 1.7 }}>
            Upload a photo, pick a colour, get a photorealistic result. Works on any product, room or fabric — worldwide.
          </p>
        </div>

        {/* Plan cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}>
          {plans.map((plan) => (
            <div
              key={plan.badge}
              style={{
                background: plan.cardBg,
                border: plan.cardBorder,
                borderRadius: "22px",
                padding: "30px 26px",
                position: "relative",
                boxShadow: (plan as { cardShadow?: string }).cardShadow,
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
                  color: "#fff", padding: "4px 16px", borderRadius: "999px",
                  fontSize: "11px", fontWeight: 800, whiteSpace: "nowrap",
                }}>
                  MOST POPULAR
                </div>
              )}
              {plan.best && (
                <div style={{
                  position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  color: "#fff", padding: "4px 16px", borderRadius: "999px",
                  fontSize: "11px", fontWeight: 800, whiteSpace: "nowrap",
                }}>
                  ★ BEST VALUE
                </div>
              )}

              {/* Badge */}
              <div style={{
                display: "inline-block",
                background: plan.badgeBg, border: plan.badgeBorder, color: plan.badgeColor,
                padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: 700,
                marginBottom: "16px",
              }}>
                {plan.badge}
              </div>

              {/* Price */}
              <div style={{ marginBottom: "6px" }}>
                {(plan as { originalPrice?: string }).originalPrice && (
                  <>
                    <div style={{
                      display: "inline-flex", alignItems: "center",
                      background: "linear-gradient(135deg, #ef4444, #f97316)",
                      borderRadius: "7px", padding: "4px 10px", marginBottom: "6px",
                    }}>
                      <span style={{ fontSize: "11px", fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>🔥 50% DISCOUNT SALE</span>
                    </div>
                    <br />
                  </>
                )}
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "46px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{plan.price}</span>
                  {(plan as { originalPrice?: string }).originalPrice && (
                    <span style={{ fontSize: "18px", fontWeight: 700, color: "#475569", textDecoration: "line-through", lineHeight: 1 }}>
                      {(plan as { originalPrice?: string }).originalPrice}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "14px", color: "#64748b" }}>{plan.period}</span>
              </div>

              {/* Credits pill */}
              <div style={{
                display: "inline-block", fontSize: "11px", fontWeight: 700,
                color: plan.featureColor,
                background: `${plan.featureColor}14`,
                border: `1px solid ${plan.featureColor}30`,
                padding: "3px 10px", borderRadius: "999px", marginBottom: "10px",
              }}>
                {plan.credits}
              </div>

              <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: 1.6 }}>
                {plan.desc}
              </p>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", marginBottom: "20px" }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "9px" }}>
                    <CheckIcon color={plan.featureColor} />
                    <span style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              <PlanButton
                productPath={plan.id}
                label={plan.buttonLabel}
                background={plan.buttonBg}
                color={plan.buttonColor}
                border={(plan as { buttonBorder?: string }).buttonBorder}
                shadow={(plan as { buttonShadow?: string }).buttonShadow}
              />
            </div>
          ))}
        </div>

        {/* Credit top-up packs */}
        <div style={{ marginTop: "40px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#e2e8f0", margin: "0 0 6px" }}>
              Need more credits? Top up anytime.
            </h3>
            <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>
              One-time purchase — credits never expire.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", maxWidth: "600px", margin: "0 auto" }}>
            {packs.map((pack) => (
              <div
                key={pack.label}
                style={{
                  background: pack.bg, border: pack.border,
                  borderRadius: "16px", padding: "22px",
                  display: "flex", flexDirection: "column", gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: pack.colour, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0" }}>{pack.label}</div>
                    <div style={{ fontSize: "12px", color: pack.colour, fontWeight: 600 }}>{pack.amount}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", background: "linear-gradient(135deg, #ef4444, #f97316)", borderRadius: "5px", padding: "2px 7px", marginBottom: "3px" }}>
                      <span style={{ fontSize: "9px", fontWeight: 900, color: "#fff", letterSpacing: "0.04em" }}>🔥 50% OFF</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px", justifyContent: "flex-end" }}>
                      <div style={{ fontSize: "22px", fontWeight: 900, color: "#fff" }}>{pack.price}</div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#475569", textDecoration: "line-through" }}>{pack.originalPrice}</div>
                    </div>
                    <div style={{ fontSize: "11px", color: "#475569" }}>{pack.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => openCheckout(pack.id || "")}
                  style={{
                    width: "100%", padding: "10px", borderRadius: "10px",
                    background: pack.colour, color: "#fff",
                    fontSize: "13px", fontWeight: 700, cursor: "pointer",
                    border: "none", transition: "opacity 0.15s",
                  }}
                >
                  Buy {pack.label} →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <p style={{ fontSize: "14px", color: "#475569", marginBottom: "16px" }}>
            Secure checkout powered by Gumroad · Cancel anytime · Questions?{" "}
            <a href="mailto:hello@poweryourhouse.io" style={{ color: "#60a5fa" }}>hello@poweryourhouse.io</a>
          </p>
        </div>
      </div>
    </section>
  );
}
