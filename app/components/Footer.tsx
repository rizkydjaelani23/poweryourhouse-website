import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid rgba(59, 130, 246, 0.12)",
      background: "#0d1424",
      padding: "56px 0 32px",
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "40px",
          marginBottom: "48px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "9px",
                background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px",
              }}>⚡</div>
              <span style={{ fontSize: "15px", fontWeight: 800, color: "#fff" }}>Power Your House</span>
            </div>
            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.7, maxWidth: "220px" }}>
              Building smart software tools for e-commerce merchants.
            </p>
          </div>

          {/* Products */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
              Products
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="https://apps.shopify.com/image-colour-remake" target="_blank" rel="noopener noreferrer" style={{ fontSize: "14px", color: "#94a3b8" }}>
                Image Colour Remake
              </a>
              <span style={{ fontSize: "14px", color: "#475569" }}>Marketing Tracker <span style={{ fontSize: "11px", color: "#3b82f6" }}>Soon</span></span>
              <span style={{ fontSize: "14px", color: "#475569" }}>Customer Service App <span style={{ fontSize: "11px", color: "#3b82f6" }}>Soon</span></span>
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
              Company
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/about" style={{ fontSize: "14px", color: "#94a3b8" }}>About</Link>
              <Link href="/pricing" style={{ fontSize: "14px", color: "#94a3b8" }}>Pricing</Link>
              <Link href="/contact" style={{ fontSize: "14px", color: "#94a3b8" }}>Contact</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
              Get in Touch
            </div>
            <a href="mailto:hello@poweryourhouse.io" style={{ fontSize: "14px", color: "#60a5fa" }}>
              hello@poweryourhouse.io
            </a>
            <p style={{ marginTop: "10px", fontSize: "13px", color: "#64748b" }}>
              We reply within 24 hours.
            </p>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <p style={{ fontSize: "13px", color: "#475569" }}>
            © {new Date().getFullYear()} Power Your House. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <span style={{ fontSize: "13px", color: "#475569" }}>Built with ⚡ in Australia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
