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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Power Your House" style={{ width: "34px", height: "34px", objectFit: "contain" }} />
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
              <Link href="/shopify-app-furniture-stores" style={{ fontSize: "14px", color: "#94a3b8" }}>For Furniture Stores</Link>
              <Link href="/blog" style={{ fontSize: "14px", color: "#94a3b8" }}>Blog</Link>
              <Link href="/pricing" style={{ fontSize: "14px", color: "#94a3b8" }}>Pricing</Link>
              <Link href="/about" style={{ fontSize: "14px", color: "#94a3b8" }}>About</Link>
              <Link href="/contact" style={{ fontSize: "14px", color: "#94a3b8" }}>Contact</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "14px" }}>
              Legal
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/terms" style={{ fontSize: "14px", color: "#94a3b8" }}>Terms of Service</Link>
              <Link href="/privacy" style={{ fontSize: "14px", color: "#94a3b8" }}>Privacy Policy</Link>
              <Link href="/refund" style={{ fontSize: "14px", color: "#94a3b8" }}>Refund Policy</Link>
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
            {/* Social links */}
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <a
                href="https://www.instagram.com/poweryourhouse2/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)",
                  color: "#fff", fontSize: "16px",
                  flexShrink: 0,
                }}
                title="Instagram"
              >
                📷
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61590558021861"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "#1877f2",
                  color: "#fff", fontSize: "16px",
                  flexShrink: 0,
                }}
                title="Facebook"
              >
                f
              </a>
            </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: "#475569" }}>Built with ⚡ in Australia</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <a
                href="https://www.instagram.com/poweryourhouse2/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  fontSize: "13px", color: "#64748b",
                  transition: "color 0.15s",
                }}
              >
                Instagram
              </a>
              <span style={{ color: "#334155" }}>·</span>
              <a
                href="https://www.facebook.com/profile.php?id=61590558021861"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  fontSize: "13px", color: "#64748b",
                  transition: "color 0.15s",
                }}
              >
                Facebook
              </a>
            </div>
            <a
              href="https://www.producthunt.com/products/poweryourhouse?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-poweryourhouse"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="PowerYourHouse on Product Hunt"
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1149922&theme=dark&t=1779113381616"
                width={160}
                height={35}
                style={{ display: "block" }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
