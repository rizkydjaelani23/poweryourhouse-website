import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block Cloudflare's email-obfuscation paths — they 404 when crawled
        // and pollute Search Console with "Not found" errors.
        disallow: ["/cdn-cgi/"],
      },
    ],
    sitemap: "https://poweryourhouse.io/sitemap.xml",
  };
}
