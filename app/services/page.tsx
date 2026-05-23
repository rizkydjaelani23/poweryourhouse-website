import Link from "next/link";
import type { Metadata } from "next";
import BuyButton from "./BuyButton";

// ── LemonSqueezy variant IDs for service products ─────────────────────────────
const VARIANTS = {
  SERVICE_STARTER:     process.env.NEXT_PUBLIC_LS_VARIANT_SERVICE_STARTER     || "",
  SERVICE_GROWTH:      process.env.NEXT_PUBLIC_LS_VARIANT_SERVICE_GROWTH      || "",
  SERVICE_MAINTENANCE: process.env.NEXT_PUBLIC_LS_VARIANT_SERVICE_MAINTENANCE || "",
  SERVICE_FIX:         process.env.NEXT_PUBLIC_LS_VARIANT_SERVICE_FIX         || "",
  SERVICE_REFRESH:     process.env.NEXT_PUBLIC_LS_VARIANT_SERVICE_REFRESH     || "",
};

export const metadata: Metadata = {
  title: "Social Media Automation Service | Power Your House",
  description:
    "We set up and automate 30 days of Facebook & Instagram posts for your home decor or furniture business — AI-generated images, captions, hashtags, and scheduled posting. Done for you.",
};

const plans = [
  {
    name: "Starter",
    price: "$197",
    freq: "one-time",
    tagline: "Perfect for small shops getting started with social media.",
    posts: "30 posts",
    postsNote: "1 post / day",
    platforms: "Facebook + Instagram",
    features: [
      "30 AI-generated product images",
      "30 platform-specific captions + hashtags",
      "Facebook Page + Instagram Business connected",
      "Fully automated scheduling",
      "All posts go live at optimal times",
      "Content calendar handed to you",
      "7 days post-launch support via email",
    ],
    highlight: false,
    cta: "Get Starter →",
    badge: null,
    variantId: VARIANTS.SERVICE_STARTER,
    mailtoSubject: "Starter Social Media Automation",
  },
  {
    name: "Growth",
    price: "$297",
    freq: "one-time",
    tagline: "Double the presence. Twice daily posting keeps your brand front of mind.",
    posts: "60 posts",
    postsNote: "2 posts / day",
    platforms: "Facebook + Instagram",
    features: [
      "60 AI-generated product images",
      "60 captions — morning & afternoon batches",
      "Facebook Page + Instagram Business connected",
      "Fully automated scheduling",
      "Morning + afternoon posting, every day",
      "Content calendar handed to you",
      "14 days post-launch support via email",
      "One free content refresh (swap images/captions)",
    ],
    highlight: true,
    cta: "Get Growth →",
    badge: "Most Popular",
    variantId: VARIANTS.SERVICE_GROWTH,
    mailtoSubject: "Growth Social Media Automation",
  },
];

const addons = [
  {
    name: "Monthly Maintenance",
    price: "$49",
    freq: "/ month",
    desc: "We monitor the automation, fix any broken connections, and keep everything running smoothly. Ideal if you want peace of mind month to month.",
    colour: "#3b82f6",
    variantId: VARIANTS.SERVICE_MAINTENANCE,
  },
  {
    name: "One-Time Fix",
    price: "$19",
    freq: "flat fee",
    desc: "Something broke? We diagnose and fix the issue — broken connections, expired permissions, disconnected accounts — one flat charge, no subscription needed.",
    colour: "#8b5cf6",
    variantId: VARIANTS.SERVICE_FIX,
  },
  {
    name: "Content Refresh",
    price: "$40",
    freq: "one-time",
    desc: "New month, new content. We generate a fresh 30-day batch of AI images and captions for your feed. Keep your audience engaged without lifting a finger.",
    colour: "#10b981",
    variantId: VARIANTS.SERVICE_REFRESH,
  },
];

const steps = [
  {
    n: "01",
    title: "You send us your details",
    body: "Facebook Page name, Instagram handle, what products you sell, and any brand colours or style preferences.",
  },
  {
    n: "02",
    title: "We build the content",
    body: "We create AI-generated product images tailored to your business and write captions with relevant hashtags for both platforms.",
  },
  {
    n: "03",
    title: "We connect and automate",
    body: "Your Facebook and Instagram accounts are linked via the official Meta API. Our automation system handles scheduling from there.",
  },
  {
    n: "04",
    title: "Posts go live — without you lifting a finger",
    body: "The system fires every morning and afternoon for 30 days. You get the full content calendar so you always know what's posting.",
  },
];

