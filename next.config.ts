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
};

export default nextConfig;
