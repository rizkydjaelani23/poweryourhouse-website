import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts, posts } from "../posts";

// Pre-build routes for ALL posts regardless of date so slugs are always valid.
// dynamicParams = true (default) means any slug not in the list is rendered
// on-demand at request time — so future posts just work when their date arrives.
export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://poweryourhouse.io/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://poweryourhouse.io/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
  };
}

const categoryColours: Record<string, { bg: string; text: string }> = {
  "Shopify Tips":       { bg: "#dbeafe", text: "#1e40af" },
  "Ecommerce Strategy": { bg: "#dcfce7", text: "#166534" },
  "Product Updates":    { bg: "#ede9fe", text: "#6d28d9" },
  "Case Studies":       { bg: "#fef9c3", text: "#854d0e" },
};

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const cat = categoryColours[post.category] ?? { bg: "#f3f4f6", text: "#374151" };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Power Your House", url: "https://poweryourhouse.io" },
    publisher: { "@type": "Organization", name: "Power Your House", url: "https://poweryourhouse.io" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://poweryourhouse.io/blog/${post.slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Header */}
      <section style={{
        background: "linear-gradient(160deg, #0d1424 0%, #111827 100%)",
        padding: "64px 0 52px",
        borderBottom: "1px solid rgba(59,130,246,0.1)",
      }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <Link href="/blog" style={{ fontSize: "13px", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>
            ← Back to blog
          </Link>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", margin: "16px 0 20px" }}>
            <span style={{
              fontSize: "11px", fontWeight: 700, padding: "2px 10px",
              borderRadius: "999px", background: cat.bg, color: cat.text,
            }}>{post.category}</span>
            <span style={{ fontSize: "12px", color: "#64748b" }}>
              {new Date(post.date + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
              {" · "}{post.readTime} min read
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
            {post.title}
          </h1>
          <p style={{ fontSize: "18px", color: "#94a3b8", lineHeight: 1.7, marginTop: "16px" }}>
            {post.description}
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "52px 0 72px" }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <div
            style={{ color: "#cbd5e1", lineHeight: 1.85, fontSize: "16px" }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div style={{
            marginTop: "56px",
            background: "linear-gradient(135deg, #1e3a5f, #1e1b4b)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: "20px",
            padding: "36px",
            textAlign: "center",
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>
              Ready to show every colour on your Shopify store?
            </h3>
            <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "24px" }}>
              Start a free trial — no developer or designer needed.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/pricing" className="btn-primary">Start Free Trial →</Link>
              <Link href="/contact" className="btn-ghost">Talk to Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
