import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        position: "relative",
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "linear-gradient(160deg, #080d1a 0%, #0d1830 60%, #080d1a 100%)",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(59,130,246,0.07) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
        {/* Blue radial glow */}
        <div style={{
          position: "absolute", top: "-20%", right: "-10%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "0%", left: "-10%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1, padding: "80px 24px" }}>
          <div className="badge" style={{ marginBottom: "24px" }}>
            ⚡ Smart software for Shopify merchants
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 6vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            color: "#fff",
            maxWidth: "820px",
            marginBottom: "24px",
          }}>
            Power Your Store
            <br />
            <span style={{ background: "linear-gradient(90deg, #60a5fa, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              With Better Software
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(17px, 2vw, 20px)",
            color: "#94a3b8",
            maxWidth: "560px",
            lineHeight: 1.7,
            marginBottom: "40px",
          }}>
            We build focused, merchant-first apps that make your Shopify store stand out. From colour visualisation to marketing intelligence — tools that actually move the needle.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <a
              href="https://apps.shopify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Browse Our Apps →
            </a>
            <Link href="/pricing" className="btn-ghost">
              See Pricing
            </Link>
          </div>

          {/* Trust bar */}
          <div style={{
            marginTop: "60px",
            display: "flex",
            gap: "32px",
            flexWrap: "wrap",
          }}>
            {[
              { label: "Shopify Merchants", value: "Growing" },
              { label: "Apps Built", value: "3+" },
              { label: "Support Response", value: "< 24h" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#60a5fa" }}>{s.value}</div>
                <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured App ── */}
      <section className="section" style={{ background: "#0d1424" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div className="badge section-eyebrow">🎨 Featured App</div>
            <h2 className="section-title" style={{ margin: "14px auto 0", maxWidth: "580px" }}>
              Image Colour Remake
            </h2>
            <p className="section-sub" style={{ margin: "14px auto 0" }}>
              Let your customers visualise your products in every colour before they buy.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}>
            {[
              {
                icon: "🖼️",
                title: "AI Colour Visualiser",
                desc: "Upload product images and generate realistic colour variants using our AI masking engine. No Photoshop needed.",
                color: "#3b82f6",
              },
              {
                icon: "🧵",
                title: "Swatch Library",
                desc: "Organise fabric swatches and colour families. Customers pick from real, accurate colour options rather than guessing.",
                color: "#4f46e5",
              },
              {
                icon: "🛍️",
                title: "Storefront Gallery",
                desc: "Embed a beautiful colour gallery directly on your product page. Works with any Shopify theme.",
                color: "#06b6d4",
              },
              {
                icon: "✅",
                title: "Approval Workflow",
                desc: "Preview, review, and approve colour images before they go live on your store. Full control, zero surprises.",
                color: "#8b5cf6",
              },
            ].map((f) => (
              <div key={f.title} style={{
                background: "#111827",
                border: "1px solid rgba(59,130,246,0.12)",
                borderRadius: "18px",
                padding: "28px",
                transition: "border-color 0.2s, transform 0.2s",
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px",
                  background: `${f.color}22`,
                  border: `1px solid ${f.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px", marginBottom: "16px",
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <a
              href="https://apps.shopify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Install on Shopify →
            </a>
          </div>
        </div>
      </section>

      {/* ── Coming Soon Apps ── */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: "48px" }}>
            <div className="badge section-eyebrow">🚀 What's coming</div>
            <h2 className="section-title" style={{ marginTop: "14px" }}>More tools on the way</h2>
            <p className="section-sub">
              We're building a full suite of merchant tools. Here's what's next.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}>
            {[
              {
                icon: "📊",
                title: "Marketing Tracker",
                desc: "Track ROI across all your ad spend — Facebook, Google, TikTok — in one clean dashboard. Know exactly which campaigns pay off.",
                eta: "Coming 2025",
                color: "#f59e0b",
              },
              {
                icon: "💬",
                title: "Customer Service App",
                desc: "Turn support tickets into a competitive advantage. Smart response templates, order lookup, and one-click resolutions.",
                eta: "Coming 2025",
                color: "#10b981",
              },
            ].map((app) => (
              <div key={app.title} style={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "18px",
                padding: "32px",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: "20px", right: "20px",
                  background: `${app.color}22`,
                  border: `1px solid ${app.color}44`,
                  color: app.color,
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "11px",
                  fontWeight: 700,
                }}>
                  {app.eta}
                </div>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: `${app.color}18`,
                  border: `1px solid ${app.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px", marginBottom: "18px",
                }}>
                  {app.icon}
                </div>
                <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>
                  {app.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>
                  {app.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: "linear-gradient(135deg, #0d1830 0%, #111827 100%)",
        borderTop: "1px solid rgba(59,130,246,0.12)",
        borderBottom: "1px solid rgba(59,130,246,0.12)",
        padding: "80px 0",
        textAlign: "center",
      }}>
        <div className="container">
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#fff", marginBottom: "16px" }}>
            Ready to power your store?
          </h2>
          <p style={{ fontSize: "18px", color: "#94a3b8", marginBottom: "36px" }}>
            Start with Image Colour Remake today — free to install on Shopify.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://apps.shopify.com" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Get Started Free →
            </a>
            <Link href="/contact" className="btn-ghost">Talk to Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
