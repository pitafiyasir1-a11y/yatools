import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep API routes out of the index. The private studio is NOT listed
        // here on purpose — advertising its path in robots.txt would defeat
        // the point. It's protected instead by noindex headers (next.config),
        // no links, no sitemap entry, and password auth.
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
