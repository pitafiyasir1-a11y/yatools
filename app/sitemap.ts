import type { MetadataRoute } from "next";
import { SITE, TOOLS, USE_CASES } from "@/lib/site";

type Freq = "weekly";

const DEVELOPER_SUBPAGES = ["rate-limits", "errors", "changelog"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1.0 },
    ...TOOLS.map((t) => ({ path: `/tools/${t.slug}`, priority: 0.9 })),
    ...USE_CASES.map((u) => ({ path: `/use-cases/${u.slug}`, priority: 0.7 })),
    { path: "/ur", priority: 0.7 },
    { path: "/use-cases", priority: 0.7 },
    { path: "/developers", priority: 0.7 },
    ...DEVELOPER_SUBPAGES.map((s) => ({ path: `/developers/${s}`, priority: 0.7 })),
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
    { path: "/privacy", priority: 0.7 },
    { path: "/terms", priority: 0.7 },
  ];

  return routes.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: now,
    changeFrequency: "weekly" as Freq,
    priority: r.priority,
  }));
}
