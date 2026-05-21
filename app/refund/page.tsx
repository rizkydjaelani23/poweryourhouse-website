import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy – Power Your House",
  description: "Refund and cancellation policy for Power Your House subscriptions and credit packs.",
  alternates: { canonical: "https://poweryourhouse.io/refund" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "21 May 2025";
const EMAIL = "hello@poweryourhouse.io";

export default function RefundPage() {
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", padding: "64px 0 96px" }}>
      <div className="container" style={{ maxWidth: "760px" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{
            display: "inline-block", padding: "5px 14px", borderRadius: "999px",
            background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
            color: "#60a5fa", fontSize: "12px", fontWeight: 700, marginBottom: "20px",
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Legal
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,42px)", fontWeight: 800, color: "#fff", margin: "0 0 12px" }}>
            Refund Policy
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* TL;DR summary card */}
        <div style={{
          padding: "20px 24px", borderRadius: "14px", marginBottom: "48px",
          background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.2)",
        }}>
          <p style={{ margin: "0 0 6px", color: "#60a5fa", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Summary
          </p>
          <ul style={{ margin: 0, padding: "0 0 0 18px", color: "#94a3b8", lineHeight: 2, fontSize: "15px" }}>
            <li>Subscriptions can be <strong style={{ color: "#cbd5e1" }}>cancelled any time</strong> — no lock-in.</li>
            <li><strong style={{ color: "#cbd5e1" }}>14-day refund</strong> on subscriptions if you have not used the service.</li>
            <li>Credit packs are <strong style={{ color: "#cbd5e1" }}>non-refundable once consumed</strong>.</li>
            <li>Unused credit pack balance: refundable within 14 days of purchase.</li>
            <li>To request a refund email <a href={`mailto:${EMAIL}`} style={{ color: "#60a5fa" }}>{EMAIL}</a></li>
          </ul>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

          <Section title="1. Subscriptions">
            <P>You may cancel your subscription at any time from your account dashboard. Cancellation stops future renewals; you retain access to your plan features until the end of the current billing period.</P>

            <SubHeading>14-day refund window</SubHeading>
            <P>If you subscribe and have not generated any images or used any paid features, you may request a full refund within <strong style={{ color: "#cbd5e1" }}>14 days</strong> of your initial purchase date. This applies to first-time subscriptions only — renewal charges are non-refundable.</P>

            <SubHeading>After the 14-day window</SubHeading>
            <P>Once 14 days have passed, or once you have used the service (generated images, made API calls, or used any credit-consuming feature), subscription payments are non-refundable. We encourage you to use our free tier to evaluate the service before upgrading.</P>

            <SubHeading>Annual subscriptions</SubHeading>
            <P>Annual plans may be refunded on a pro-rata basis within 30 days of purchase if fewer than 10% of the included credits have been used. Contact us to request this.</P>
          </Section>

          <Section title="2. Credit Packs">
            <P>Credit packs are one-off purchases that add a fixed number of image generation credits to your account.</P>
            <P><strong style={{ color: "#cbd5e1" }}>Unused credits</strong> — if you have not used any credits from a pack, you may request a full refund within 14 days of purchase.</P>
            <P><strong style={{ color: "#cbd5e1" }}>Partially used packs</strong> — if some credits have been consumed, no refund is available for used credits. We may, at our discretion, offer a partial refund for the unused portion.</P>
            <P><strong style={{ color: "#cbd5e1" }}>Fully consumed packs</strong> — no refund is available once all credits in a pack have been used.</P>
          </Section>

          <Section title="3. Free Plan">
            <P>The free plan costs nothing. No payment is taken, so no refund is applicable.</P>
          </Section>

          <Section title="4. Exceptions">
            <P>Regardless of the above, we will always issue a full refund if:</P>
            <ul style={{ color: "#94a3b8", lineHeight: 1.9, paddingLeft: "20px", margin: 0 }}>
              <li>You were charged in error or charged twice for the same period.</li>
              <li>Our service was unavailable for more than 72 consecutive hours during your paid billing period.</li>
              <li>You are a consumer in the European Union or United Kingdom and your statutory rights entitle you to a refund.</li>
            </ul>
          </Section>

          <Section title="5. How to Request a Refund">
            <P>Email us at <a href={`mailto:${EMAIL}`} style={{ color: "#60a5fa" }}>{EMAIL}</a> with:</P>
            <ul style={{ color: "#94a3b8", lineHeight: 1.9, paddingLeft: "20px", margin: 0 }}>
              <li>The email address on your account</li>
              <li>The date of purchase</li>
              <li>The reason for your refund request</li>
            </ul>
            <P>We aim to respond within 2 business days. Approved refunds are processed by Paddle and typically appear in your account within 5–10 business days depending on your bank or card issuer.</P>
          </Section>

          <Section title="6. Disputes">
            <P>Payments are processed by Paddle.com, our Merchant of Record. If you dispute a charge with your bank or card issuer, please contact us first at <a href={`mailto:${EMAIL}`} style={{ color: "#60a5fa" }}>{EMAIL}</a> — we can almost always resolve issues faster than a formal dispute, and chargebacks may result in account suspension.</P>
          </Section>

          <Section title="7. Contact">
            <div style={{
              padding: "16px 20px", borderRadius: "12px",
              background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)",
            }}>
              <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", lineHeight: 1.7 }}>
                <strong style={{ color: "#cbd5e1" }}>Power Your House</strong><br />
                <a href={`mailto:${EMAIL}`} style={{ color: "#60a5fa" }}>{EMAIL}</a><br />
                poweryourhouse.io
              </p>
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{
        fontSize: "18px", fontWeight: 700, color: "#e2e8f0",
        margin: "0 0 14px", paddingBottom: "10px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {children}
      </div>
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "8px 0 0", color: "#cbd5e1", fontWeight: 700, fontSize: "15px" }}>
      {children}
    </p>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.8, fontSize: "15px" }}>
      {children}
    </p>
  );
}
