import fs from "node:fs";
import path from "node:path";

/* ============ Admin-managed blog posts (created via /admin or automation) ============
   Stored as JSON in data/admin-posts/<slug>.json and committed to git.
   The dynamic route app/blog/[slug] renders them with the full SEO template.
   Server-only: uses node:fs. Never import from client components. */

export interface AdminFaq {
  q: string;
  a: string;
}

export interface AdminPost {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription: string;
  keywords: string[];
  excerpt: string;
  date: string; // ISO yyyy-mm-dd
  tags: string[];
  faqs: AdminFaq[];
  contentMarkdown: string;
  relatedTools: string[]; // tool slugs
  status: "published" | "draft";
  updatedAt?: string;
}

const DIR = path.join(process.cwd(), "data", "admin-posts");

function readPostFile(file: string): AdminPost | null {
  try {
    const raw = fs.readFileSync(path.join(DIR, file), "utf-8");
    const post = JSON.parse(raw) as AdminPost;
    if (!post.slug || !post.title || !post.contentMarkdown) return null;
    if (!/^[a-z0-9-]+$/.test(post.slug)) return null;
    return post;
  } catch {
    return null;
  }
}

/** All admin posts, newest first. Set publishedOnly=false to include drafts (admin use). */
export function getAdminPosts(publishedOnly = true): AdminPost[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  const posts = files
    .map(readPostFile)
    .filter((p): p is AdminPost => p !== null)
    .filter((p) => !publishedOnly || p.status === "published");
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export function getAdminPost(slug: string): AdminPost | null {
  const post = readPostFile(`${slug}.json`);
  if (!post || post.status !== "published") return null;
  return post;
}

/** Raw read including drafts (admin panel use). */
export function getAdminPostAny(slug: string): AdminPost | null {
  return readPostFile(`${slug}.json`);
}

export function adminPostDateLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function adminPostReadTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).length;
  const mins = Math.max(2, Math.round(words / 200));
  return `${mins} min read`;
}
