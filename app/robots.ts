import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The private blog-studio is unlinked and password-gated; keep every
        // crawler (and its index) away from it, current and legacy paths.
        disallow: ["/api/", "/site-studio/", "/api/site-studio/", "/admin/", "/api/admin/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
