import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media Automation Service | Power Your House",
  description:
    "We set up and automate 30 days of Facebook & Instagram posts for your home decor or furniture business — AI-generated images, captions, hashtags, and scheduled posting. Done for you.",
};

const plans = [
  {
    name: "Starter",
    price: "£197",
    freq: "one-time",
    tagline: "Perfect for small shops getting started with social media.",
    posts: "30 posts",
    postsNote: "1 post / day",
    platforms: "Facebook + Instagram",
    features: [
      "30 AI-generated product images",
      "30 platform-specific captions + hashtags",
      "Facebook Page + Instagram Business connected",
      "Automated scheduling via Make.com",
      "All posts go live at optimal times",
      "Content calendar handed to you",
      "7 days post-launch support via email",
    ],
    highlight: false,
    cta: "Get Starter",
    badge: null,
  },
  {
    name: "Growth",
    price: "£297",
    freq: "one-time",
    tagline: "Double the presence. Twice daily posting keeps your brand front of mind.",
    posts: "60 posts",
    postsNote: "2 posts / day",
    platforms: "Facebook + Instagram",
    features: [
      "60 AI-generated product images",
      "60 captions — morning & afternoon batches",
      "Facebook Page + Instagram Business connected",
      "Automated scheduling via Make.com",
      "Morning (08:00) + afternoon (17:00) posting",
      "Content calendar + Google Sheet handed to you",
      "14 days post-launch support via email",
      "One free content refresh (swap images/captions)",
    ],
    highlight: true,
    cta: "Get Growth",
    badge: "Most Popular",
  },
];

const addons = [
  {
    name: "Monthly Maintenance",
    price: "£49",
    freq: "/ month",
    desc: "We monitor the automation, fix any broken connections (API keys, page permissions, tokens), and keep everything running. Ideal if you want peace of mind month to month.",
    colour: "#3b82f6",
  },
  {
    name: "One-Time Fix",
    price: "£79",
    freq: "flat fee",
    desc: "Something broke? We diagnose and fix any automation issue — broken Make.com scenario, expired tokens, disconnected accounts — one flat charge, no subscription needed.",
    colour: "#8b5cf6",
  },
  {
    name: "Content Refresh",
    price: "£97",
    freq: "one-time",
    desc: "New month, new content. We generate a fresh 30-day batch of AI images and captions for your feed. Swap out the old schedule and keep your audience engaged.",
    colour: "#10b981",
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
    body: "We write AI image prompts tailored to your products and craft captions with relevant hashtags for both platforms.",
  },
  {
    n: "03",
    title: "We connect and automate",
    body: "Your Facebook and Instagram accounts are linked via the Meta API. Make.com runs the scenario automatically at set times.",
  },
  {
    n: "04",
    title: "Posts go live — without you lifting a finger",
    body: "The automation fires every morning and afternoon for 30 days. You get the content calendar so you always know what's posting.",
  },
];

const thirdPartyCosts = [
  {
    platform: "Fal.ai",
    what: "AI image generation",
    free: "Free tier available (limited)",
    paid: "~$0.05 per image",
    example30: "1 post/day × 30 days = ~$1.50",
    example60: "2 posts/day × 30 days = ~$3.00",
    example90: "3 posts/day × 30 days = ~$4.50",
    signup: "https://fal.ai",
    colour: "#8b5cf6",
  },
  {
    platform: "Make.com",
    what: "Automation & scheduling",
    free: "Free plan: 1,000 ops/month",
    paid: "Core plan ~$9/month if exceeded",
    example30: "1 post/day ≈ 210 ops — free",
    example60: "2 posts/day ≈ 420 ops — free",
    example90: "3 posts/day ≈ 630 ops — free",
    signup: "https://make.com",
    colour: "#3b82f6",
  },
];

