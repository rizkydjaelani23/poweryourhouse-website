import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Power Your House",
  description: "How Power Your House collects, uses, and protects your personal data.",
  alternates: { canonical: "https://poweryourhouse.io/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "21 May 2025";
const EMAIL = "hello@poweryourhouse.io";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

          <Section title="1. Who Controls Your Data">
            <P>Power Your House (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is the data controller for personal information collected through poweryourhouse.io and our software products.</P>
            <P>Contact us about privacy matters at: <a href={`mailto:${EMAIL}`} style={{ color: "#60a5fa" }}>{EMAIL}</a></P>
            <P>If you are in the European Union or United Kingdom, you have additional rights under GDPR / UK GDPR as described in Section 8.</P>
          </Section>

          <Section title="2. What We Collect and Why">
            <P>We only collect information that is necessary to provide and improve our services.</P>

            <SubHeading>Account information</SubHeading>
            <P>When you sign up we collect your <strong style={{ color: "#cbd5e1" }}>email address</strong> and, optionally, your name. This is used to create and manage your account, send you service-related messages (e.g. receipts, usage notifications), and — where you have given consent — marketing emails.</P>

            <SubHeading>Marketing consent</SubHeading>
            <P>During sign-up we ask separately whether you would like to receive marketing communications from us. This is strictly opt-in. You can withdraw consent at any time by clicking &ldquo;Unsubscribe&rdquo; in any email or by emailing us.</P>

            <SubHeading>Images you upload</SubHeading>
            <P>When you use our image recoloring tools, the photos you upload are transmitted securely to our AI processing infrastructure (fal.ai) to generate your output image. Your input images and generated outputs are stored in Cloudflare R2 object storage, associated with your account, so you can access them in your history. You can delete your images at any time from your account dashboard.</P>

            <SubHeading>Usage data</SubHeading>
            <P>We collect anonymised usage data (pages visited, features used, generation counts) through <strong style={{ color: "#cbd5e1" }}>Umami Analytics</strong> — a privacy-respecting, cookie-free analytics tool. This data contains no personally identifiable information and is used solely to understand how our product is used and improve it.</P>

            <SubHeading>Payment information</SubHeading>
            <P>We do not store your payment card details. All payments are processed by <strong style={{ color: "#cbd5e1" }}>Paddle.com</strong>, who are our Merchant of Record. Paddle&rsquo;s own privacy policy applies to payment data: <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>paddle.com/legal/privacy</a>. We receive from Paddle your email, billing country, and transaction history for account management purposes.</P>

            <SubHeading>Shopify stores (app merchants)</SubHeading>
            <P>If you install our Shopify app, we receive your Shopify shop domain, product data (titles, images, IDs), and access tokens required to operate the app. This data is stored securely and used only to provide the app&rsquo;s functionality.</P>
          </Section>

          <Section title="3. Legal Basis for Processing (GDPR)">
            <P>Where GDPR or UK GDPR applies, we process your data under the following lawful bases:</P>
            <ul style={{ color: "#94a3b8", lineHeight: 1.9, paddingLeft: "20px", margin: 0 }}>
              <li><strong style={{ color: "#cbd5e1" }}>Contract</strong> — to provide the service you signed up for (account, image generation, billing).</li>
              <li><strong style={{ color: "#cbd5e1" }}>Consent</strong> — for marketing emails (opt-in only, withdrawable at any time).</li>
              <li><strong style={{ color: "#cbd5e1" }}>Legitimate interests</strong> — for anonymised analytics to improve our product, and for fraud prevention.</li>
              <li><strong style={{ color: "#cbd5e1" }}>Legal obligation</strong> — to comply with applicable law (e.g. retaining transaction records).</li>
            </ul>
          </Section>

          <Section title="4. Who We Share Your Data With">
            <P>We do not sell your personal data. We share it only with the following trusted service providers to operate our business:</P>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "12px", textTransform: "uppercase" }}>Provider</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: "12px", textTransform: "uppercase" }}>Purpose</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Paddle.com", "Payment processing, subscriptions, tax compliance"],
                  ["fal.ai", "AI image generation (images processed, not stored)"],
                  ["Cloudflare R2", "Image and file storage"],
                  ["Railway.app", "Application hosting and database"],
                  ["Umami Analytics", "Anonymous usage analytics (no cookies, no PII)"],
                  ["Resend", "Transactional and marketing email delivery"],
                ].map(([provider, purpose], i) => (
                  <tr key={provider} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                    <td style={{ padding: "10px 12px", color: "#cbd5e1", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{provider}</td>
                    <td style={{ padding: "10px 12px", color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="5. Cookies">
            <P>Our website does <strong style={{ color: "#cbd5e1" }}>not use tracking or advertising cookies</strong>. The only analytics we run is Umami, which is cookie-free and does not identify individual users.</P>
            <P>Essential session cookies may be set by your browser when you are logged into your account. These are strictly necessary for the service to function and do not track you across other websites.</P>
          </Section>

          <Section title="6. Data Retention">
            <P>We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or accounting purposes (typically up to 7 years for financial records).</P>
            <P>Uploaded and generated images are retained until you delete them or close your account.</P>
          </Section>

          <Section title="7. International Transfers">
            <P>Our services are operated globally. Your data may be processed in countries outside your own, including Indonesia, the United States, and the European Union. Where data is transferred outside the UK or EU, we rely on appropriate safeguards (Standard Contractual Clauses, adequacy decisions, or equivalent mechanisms) as required by applicable law.</P>
          </Section>

          <Section title="8. Your Rights">
            <P>Depending on your location, you may have the following rights regarding your personal data:</P>
            <ul style={{ color: "#94a3b8", lineHeight: 1.9, paddingLeft: "20px", margin: 0 }}>
              <li><strong style={{ color: "#cbd5e1" }}>Access</strong> — request a copy of the data we hold about you.</li>
              <li><strong style={{ color: "#cbd5e1" }}>Correction</strong> — ask us to correct inaccurate data.</li>
              <li><strong style={{ color: "#cbd5e1" }}>Erasure</strong> — request deletion of your data (&ldquo;right to be forgotten&rdquo;).</li>
              <li><strong style={{ color: "#cbd5e1" }}>Portability</strong> — receive your data in a machine-readable format.</li>
              <li><strong style={{ color: "#cbd5e1" }}>Object</strong> — object to processing based on legitimate interests.</li>
              <li><strong style={{ color: "#cbd5e1" }}>Withdraw consent</strong> — for marketing emails, at any time.</li>
              <li><strong style={{ color: "#cbd5e1" }}>Restrict processing</strong> — in certain circumstances.</li>
            </ul>
            <P>To exercise any of these rights, email us at <a href={`mailto:${EMAIL}`} style={{ color: "#60a5fa" }}>{EMAIL}</a>. We will respond within 30 days.</P>
            <P>If you are in the EU, you also have the right to lodge a complaint with your local data protection authority.</P>
          </Section>

          <Section title="9. Children">
            <P>Our services are not directed at children under 18. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.</P>
          </Section>

          <Section title="10. Changes to This Policy">
            <P>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on our website. The &ldquo;Last updated&rdquo; date at the top of this page indicates when the policy was last revised.</P>
          </Section>

          <Section title="11. Contact">
            <P>For any privacy-related questions or requests:</P>
            <div style={{
              marginTop: "8px", padding: "16px 20px", borderRadius: "12px",
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
