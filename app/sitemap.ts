import type { MetadataRoute } from "next";
import { SITE, TOOLS, USE_CASES } from "@/lib/site";
import { POSTS } from "@/app/blog/posts";
import { getAdminPosts } from "@/lib/admin-posts";

type Freq = "weekly";

const DEVELOPER_SUBPAGES = ["rate-limits", "errors", "changelog"];

// NOTE (2026-10-22 indexing fix): previously EVERY route used
// `lastModified: new Date()` — the build time. That made all 122 <lastmod>
// values identical and reset them on every deploy, which teaches Google to
// ignore our lastmod entirely. Now only pages with a real content date
// (blog posts) carry a lastmod; static routes omit it, which is valid and
// honest. Do not reintroduce a blanket `now`.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; lastModified?: Date }[] = [
    { path: "/", priority: 1.0 },
    ...TOOLS.map((t) => ({ path: `/tools/${t.slug}`, priority: 0.9 })),
    ...USE_CASES.map((u) => ({ path: `/use-cases/${u.slug}`, priority: 0.7 })),
    { path: "/use-cases", priority: 0.7 },
    { path: "/developers", priority: 0.7 },
    ...DEVELOPER_SUBPAGES.map((s) => ({ path: `/developers/${s}`, priority: 0.7 })),
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
    { path: "/privacy", priority: 0.7 },
    { path: "/terms", priority: 0.7 },
    { path: "/blog", priority: 0.8 },
    { path: "/pdf-tools", priority: 0.8 },
    { path: "/image-tools", priority: 0.8 },
    { path: "/video-tools", priority: 0.8 },
    { path: "/audio-tools", priority: 0.8 },
    { path: "/developer-tools", priority: 0.8 },
    ...POSTS.map((p) => ({
      path: `/blog/${p.slug}`,
      priority: 0.7,
      lastModified: new Date(p.date),
    })),
    ...getAdminPosts(true).map((p) => ({
      path: `/blog/${p.slug}`,
      priority: 0.7,
      lastModified: new Date(p.updatedAt ?? p.date),
    })),
  ];

  return routes.map((r) => ({
    url: `${SITE.url}${r.path}`,
    ...(r.lastModified ? { lastModified: r.lastModified } : {}),
    changeFrequency: "weekly" as Freq,
    priority: r.priority,
  }));
}
