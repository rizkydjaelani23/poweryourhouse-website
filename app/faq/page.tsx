import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ – Power Your House | Shopify Colour Preview App",
  description:
    "Answers to the most common questions about Power Your House — the Shopify app that generates AI colour previews for furniture stores. Setup, billing, themes and more.",
  alternates: { canonical: "https://poweryourhouse.io/faq" },
  openGraph: {
    title: "FAQ – Power Your House",
    description:
      "Everything you need to know about the Power Your House Shopify app — colour previews, pricing, theme compatibility, SEO Engine and more.",
    url: "https://poweryourhouse.io/faq",
    type: "website",
  },
};

const faqs = [
  {
    category: "Getting Started",
    items: [
      {
        q: "What is Power Your House?",
        a: "Power Your House is a Shopify app that lets furniture stores show customers how a product looks in different fabric colours — without doing a photoshoot. You upload a swatch image, our AI composites it onto your product photo, and the result appears in a gallery on your product page.",
      },
      {
        q: "Who is this app for?",
        a: "The app is built for Shopify furniture retailers — sofas, beds, armchairs, dining chairs, ottomans. If you sell upholstered furniture in multiple fabric or colour options, this app is for you. It works especially well for stores with large fabric catalogues where photographing every combination isn't practical.",
      },
      {
        q: "How does the AI colour preview work?",
        a: "You define a zone on your product photo (the upholstered area), then upload a swatch image of any fabric or colour. Our AI replaces that zone with the swatch texture while preserving the original product shape, lighting and shadows. The result looks like a real product photo.",
      },
      {
        q: "Do I need to know how to code?",
        a: "No coding required. The storefront gallery widget installs directly from the Shopify theme editor — just add the app block and it appears on your product pages automatically.",
      },
      {
        q: "How long does it take to set up?",
        a: "Most merchants are up and running within 30 minutes. Define your zones, upload a few swatches, approve the previews, and add the gallery to your theme. Full setup guide is available in the app.",
      },
    ],
  },
  {
    category: "Pricing & Plans",
    items: [
      {
        q: "Is there a free plan?",
        a: "Yes. The Free plan gives you 50 colour previews across up to 3 products, plus the full storefront gallery widget. No credit card required — install from the Shopify App Store and start generating previews immediately.",
      },
      {
        q: "What does the Pro plan include?",
        a: "Pro is $29.99/month and gives you unlimited colour preview generation, unlimited products, all fabric families (Plush, Velvet, Suede, Venice and more), bulk generation for multiple swatches at once, a preview manager with search and filters, and a recent swatch library. A free trial is included.",
      },
      {
        q: "What is the SEO Engine add-on?",
        a: "The SEO Engine ($14.99/month) automatically generates optimised meta titles, descriptions, and image alt text for every product and colour preview using your real fabric and colour data. It also adds structured schema markup for Google rich results. It works on Free or Pro.",
      },
      {
        q: "Is Pro + SEO Engine worth it?",
        a: "If you're on Pro and want SEO automation, the Pro + SEO Engine bundle at $44.99/month saves you $0.98/month vs buying separately. More importantly, the combination of AI previews and SEO automation is the fastest way to rank for colour-specific search terms like 'grey velvet corner sofa'.",
      },
      {
        q: "Can I cancel at any time?",
        a: "Yes. Cancel directly from your Shopify admin. Billing is handled entirely through Shopify — no hidden fees, no lock-in contracts.",
      },
      {
        q: "Do you offer refunds?",
        a: "If you're not satisfied within the first 7 days of a paid plan, contact us at hello@poweryourhouse.io and we'll make it right.",
      },
    ],
  },
  {
    category: "Colour Previews",
    items: [
      {
        q: "What counts as a colour preview?",
        a: "A preview is one AI-generated image for one product. Generating a 'Plush Mink' preview for your Hampstead Sofa uses one preview credit. Approving, hiding, featuring, or deleting a preview does not affect your count.",
      },
      {
        q: "What fabric families are supported?",
        a: "On the Pro plan, all fabric families are available: Plush, Velvet, Suede, Venice, Bouclé, Chenille and more. Free plan includes the core fabric families. We regularly add new fabric types based on merchant feedback.",
      },
      {
        q: "How accurate are the AI previews?",
        a: "Accuracy depends on the swatch image quality and how distinct the upholstered zone is in your product photo. Most merchants find the previews are accurate enough to show customers colour options confidently. You can approve or hide any preview before it appears on your storefront.",
      },
      {
        q: "Can I control which previews show on my storefront?",
        a: "Yes. Every generated preview starts in Draft status. You review it and either Approve it (appears in the gallery), mark it Featured (shown first), or Hide it. Nothing appears on your storefront until you approve it.",
      },
      {
        q: "Can I generate previews for multiple zones on one product?",
        a: "Yes. You can define multiple zones on a product — for example, the seat fabric and the leg colour as separate zones. Each zone is managed independently.",
      },
    ],
  },
  {
    category: "Storefront & Themes",
    items: [
      {
        q: "Which Shopify themes does the gallery work with?",
        a: "The gallery widget works with any Shopify 2.0 theme — Dawn, Impulse, Prestige, Symmetry, Expanse, and custom themes. You add it from the theme editor as an app block. No coding required.",
      },
      {
        q: "How does the storefront gallery look?",
        a: "The gallery appears on your product page as a collapsible section with colour family tabs and a thumbnail grid. Customers click a thumbnail to preview that colour. The widget is fully responsive and looks clean on mobile and desktop. You can customise the accent colour to match your brand.",
      },
      {
        q: "Can customers add a specific colour to their cart from the gallery?",
        a: "The gallery is a visual preview tool — it shows customers how the product looks in different colours. To add a specific colour to cart, customers select the matching product variant as normal. Many merchants name their variants to match the fabric families in the app.",
      },
      {
        q: "Does the gallery slow down my product page?",
        a: "No. The gallery loads asynchronously and images are lazy-loaded. It has no measurable impact on page speed scores.",
      },
    ],
  },
  {
    category: "SEO Engine",
    items: [
      {
        q: "How does the SEO Engine generate content?",
        a: "It uses your product title, fabric family, and colour name to generate meta titles, descriptions and alt text tailored to colour-specific search queries — the terms shoppers actually type into Google when they know what fabric or colour they want.",
      },
      {
        q: "Will the SEO Engine overwrite my existing meta data?",
        a: "The SEO Engine writes to Shopify's product meta fields using the app's own namespace, so it doesn't overwrite anything you've written manually in the Shopify product editor. You stay in control.",
      },
      {
        q: "How long until I see results from SEO?",
        a: "SEO takes time. Most merchants see initial ranking movement within 6–12 weeks of consistent use. The structured schema markup often helps Google pick up rich results faster than plain text SEO.",
      },
      {
        q: "Does the SEO Engine work with Google Search Console?",
        a: "The app integrates with Google Search Console so you can see clicks and impressions for your colour-specific pages directly inside the Power Your House dashboard, without switching tabs.",
      },
    ],
  },
  {
    category: "Support",
    items: [
      {
        q: "How do I get support?",
        a: "Email us at hello@poweryourhouse.io or use the contact form on our website. Pro plan merchants get priority support with faster response times. We typically respond within 24 hours on business days.",
      },
      {
        q: "Is there documentation or a setup guide?",
        a: "Yes. A full setup guide is available inside the app once you install it from the Shopify App Store. It walks you through zone setup, swatch upload, preview approval and gallery installation step by step.",
      },
      {
        q: "Do you offer onboarding help for new merchants?",
        a: "For Pro plan merchants, we offer a complimentary onboarding call to walk through zone setup for your specific products and answer any questions. Reach out after installing and we'll get something booked.",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.flatMap((cat) =>
    cat.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header */}
      <section style={{
        padding: "72px 0 56px",
        textAlign: "center",
        background: "linear-gradient(180deg, #0d1424 0%, #080d1a 100%)",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
      }}>
        <div className="container">
          <div className="badge section-eyebrow">❓ FAQ</div>
          <h1 className="section-title" style={{ margin: "14px auto 0", maxWidth: "640px" }}>
            Frequently Asked Questions
          </h1>
          <p className="section-sub" style={{ margin: "14px auto 0", maxWidth: "520px" }}>
            Everything you need to know about Power Your House — colour previews, pricing, themes, and SEO.
          </p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="section">
        <div className="container" style={{ maxWidth: "780px" }}>
          {faqs.map((section) => (
            <div key={section.category} style={{ marginBottom: "56px" }}>
              {/* Category heading */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(79,70,229,0.12)",
                border: "1px solid rgba(79,70,229,0.3)",
                color: "#818cf8",
                padding: "5px 14px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 800,
                marginBottom: "24px",
                letterSpacing: "0.04em",
              }}>
                {section.category.toUpperCase()}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                {section.items.map((item, i) => (
                  <div key={i} style={{
                    borderTop: i === 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    padding: "22px 0",
                  }}>
                    <h2 style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: "#e8efff",
                      marginBottom: "10px",
                      lineHeight: 1.4,
                    }}>
                      {item.q}
                    </h2>
                    <p style={{
                      fontSize: "14px",
                      color: "#94a3b8",
                      lineHeight: 1.75,
                      margin: 0,
                    }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div style={{
            background: "linear-gradient(160deg, #131c2e, #111827)",
            border: "1px solid rgba(79,70,229,0.25)",
            borderRadius: "20px",
            padding: "36px",
            textAlign: "center",
            marginTop: "16px",
          }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "10px" }}>
              Still have a question?
            </h2>
            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "24px", lineHeight: 1.7 }}>
              We&apos;re happy to help. Email us or use the contact form and we&apos;ll get back to you within 24 hours.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/contact" className="btn-primary">
                Contact Us →
              </Link>
              <a
                href="https://apps.shopify.com/image-colour-remake"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#cbd5e1",
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Install Free →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
