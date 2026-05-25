import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudflare R2 public bucket
      { protocol: "https", hostname: "pub-0089c5e2f40a4a6ba94d804256694d44.r2.dev" },
      // Supabase storage (if used)
      { protocol: "https", hostname: "ovljmraoxetrkuarvcrj.supabase.co" },
      // fal.ai generated image CDN
      { protocol: "https", hostname: "**.fal.run" },
      { protocol: "https", hostname: "**.fal.media" },
    ],
  },

  // 301 redirect www → non-www so Google only indexes one canonical version
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.poweryourhouse.io" }],
        destination: "https://poweryourhouse.io/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
