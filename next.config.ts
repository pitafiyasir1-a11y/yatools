import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No remote image optimization needed; binaries stream through our own routes.
  async redirects() {
    return [
      // The Urdu version of the site was removed (2026-10-06); keep no dead ends.
      { source: "/ur", destination: "/", permanent: true },
      { source: "/ur/:path*", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Block MIME-type sniffing attacks.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // This site is never meant to be iframed by third parties.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Don't leak full URLs to other sites on navigation.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // The private blog studio: never index it, but don't advertise its
        // path in robots.txt either. Unlinked + password-gated + noindex.
        source: "/site-studio/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/site-studio/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