const faqs = [
  {
    q: "Do I need to give you my passwords?",
    a: "No. We connect through Facebook's official API. You authorise the connection from your own account — we never need your login credentials.",
  },
  {
    q: "What if I want more than 2 posts a day?",
    a: "No problem — we can set up any posting frequency. Just mention it when you email us and we'll quote accordingly.",
  },
  {
    q: "What types of products work best?",
    a: "Anything visual. Curtains, blinds, sofas, rugs, wall art, tiles, flooring, paint — any home decor or furniture product photographs well and shows colour variation clearly.",
  },
  {
    q: "Can you show products in different colours?",
    a: "Yes — that's our speciality. We use AI colour-remaking technology to show your products in multiple colourways across the 30-day feed.",
  },
  {
    q: "What happens after 30 days?",
    a: "The automation stops automatically. You can order a Content Refresh ($40) to queue another 30 days of fresh posts.",
  },
  {
    q: "How long does setup take?",
    a: "Typically 2–4 business days from the moment you send us your details and grant page access.",
  },
  {
    q: "What if something breaks mid-month?",
    a: "The Monthly Maintenance add-on covers you. Without it, a One-Time Fix ($19) gets everything back on track within 24 hours.",
  },
];

export default function ServicesPage() {
  return (
    <div style={{ background: "#080d1a", minHeight: "100vh", padding: "100px 0 80px" }}>
      <div className="container" style={{ maxWidth: "860px" }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <div style={{
            display: "inline-block",
            fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em",
            color: "#60a5fa", textTransform: "uppercase",
            background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: "999px", padding: "4px 14px", marginBottom: "20px",
          }}>
            Done-For-You Service
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 900, color: "#fff",
            letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.15,
          }}>
            30 Days of Social Media,<br />
            <span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Fully Automated
            </span>
          </h1>
          <p style={{ fontSize: "17px", color: "#64748b", maxWidth: "540px", margin: "0 auto 28px", lineHeight: 1.75 }}>
            We set up Facebook and Instagram automated posting for your home decor or
            furniture business. AI-generated product images, captions, hashtags, and a
            scheduling system that runs itself — you don&apos;t touch a thing.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:hello@poweryourhouse.io?subject=Social Media Automation Enquiry" style={{
              padding: "14px 28px", borderRadius: "12px",
              background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
              color: "#fff", fontWeight: 800, fontSize: "15px",
              boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
            }}>
              Get started — email us →
            </a>
            <a href="#how-it-works" style={{
              padding: "14px 24px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8", fontWeight: 700, fontSize: "15px",
            }}>
              See how it works
            </a>
          </div>
        </div>

        {/* ── How it works ── */}
        <div id="how-it-works" style={{ marginBottom: "72px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#e2e8f0", marginBottom: "32px", textAlign: "center" }}>
            How it works
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
            {steps.map((s) => (
              <div key={s.n} style={{
                background: "linear-gradient(160deg, #0d1424, #0a1020)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px", padding: "24px 20px",
              }}>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "#1e293b", marginBottom: "10px", lineHeight: 1 }}>
                  {s.n}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0", marginBottom: "8px" }}>{s.title}</div>
                <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.65 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pricing ── */}
        <div style={{ marginBottom: "72px" }}>
          <p style={{ fontSize: "11px", fontWeight: 800, color: "#64748b", letterSpacing: "0.14em", textTransform: "uppercase", textAlign: "center", marginBottom: "16px" }}>
            Pricing
          </p>
          <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#fff", textAlign: "center", marginBottom: "8px", letterSpacing: "-0.02em" }}>
            Simple, one-time packages
          </h2>
          <p style={{ fontSize: "14px", color: "#475569", textAlign: "center", marginBottom: "40px" }}>
            No monthly retainer required. Pay once, get 30 days of automated posting.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "16px" }}>
            {plans.map((plan) => (
              <div key={plan.name} style={{
                position: "relative",
                background: plan.highlight
                  ? "linear-gradient(160deg, #111e3a, #111827)"
                  : "linear-gradient(160deg, #0d1424, #111827)",
                border: plan.highlight ? "2px solid #3b82f6" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "32px 28px",
                boxShadow: plan.highlight ? "0 0 48px rgba(59,130,246,0.12)" : undefined,
              }}>
                {plan.badge && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                    color: "#fff", padding: "4px 18px", borderRadius: "999px",
                    fontSize: "11px", fontWeight: 800, whiteSpace: "nowrap",
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: plan.highlight ? "#60a5fa" : "#64748b" }}>
                    {plan.name}
                  </span>
                </div>
                <div style={{ marginBottom: "4px" }}>
                  <span style={{ fontSize: "48px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: "14px", color: "#475569", marginLeft: "6px" }}>{plan.freq}</span>
                </div>

                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "11px", fontWeight: 700,
                  background: plan.highlight ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.05)",
                  border: plan.highlight ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.1)",
                  color: plan.highlight ? "#60a5fa" : "#64748b",
                  borderRadius: "999px", padding: "3px 10px", marginBottom: "12px",
                }}>
                  {plan.posts} &middot; {plan.postsNote} &middot; {plan.platforms}
                </div>

                <p style={{ fontSize: "13px", color: "#475569", marginBottom: "22px", lineHeight: 1.6 }}>
                  {plan.tagline}
                </p>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "18px", marginBottom: "24px" }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                      <span style={{ color: plan.highlight ? "#60a5fa" : "#475569", fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>✓</span>
                      <span style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <BuyButton
                  variantId={plan.variantId}
                  label={plan.cta}
                  fallbackHref={`mailto:hello@poweryourhouse.io?subject=${encodeURIComponent(plan.mailtoSubject)}&body=${encodeURIComponent("Hi,\n\nI'd like to get started with the " + plan.name + " package (" + plan.price + ").\n\nBusiness name: \nFacebook Page: \nInstagram handle: \nProducts I sell: \n\nThanks!")}`}
                  style={{
                    display: "block", textAlign: "center",
                    padding: "14px", borderRadius: "12px",
                    background: plan.highlight
                      ? "linear-gradient(135deg, #3b82f6, #4f46e5)"
                      : "rgba(255,255,255,0.06)",
                    border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.1)",
                    color: "#fff", fontWeight: 700, fontSize: "14px",
                    boxShadow: plan.highlight ? "0 4px 20px rgba(59,130,246,0.35)" : undefined,
                  }}
                />
              </div>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#334155", textAlign: "center", marginTop: "16px" }}>
            Delivered within 2–4 business days · Payments processed securely via Lemon Squeezy
          </p>
        </div>

        {/* ── Add-ons ── */}
        <div style={{ marginBottom: "72px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#e2e8f0", marginBottom: "8px", textAlign: "center" }}>
            Add-ons & maintenance
          </h2>
          <p style={{ fontSize: "14px", color: "#475569", textAlign: "center", marginBottom: "32px" }}>
            Keep the automation healthy or top up with fresh content.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "16px" }}>
            {addons.map((a) => (
              <div key={a.name} style={{
                background: `${a.colour}08`,
                border: `1px solid ${a.colour}28`,
                borderRadius: "16px", padding: "24px",
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "28px", fontWeight: 900, color: "#fff" }}>{a.price}</span>
                  <span style={{ fontSize: "12px", color: "#475569" }}>{a.freq}</span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0", marginBottom: "8px" }}>{a.name}</div>
                <p style={{ fontSize: "12px", color: "#475569", lineHeight: 1.7, marginBottom: "16px" }}>{a.desc}</p>
                <BuyButton
                  variantId={a.variantId}
                  label={a.variantId ? `Buy ${a.name} →` : "Enquire →"}
                  fallbackHref={`mailto:hello@poweryourhouse.io?subject=${encodeURIComponent(a.name + " Enquiry")}`}
                  style={{
                    display: "block", textAlign: "center",
                    padding: "9px", borderRadius: "9px",
                    background: `${a.colour}18`,
                    border: `1px solid ${a.colour}35`,
                    color: a.colour, fontSize: "12px", fontWeight: 700,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginBottom: "72px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#e2e8f0", marginBottom: "32px", textAlign: "center" }}>
            Common questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {faqs.map((f) => (
              <div key={f.q} style={{
                background: "#0d1424", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "12px", padding: "20px 22px",
              }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#e2e8f0", marginBottom: "8px" }}>{f.q}</div>
                <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7 }}>{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <div style={{
          textAlign: "center",
          background: "linear-gradient(160deg, #0d1a2e, #0a1020)",
          border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: "24px", padding: "48px 32px",
        }}>
          <h2 style={{ fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 900, color: "#fff", marginBottom: "12px", letterSpacing: "-0.02em" }}>
            Ready to put your social media on autopilot?
          </h2>
          <p style={{ fontSize: "15px", color: "#475569", marginBottom: "28px", maxWidth: "460px", margin: "0 auto 28px", lineHeight: 1.7 }}>
            Email us with your Facebook Page and Instagram handle and we&apos;ll get back to you within 24 hours.
          </p>
          <a
            href="mailto:hello@poweryourhouse.io?subject=Social Media Automation Enquiry&body=Hi,%0A%0AI'd like to learn more about automating my social media.%0A%0ABusiness name: %0AFacebook Page: %0AInstagram handle: %0AProducts I sell: %0AWhich package interests you: %0A%0AThanks!"
            style={{
              display: "inline-block",
              padding: "16px 36px", borderRadius: "14px",
              background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
              color: "#fff", fontWeight: 800, fontSize: "16px",
              boxShadow: "0 6px 28px rgba(59,130,246,0.4)",
            }}
          >
            hello@poweryourhouse.io →
          </a>
          <p style={{ fontSize: "12px", color: "#334155", marginTop: "14px" }}>
            Typical response time: under 24 hours · No commitment required
          </p>
        </div>

        {/* ── Trust note ── */}
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <p style={{ fontSize: "13px", color: "#334155", lineHeight: 1.8 }}>
            Powered by the same AI colour-remaking technology as our{" "}
            <Link href="/generate" style={{ color: "#60a5fa" }}>SaaS tool</Link>
            {" "}· Posts published via the official Meta API
          </p>
        </div>

      </div>
    </div>
  );
}
