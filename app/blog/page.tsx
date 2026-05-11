import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "./posts";

export const metadata: Metadata = {
  title: "Blog – Shopify Tips for Furniture & Home Goods Merchants",
  description: "Practical guides, tips and strategies for furniture and home goods merchants selling on Shopify. Colour visualisation, ecommerce growth, reducing returns and more.",
  alternates: { canonical: "https://poweryourhouse.io/blog" },
  openGraph: {
    title: "Blog – Power Your House",
    description: "Practical guides for furniture merchants on Shopify.",
    url: "https://poweryourhouse.io/blog",
    type: "website",
  },
};

const categoryColours: Record<string, { bg: string; text: string }> = {
  "Shopify Tips":       { bg: "#dbeafe", text: "#1e40af" },
  "Ecommerce Strategy": { bg: "#dcfce7", text: "#166534" },
  "Product Updates":    { bg: "#ede9fe", text: "#6d28d9" },
  "Case Studies":       { bg: "#fef9c3", text: "#854d0e" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Header */}
      <section style={{
        background: "linear-gradient(160deg, #0d1424 0%, #111827 100%)",
        padding: "72px 0 56px",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
      }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <div className="badge section-eyebrow">📝 Blog</div>
          <h1 className="section-title" style={{ marginTop: "14px" }}>
            Shopify tips for furniture merchants
          </h1>
          <p style={{ fontSize: "18px", color: "#94a3b8", lineHeight: 1.7, marginTop: "16px" }}>
            Practical guides on colour visualisation, ecommerce growth, reducing returns and running a better furniture store on Shopify.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="section">
        <div className="container" style={{ maxWidth: "720px" }}>
          {posts.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "48px 0" }}>No posts yet — check back soon.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {posts.map((post) => {
                const cat = categoryColours[post.category] ?? { bg: "#f3f4f6", text: "#374151" };
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <article style={{
                      background: "#111827",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "18px",
                      padding: "28px 32px",
                      transition: "border-color 0.2s, transform 0.2s",
                    }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.3)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      }}
                    >
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{
                          fontSize: "11px", fontWeight: 700, padding: "2px 10px",
                          borderRadius: "999px", background: cat.bg, color: cat.text,
                        }}>{post.category}</span>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          {new Date(post.date + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                          {" · "}{post.readTime} min read
                        </span>
                      </div>
                      <h2 style={{ fontSize: "19px", fontWeight: 700, color: "#fff", marginBottom: "10px", lineHeight: 1.4 }}>
                        {post.title}
                      </h2>
                      <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, marginBottom: "16px" }}>
                        {post.description}
                      </p>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#3b82f6" }}>
                        Read article →
                      </span>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
