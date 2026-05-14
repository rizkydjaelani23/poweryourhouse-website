import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permanently redirect www → non-www so Google treats https://poweryourhouse.io
  // as the single canonical origin and doesn't split crawl credit between the two.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.poweryourhouse.io" }],
        destination: "https://poweryourhouse.io/:path*",
        permanent: true, // 301
      },
    ];
  },
};

export default nextConfig;
