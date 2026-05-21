import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Study: How Everest Beds Cut Returns by 34% with AI Colour Previews",
  description:
    "Learn how Everest Beds used Power Your House to show 60+ fabric colours online, reduce returns by 34%, and increase average order value — without a single extra photoshoot.",
  alternates: { canonical: "https://poweryourhouse.io/case-study-everest-beds" },
  openGraph: {
    title: "Case Study: Everest Beds Cut Returns 34% with AI Colour Previews",
    description:
      "How a UK bed retailer replaced expensive photoshoots with AI-generated colour previews — and saw a measurable drop in returns.",
    url: "https://poweryourhouse.io/case-study-everest-beds",
    type: "article",
  },
};

function StatCard({ value, label, color = "#818cf8" }: { value: string; label: string; color?: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "24px 20px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "42px", fontWeight: 900, color, lineHeight: 1, marginBottom: "8px" }}>
        {value}
      </div>
      <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>{label}</div>
    </div>
  );
}

export default function CaseStudyEverestBeds() {
  return (
    <>
      {/* Article schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "How Everest Beds Cut Returns by 34% with AI Colour Previews",
            description:
              "A UK bed retailer replaced expensive photoshoots with Power Your House AI colour previews, reducing returns, increasing conversions and saving thousands in photography costs.",
            author: { "@type": "Organization", name: "Power Your House" },
            publisher: {
              "@type": "Organization",
              name: "Power Your House",
              url: "https://poweryourhouse.io",
            },
            datePublished: "2025-03-01",
            dateModified: "2025-05-01",
            url: "https://poweryourhouse.io/case-study-everest-beds",
          }),
        }}
      />

      {/* Hero */}
      <section style={{
        padding: "72px 0 56px",
        background: "linear-gradient(180deg, #0d1424 0%, #080d1a 100%)",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
      }}>
        <div className="container" style={{ maxWidth: "820px" }}>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            <span className="badge section-eyebrow">📖 Case Study</span>
            <span style={{
              display: "inline-block",
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#10b981",
              padding: "4px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 700,
            }}>
              Furniture Retail · UK
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(26px, 4.5vw, 44px)",
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "20px",
          }}>
            How Everest Beds cut returns by 34% and saved £18,000 in photoshoot costs
          </h1>

          <p style={{
            fontSize: "17px",
            color: "#94a3b8",
            lineHeight: 1.75,
            marginBottom: "32px",
            maxWidth: "680px",
          }}>
            A UK bed retailer with 60+ fabric options couldn&apos;t afford to photograph every combination.
            They turned to AI colour previews — and the results changed how they think about product pages entirely.
          </p>

          {/* Key stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "16px",
          }}>
            <StatCard value="34%" label="Reduction in returns" color="#10b981" />
            <StatCard value="£18k" label="Photography costs saved per year" color="#818cf8" />
            <StatCard value="60+" label="Fabric colours now shown online" color="#60a5fa" />
            <StatCard value="22%" label="Increase in average order value" color="#f59e0b" />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section">
        <div className="container" style={{ maxWidth: "720px" }}>

          {/* The problem */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
              padding: "4px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 800,
              marginBottom: "18px",
              letterSpacing: "0.04em",
            }}>
              THE PROBLEM
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "16px", lineHeight: 1.3 }}>
              60 fabric options. Zero way to show them all.
            </h2>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.8, marginBottom: "16px" }}>
              Everest Beds sells upholstered beds in over 60 fabric and colour combinations — from deep navy velvet to oatmeal bouclé. Their product range was genuinely impressive. But their online store told a different story: one hero image per bed, no colour options shown.
            </p>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.8, marginBottom: "16px" }}>
              Photographing every fabric combination properly costs between £200 and £500 per shot — studio time, props, a photographer. Multiply that across 60 colours and 12 bed frames and you&apos;re looking at a six-figure photography budget just to show what you stock.
            </p>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.8 }}>
              Instead, customers had to imagine what the bed would look like in their chosen fabric. Most couldn&apos;t. They either didn&apos;t buy — or they bought and returned it when the real colour didn&apos;t match their mental image. Returns were running at over 18% on fabric-dependent orders.
            </p>
          </div>

          {/* Pull quote */}
          <blockquote style={{
            background: "linear-gradient(135deg, rgba(79,70,229,0.08), rgba(59,130,246,0.05))",
            border: "1px solid rgba(79,70,229,0.2)",
            borderLeft: "4px solid #4f46e5",
            borderRadius: "0 14px 14px 0",
            padding: "24px 28px",
            margin: "0 0 48px",
          }}>
            <p style={{ fontSize: "17px", color: "#e8efff", lineHeight: 1.7, fontStyle: "italic", marginBottom: "12px" }}>
              &ldquo;We knew the returns were coming from customers who couldn&apos;t visualise the fabric. But the cost to fix it with photography was just impossible for a business our size.&rdquo;
            </p>
            <cite style={{ fontSize: "13px", color: "#64748b", fontStyle: "normal", fontWeight: 700 }}>
              — Operations Manager, Everest Beds
            </cite>
          </blockquote>

          {/* The solution */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(79,70,229,0.12)",
              border: "1px solid rgba(79,70,229,0.3)",
              color: "#818cf8",
              padding: "4px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 800,
              marginBottom: "18px",
              letterSpacing: "0.04em",
            }}>
              THE SOLUTION
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "16px", lineHeight: 1.3 }}>
              AI previews for every fabric, in hours — not weeks
            </h2>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.8, marginBottom: "16px" }}>
              Everest Beds installed Power Your House and set up their first product in under an hour. They defined the upholstered zone on their hero bed image, uploaded swatch photos of their 60 fabrics, and let the AI generate the previews.
            </p>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.8, marginBottom: "16px" }}>
              Within two days they had approved previews for their entire fabric range across three of their most popular bed frames — around 180 images total. Previews that would have cost tens of thousands in photoshoot fees were generated for a fraction of the cost of a single Pro subscription.
            </p>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.8 }}>
              They added the gallery widget to their Shopify theme in minutes. No developer. No code. Customers could now click through every fabric option and see a realistic colour preview of the bed they were about to buy.
            </p>
          </div>

          {/* How they set it up */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "28px",
            marginBottom: "48px",
          }}>
            <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: 700, marginBottom: "18px", letterSpacing: "0.04em" }}>
              HOW THEY SET IT UP
            </div>
            {[
              { step: "1", title: "Zone setup", desc: "Defined the headboard and bed frame as separate zones on their hero product image" },
              { step: "2", title: "Swatch upload", desc: "Uploaded 60 physical fabric swatches photographed on a neutral background" },
              { step: "3", title: "Bulk generation", desc: "Used the Pro bulk generation feature to queue all 60 swatches across 3 products simultaneously" },
              { step: "4", title: "Review & approve", desc: "Reviewed all 180 previews, approved 164, hid 16 where the swatch lighting didn't match" },
              { step: "5", title: "Gallery goes live", desc: "Added the gallery app block in the Shopify theme editor — live in under 10 minutes" },
            ].map((item) => (
              <div key={item.step} style={{
                display: "flex",
                gap: "16px",
                marginBottom: "20px",
                alignItems: "flex-start",
              }}>
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "1px",
                }}>
                  {item.step}
                </div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#e8efff", marginBottom: "3px" }}>{item.title}</div>
                  <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Results */}
          <div style={{ marginBottom: "48px" }}>
            <div style={{
              display: "inline-block",
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
              color: "#10b981",
              padding: "4px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 800,
              marginBottom: "18px",
              letterSpacing: "0.04em",
            }}>
              THE RESULTS
            </div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", marginBottom: "16px", lineHeight: 1.3 }}>
              Returns fell. AOV climbed. Photography budget freed up.
            </h2>

            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.8, marginBottom: "16px" }}>
              Within 60 days of going live with the colour gallery, Everest Beds saw fabric-related returns drop by 34%. The reason was simple: customers now knew exactly what they were buying. The gap between expectation and reality — the primary cause of returns — had been closed.
            </p>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.8, marginBottom: "16px" }}>
              Average order value increased by 22%. Customers who engaged with the colour gallery were more likely to choose a premium fabric option they might have previously skipped because they couldn&apos;t visualise it. Seeing a realistic preview of &lsquo;Sage Bouclé&rsquo; on the actual bed made the upgrade feel tangible.
            </p>
            <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.8 }}>
              They also added the SEO Engine add-on three months in. Within six weeks, pages for terms like &ldquo;navy velvet bed frame UK&rdquo; and &ldquo;plush grey upholstered bed&rdquo; began appearing in Google results for the first time. Organic traffic to product pages increased by 41% over six months.
            </p>
          </div>

          {/* Second quote */}
          <blockquote style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02))",
            border: "1px solid rgba(16,185,129,0.2)",
            borderLeft: "4px solid #10b981",
            borderRadius: "0 14px 14px 0",
            padding: "24px 28px",
            margin: "0 0 56px",
          }}>
            <p style={{ fontSize: "17px", color: "#e8efff", lineHeight: 1.7, fontStyle: "italic", marginBottom: "12px" }}>
              &ldquo;We&apos;ve effectively given every product a 60-image gallery without paying for a single photoshoot.
              The app paid for itself in the first month from returns savings alone.&rdquo;
            </p>
            <cite style={{ fontSize: "13px", color: "#64748b", fontStyle: "normal", fontWeight: 700 }}>
              — Operations Manager, Everest Beds
            </cite>
          </blockquote>

          {/* By the numbers */}
          <div style={{
            background: "linear-gradient(160deg, #0d1f16, #111827)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "20px",
            padding: "36px",
            marginBottom: "48px",
          }}>
            <div style={{ fontSize: "13px", color: "#6b7280", fontWeight: 700, marginBottom: "24px", letterSpacing: "0.04em" }}>
              BY THE NUMBERS — 6 MONTHS POST-LAUNCH
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "20px",
            }}>
              {[
                { v: "−34%", l: "Fabric returns", c: "#10b981" },
                { v: "+22%", l: "Average order value", c: "#10b981" },
                { v: "+41%", l: "Organic product page traffic", c: "#60a5fa" },
                { v: "164", l: "Approved colour previews", c: "#818cf8" },
                { v: "£18k", l: "Annual photography savings", c: "#f59e0b" },
                { v: "2 days", l: "Time to full gallery launch", c: "#94a3b8" },
              ].map((s) => (
                <div key={s.l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "28px", fontWeight: 900, color: s.c, lineHeight: 1, marginBottom: "6px" }}>{s.v}</div>
                  <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{
            background: "linear-gradient(160deg, #131c2e, #111827)",
            border: "1px solid rgba(79,70,229,0.25)",
            borderRadius: "20px",
            padding: "36px",
            textAlign: "center",
          }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "10px" }}>
              Ready to show every colour you stock?
            </h2>
            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "28px", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 28px" }}>
              Start with 50 free colour previews across 3 products. No credit card. No photoshoot.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://apps.shopify.com/image-colour-remake"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ textDecoration: "none" }}
              >
                Start Free →
              </a>
              <Link href="/pricing" style={{
                padding: "12px 24px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#cbd5e1",
                fontSize: "14px",
                fontWeight: 700,
                textDecoration: "none",
              }}>
                View Pricing →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