const faqs = [
  {
    q: "Do I need to give you my passwords?",
    a: "No. We connect through Facebook's official API. You authorise the connection from your own account — we never need your login credentials.",
  },
  {
    q: "Do I pay for Fal.ai and Make.com separately?",
    a: "Yes — those platform costs are yours to cover and are not included in our service fee. Fal.ai charges roughly $0.05 per AI-generated image, so a 30-day setup at 2 posts/day costs around $3 in image credits. Make.com's free plan covers up to 1,000 operations/month, which is enough for up to 3 posts/day without paying anything. We'll walk you through creating both accounts as part of the setup.",
  },
  {
    q: "What if I want more than 2 posts a day?",
    a: "No problem — we can set up any posting frequency. Just be aware that more posts means more Fal.ai image credits (still very cheap — 3/day for 30 days costs around $4.50). Make.com's free plan covers up to about 3 posts/day; if you want 4 or more, their Core plan is around $9/month.",
  },
  {
    q: "What types of products work best?",
    a: "Anything visual. Curtains, blinds, sofas, rugs, wall art, tiles, flooring, paint — any home decor or furniture product photographs well and shows colour variation clearly.",
  },
  {
    q: "Can you show products in different colours?",
    a: "Yes — that's our speciality. We use the same AI colour-remaking technology behind our SaaS tool to show your products in multiple colourways across the 30-day feed.",
  },
  {
    q: "What happens after 30 days?",
    a: "The automation stops automatically. You can order a Content Refresh add-on to queue another 30 days, or take over the Google Sheet yourself and queue new posts manually.",
  },
  {
    q: "How long does setup take?",
    a: "Typically 2–4 business days from the moment you send us your details and grant page access.",
  },
  {
    q: "What if something breaks mid-month?",
    a: "The Monthly Maintenance add-on covers you. Without it, a One-Time Fix (£79) gets everything back on track within 24 hours.",
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

        {/* ── What you'll need ── */}
        <div style={{ marginBottom: "72px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#e2e8f0", marginBottom: "8px", textAlign: "center" }}>
            What you&apos;ll need (outside our fee)
          </h2>
          <p style={{ fontSize: "14px", color: "#475569", textAlign: "center", marginBottom: "32px", lineHeight: 1.7 }}>
            The automation runs on two third-party platforms. You&apos;ll own your own accounts —
            we set them up as part of the service. Their costs are billed directly to you and are
            kept intentionally separate so you&apos;re never locked into us.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "16px", marginBottom: "20px" }}>
            {thirdPartyCosts.map((p) => (
              <div key={p.platform} style={{
                background: "#0d1424", border: `1px solid ${p.colour}22`,
                borderRadius: "16px", padding: "24px",
              }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: p.colour, flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#e2e8f0" }}>{p.platform}</div>
                    <div style={{ fontSize: "12px", color: "#475569" }}>{p.what}</div>
                  </div>
                  <a
                    href={p.signup}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: "auto", fontSize: "11px", fontWeight: 700,
                      padding: "4px 12px", borderRadius: "999px",
                      background: `${p.colour}15`,
                      border: `1px solid ${p.colour}35`,
                      color: p.colour,
                    }}
                  >
                    Sign up free →
                  </a>
                </div>

                {/* Cost rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                    <span style={{ color: "#475569" }}>Free tier</span>
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>{p.free}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                    <span style={{ color: "#475569" }}>Paid tier</span>
                    <span style={{ color: "#94a3b8", fontWeight: 600 }}>{p.paid}</span>
                  </div>
                </div>

                {/* Example costs */}
                <div style={{
                  background: "rgba(255,255,255,0.03)", borderRadius: "10px",
                  padding: "12px 14px",
                }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Estimated cost per 30 days
                  </div>
                  {[
                    { label: "1 post / day", val: p.example30 },
                    { label: "2 posts / day", val: p.example60 },
                    { label: "3 posts / day", val: p.example90 },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                      <span style={{ color: "#334155" }}>{row.label}</span>
                      <span style={{ color: "#64748b", fontWeight: 600 }}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: "14px 18px", borderRadius: "12px",
            background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)",
            fontSize: "13px", color: "#4ade80", fontWeight: 600, textAlign: "center",
          }}>
            For most businesses doing 2 posts/day, total third-party cost for 30 days is around{" "}
            <strong>$3 USD</strong> — less than a coffee.
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

                {/* Posts pill */}
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

                <a
                  href={`mailto:hello@poweryourhouse.io?subject=${encodeURIComponent(plan.name + " Social Media Automation")}&body=${encodeURIComponent("Hi,\n\nI'd like to get started with the " + plan.name + " package (" + plan.price + ").\n\nBusiness name: \nFacebook Page: \nInstagram handle: \nProducts I sell: \n\nThanks!")}`}
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
                >
                  {plan.cta} →
                </a>
              </div>
            ))}
          </div>
          {/* Third-party cost note */}
          <div style={{
            marginTop: "20px", padding: "16px 20px", borderRadius: "12px",
            background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)",
            display: "flex", gap: "12px", alignItems: "flex-start",
          }}>
            <span style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>⚠️</span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#fbbf24", marginBottom: "4px" }}>
                Platform credits are not included — and they&apos;re very cheap
              </div>
              <div style={{ fontSize: "12px", color: "#78716c", lineHeight: 1.7 }}>
                The service fee covers our time to build, write, connect and launch everything.
                Fal.ai (AI image generation) and Make.com (scheduling automation) are third-party
                platforms billed directly to you. At 2 posts/day, expect around{" "}
                <strong style={{ color: "#a8a29e" }}>$3 in Fal.ai image credits</strong> for the
                full 30 days, and <strong style={{ color: "#a8a29e" }}>$0 for Make.com</strong>{" "}
                (free plan covers up to ~3 posts/day). We help you set up both accounts.
              </div>
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#334155", textAlign: "center", marginTop: "12px" }}>
            All packages are delivered within 2–4 business days · Invoiced via email · PayPal or bank transfer accepted
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
                <a
                  href={`mailto:hello@poweryourhouse.io?subject=${encodeURIComponent(a.name + " Enquiry")}`}
                  style={{
                    display: "block", textAlign: "center",
                    padding: "9px", borderRadius: "9px",
                    background: `${a.colour}18`,
                    border: `1px solid ${a.colour}35`,
                    color: a.colour, fontSize: "12px", fontWeight: 700,
                  }}
                >
                  Enquire →
                </a>
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
            {" "}· Automation built on Make.com · Posts via Meta Graph API
          </p>
        </div>

      </div>
    </div>
  );
}
