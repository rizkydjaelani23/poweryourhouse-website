import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – Power Your House",
  description: "Terms of Service for Power Your House software products and services.",
  alternates: { canonical: "https://poweryourhouse.io/terms" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "21 May 2025";
const EMAIL = "hello@poweryourhouse.io";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

          <Section title="1. Who We Are">
            <P>Power Your House (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website poweryourhouse.io and provides software services including the Image Colour Remake Shopify app and AI-powered image recoloring tools.</P>
            <P>Payments are processed by <strong style={{ color: "#94a3b8" }}>Paddle.com</strong> (Paddle Payments Limited, 15 W 18th St, New York, NY 10011, USA), who act as our Merchant of Record. When you purchase a subscription or credit pack, your contract for payment is with Paddle.</P>
            <P>For any questions about these terms, contact us at <a href={`mailto:${EMAIL}`} style={{ color: "#60a5fa" }}>{EMAIL}</a>.</P>
          </Section>

          <Section title="2. Services">
            <P>We provide:</P>
            <ul style={{ color: "#94a3b8", lineHeight: 1.9, paddingLeft: "20px", margin: 0 }}>
              <li><strong style={{ color: "#cbd5e1" }}>Image Colour Remake</strong> — a Shopify app that generates AI colour-variant preview images for furniture and upholstery product listings.</li>
              <li><strong style={{ color: "#cbd5e1" }}>AI Image Recoloring</strong> — a standalone web tool allowing anyone to upload a product or room photo and generate realistic colour variations using AI.</li>
            </ul>
            <P>We reserve the right to modify, suspend, or discontinue any part of our services at any time with reasonable notice.</P>
          </Section>

          <Section title="3. Accounts">
            <P>To use our services you must create an account with a valid email address. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.</P>
            <P>You must be at least 18 years old to create an account. By creating an account you confirm you meet this requirement.</P>
            <P>We reserve the right to suspend or terminate accounts that violate these terms.</P>
          </Section>

          <Section title="4. Subscriptions and Credits">
            <P><strong style={{ color: "#cbd5e1" }}>Free tier:</strong> New accounts receive a limited number of complimentary image generations at no cost. Free credits are non-transferable and may be adjusted at our discretion.</P>
            <P><strong style={{ color: "#cbd5e1" }}>Subscriptions:</strong> Paid plans are billed monthly or annually in advance. Your subscription renews automatically until cancelled. You may cancel at any time through your account dashboard; cancellation takes effect at the end of the current billing period.</P>
            <P><strong style={{ color: "#cbd5e1" }}>Credit packs:</strong> One-off credit purchases are added to your account immediately and do not expire. Unused credits are non-refundable once purchased except as set out in our Refund Policy.</P>
            <P>All pricing is displayed in US Dollars (USD) unless otherwise stated. Paddle handles currency conversion and local tax (VAT/GST) where applicable.</P>
          </Section>

          <Section title="5. Acceptable Use">
            <P>You agree not to use our services to:</P>
            <ul style={{ color: "#94a3b8", lineHeight: 1.9, paddingLeft: "20px", margin: 0 }}>
              <li>Generate, distribute, or store any content that is illegal, harmful, defamatory, or infringes any third-party intellectual property rights.</li>
              <li>Upload images you do not have rights to process.</li>
              <li>Attempt to reverse-engineer, scrape, or abuse our API or infrastructure.</li>
              <li>Resell or sublicense access to our services without written permission.</li>
              <li>Use automated tools to generate images at a scale intended to circumvent credit limits.</li>
              <li>Engage in any activity that disrupts or degrades our services.</li>
            </ul>
            <P>Violation of these terms may result in immediate account suspension without refund.</P>
          </Section>

          <Section title="6. Intellectual Property">
            <P><strong style={{ color: "#cbd5e1" }}>Your content:</strong> You retain ownership of any images you upload. By uploading, you grant us a limited, non-exclusive licence to process those images solely to provide the service.</P>
            <P><strong style={{ color: "#cbd5e1" }}>Generated images:</strong> Output images generated from your inputs are yours to use for commercial and personal purposes. We make no claim to ownership of your generated images.</P>
            <P><strong style={{ color: "#cbd5e1" }}>Our platform:</strong> The Power Your House software, design, code, branding, and technology remain our exclusive property. Nothing in these terms grants you a right to our intellectual property beyond what is needed to use the service.</P>
          </Section>

          <Section title="7. Image Processing and AI">
            <P>Our service uses third-party AI infrastructure (including fal.ai) to process images. Input images are transmitted securely to these providers solely for the purpose of generating your requested output and are not stored by those providers beyond what is technically required to complete the request.</P>
            <P>AI-generated images may occasionally produce imperfect results. We do not guarantee that generated images will accurately represent real-world colours, textures, or physical appearance of products. Generated images are intended as visualisation aids only.</P>
          </Section>

          <Section title="8. Limitation of Liability">
            <P>To the fullest extent permitted by law, Power Your House shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or business interruption, arising from your use of or inability to use our services.</P>
            <P>Our total liability to you for any claim shall not exceed the amount you paid to us in the 12 months preceding the claim.</P>
          </Section>

          <Section title="9. Disclaimer of Warranties">
            <P>Our services are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.</P>
            <P>We do not warrant that the service will be uninterrupted, error-free, or free of harmful components.</P>
          </Section>

          <Section title="10. Termination">
            <P>You may delete your account at any time. We may suspend or terminate your account if you breach these terms, with or without notice depending on the severity of the breach.</P>
            <P>Upon termination, your right to use the service ceases immediately. We may retain certain data as required by law or legitimate business purposes as described in our Privacy Policy.</P>
          </Section>

          <Section title="11. Changes to These Terms">
            <P>We may update these terms from time to time. We will notify you of material changes by email or by displaying a notice on our website. Continued use of our services after changes take effect constitutes acceptance of the revised terms.</P>
          </Section>

          <Section title="12. Governing Law">
            <P>These terms are governed by the laws of the Republic of Indonesia. Any disputes that cannot be resolved amicably shall be subject to the jurisdiction of the courts of Indonesia.</P>
            <P>If you are a consumer in the European Union or United Kingdom, nothing in these terms affects your statutory rights under applicable consumer protection law.</P>
          </Section>

          <Section title="13. Contact">
            <P>For questions about these Terms of Service, please contact us at:</P>
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

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: 0, color: "#94a3b8", lineHeight: 1.8, fontSize: "15px" }}>
      {children}
    </p>
  );
}
