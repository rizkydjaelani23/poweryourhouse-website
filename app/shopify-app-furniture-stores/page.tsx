import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best Shopify App for Furniture Stores – AI Colour Visualiser",
  description:
    "The #1 Shopify app for furniture and upholstery stores. Show beds, sofas, armchairs and ottomans in every fabric colour with AI — no photoshoots. Used by furniture merchants in Australia, UK, USA and worldwide.",
  alternates: { canonical: "https://poweryourhouse.io/shopify-app-furniture-stores" },
  keywords: [
    "best shopify app for furniture stores",
    "furniture shopify app",
    "bed colour visualiser shopify",
    "sofa fabric colour preview",
    "upholstery colour shopify",
    "shopify app for bed shops",
    "furniture ecommerce shopify tool",
    "fabric swatch visualiser shopify",
    "armchair colour options shopify",
    "shopify furniture store app",
    "AI furniture colour changer",
    "online furniture colour preview",
  ],
  openGraph: {
    title: "Best Shopify App for Furniture Stores – AI Colour Visualiser",
    description:
      "Show beds, sofas and upholstered furniture in every fabric colour on your Shopify store. No photoshoots, no designer needed. $29.99/month.",
    url: "https://poweryourhouse.io/shopify-app-furniture-stores",
    type: "website",
  },
};

const products = [
  { icon: "🛏", name: "Beds & Bed Frames", desc: "Show every headboard colour — plush, velvet, wool, suede and more. Customers pick their fabric before they buy." },
  { icon: "🛋", name: "Sofas & Couches", desc: "Let customers visualise the exact sofa colour in their living room. Reduce returns from colour mismatches." },
  { icon: "🪑", name: "Armchairs & Accent Chairs", desc: "Showcase every fabric option without reshooting. Upload one photo, generate unlimited colour variants." },
  { icon: "🛏", name: "Ottomans & Footstools", desc: "Small items, big colour decisions. Show customers exactly what they'll receive before checkout." },
  { icon: "🪞", name: "Bedheads & Headboards", desc: "Detailed tufting and button work preserved in every colour preview. Pixel-accurate fabric replacement." },
  { icon: "🏠", name: "Any Upholstered Product", desc: "Works with any fabric product in your Shopify store — not just furniture." },
];

const steps = [
  { n: "1", title: "Upload your product photo", desc: "Use your existing product photography — no reshoot needed." },
  { n: "2", title: "Upload your fabric swatches", desc: "Add as many fabric colours and families as you stock." },
  { n: "3", title: "AI generates the previews", desc: "The app replaces the fabric colour in seconds, preserving all product detail." },
  { n: "4", title: "Approve and publish", desc: "Review each preview and publish to your Shopify store with one click." },
];

const faqs = [
  { q: "Does it work for all types of fabric?", a: "Yes — plush, velvet, suede, wool, crushed velvet, mink and more. Each fabric family is rendered differently so the texture looks accurate." },
  { q: "Will the headboard stitching and tufting lines still show?", a: "Yes. The AI preserves the product's existing detail — lines, buttons, tufting and stitching all remain visible in the colour preview." },
  { q: "Do I need a designer or developer?", a: "No. The app installs from the Shopify App Store and the gallery widget adds directly to your theme editor. No code needed." },
  { q: "How many colours can I add per product?", a: "Unlimited. Stores typically add 20–90 colour options per product." },
  { q: "Does it work outside Australia?", a: "Yes — merchants in the UK, USA, Canada, New Zealand and Europe all use it. The app works on any Shopify store worldwide." },
  { q: "What themes does the gallery work with?", a: "Any Shopify 2.0 theme. Dawn, Debut, Brooklyn, Narrative and all major paid themes are supported." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FurnitureLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section style={{
        background: "linear-gradient(160deg, #0d1424 0%, #111827 100%)",
        padding: "80px 0 72px",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
      }}>
        <div className="container" style={{ maxWidth: "760px", textAlign: "center" }}>
          <div className="badge section-eyebrow">🛋️ For Furniture Stores</div>
          <h1 className="section-title" style={{ marginTop: "14px" }}>
            The Shopify app built for furniture and upholstery stores
          </h1>
          <p style={{ fontSize: "20px", color: "#94a3b8", lineHeight: 1.7, margin: "20px auto 0", maxWidth: "600px" }}>
            Show beds, sofas, armchairs and upholstered products in every fabric colour — without reshooting a single photo. Used by furniture merchants across Australia, UK, USA and worldwide.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginTop: "36px" }}>
            <Link href="/pricing" className="btn-primary">Start Free Trial →</Link>
            <Link href="/" className="btn-ghost">See How It Works</Link>
          </div>
        </div>
      </section>

      {/* Product types */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="badge section-eyebrow">🏠 Product types</div>
            <h2 className="section-title" style={{ marginTop: "14px" }}>Works with every upholstered product</h2>
            <p className="section-sub" style={{ margin: "14px auto 0" }}>
              If it comes in different fabric colours, this app handles it.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {products.map((p) => (
              <div key={p.name} style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "18px",
                padding: "28px",
              }}>
                <div style={{ fontSize: "32px", marginBottom: "14px" }}>{p.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{p.name}</h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section" style={{ background: "#0d1424" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="badge section-eyebrow">⚙️ How it works</div>
            <h2 className="section-title" style={{ marginTop: "14px" }}>Live on your store in under an hour</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", maxWidth: "900px", margin: "0 auto" }}>
            {steps.map((s) => (
              <div key={s.n} style={{ textAlign: "center" }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", fontWeight: 800, color: "#fff",
                  margin: "0 auto 16px",
                }}>{s.n}</div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global reach */}
      <section className="section">
        <div className="container" style={{ maxWidth: "720px", textAlign: "center" }}>
          <div className="badge section-eyebrow">🌏 Worldwide</div>
          <h2 className="section-title" style={{ marginTop: "14px" }}>Used by furniture merchants globally</h2>
          <p style={{ fontSize: "16px", color: "#94a3b8", lineHeight: 1.8, marginTop: "20px" }}>
            Whether you're selling beds in Sydney, sofas in London, armchairs in New York or ottomans in Toronto — the app works on any Shopify store, in any country, with any currency. Customers browse and select their fabric colour before checkout, reducing returns and boosting conversion.
          </p>
          <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", marginTop: "36px" }}>
            {["🇦🇺 Australia", "🇬🇧 United Kingdom", "🇺🇸 United States", "🇨🇦 Canada", "🇳🇿 New Zealand", "🇪🇺 Europe"].map((c) => (
              <span key={c} style={{ fontSize: "15px", color: "#e2e8f0", fontWeight: 600 }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ background: "#0d1424" }}>
        <div className="container" style={{ maxWidth: "680px" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div className="badge section-eyebrow">❓ FAQ</div>
            <h2 className="section-title" style={{ marginTop: "14px" }}>Common questions from furniture merchants</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {faqs.map((f) => (
              <div key={f.q} style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "14px",
                padding: "20px 24px",
              }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>{f.q}</h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "72px 0", textAlign: "center", background: "linear-gradient(135deg, #080d1a 0%, #111827 100%)" }}>
        <div className="container">
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", marginBottom: "12px" }}>
            Ready to show every colour option?
          </h2>
          <p style={{ fontSize: "16px", color: "#94a3b8", marginBottom: "32px" }}>
            Install from the Shopify App Store. Free trial included. No designer or developer needed.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/pricing" className="btn-primary">Start Free Trial →</Link>
            <Link href="/contact" className="btn-ghost">Talk to Us First</Link>
          </div>
        </div>
      </section>
    </>
  );
}
