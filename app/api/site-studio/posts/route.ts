import { NextResponse } from "next/server";
import { isAdminAuthenticated, adminConfigured } from "@/lib/admin-auth";
import { rateLimit, clientIp, rateLimitedResponse } from "@/lib/rate-limit";
import { getAdminPosts, getAdminPostAny, type AdminPost } from "@/lib/admin-posts";
import { POSTS } from "@/app/blog/posts";
import { TOOLS } from "@/lib/site";

const OWNER = "pitafiyasir1-a11y";
const REPO = "yatools";
const BRANCH = "main";
const DIR = "data/admin-posts";

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_CONTENT_TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "yatools-admin",
  };
}

async function getFileSha(slug: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DIR}/${slug}.json?ref=${BRANCH}`,
    { headers: ghHeaders(), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const data = await res.json();
  return data.sha as string;
}

async function commitPost(post: AdminPost): Promise<string> {
  const token = process.env.GITHUB_CONTENT_TOKEN;
  if (!token) throw new Error("GITHUB_CONTENT_TOKEN is not configured on the server.");
  const sha = await getFileSha(post.slug);
  const body: Record<string, unknown> = {
    message: `${sha ? "Update" : "Publish"} blog post: ${post.slug}`,
    content: Buffer.from(JSON.stringify(post, null, 2), "utf-8").toString("base64"),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${DIR}/${post.slug}.json`,
    { method: "PUT", headers: ghHeaders(), body: JSON.stringify(body) }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub commit failed (${res.status}): ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.commit.sha as string;
}

function validatePost(p: Partial<AdminPost>): string | null {
  if (!p.slug || !/^[a-z0-9-]{3,80}$/.test(p.slug)) return "Slug must be 3-80 lowercase letters, numbers, or hyphens.";
  if (!p.title || p.title.length < 10 || p.title.length > 140) return "Title must be 10-140 characters.";
  if (!p.metaDescription || p.metaDescription.length < 50 || p.metaDescription.length > 320)
    return "Meta description must be 50-320 characters.";
  if (p.metaTitle && (p.metaTitle.length < 10 || p.metaTitle.length > 140)) return "Meta title must be 10-140 characters.";
  if (!p.excerpt || p.excerpt.length < 40) return "Excerpt must be at least 40 characters.";
  if (!p.date || !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) return "Date must be YYYY-MM-DD.";
  if (!Array.isArray(p.keywords) || p.keywords.length < 1 || p.keywords.length > 12)
    return "Add 1-12 keywords.";
  if (!p.contentMarkdown || p.contentMarkdown.length < 300)
    return "Content must be at least 300 characters of markdown.";
  if (!Array.isArray(p.faqs)) return "FAQs must be a list.";
  for (const f of p.faqs) {
    if (!f.q?.trim() || !f.a?.trim()) return "Every FAQ needs a question and an answer.";
  }
  const toolSlugs = new Set(TOOLS.map((t) => t.slug));
  if (!Array.isArray(p.relatedTools)) return "Related tools must be a list.";
  for (const s of p.relatedTools) {
    if (!toolSlugs.has(s)) return `Unknown tool slug: ${s}`;
  }
  if (p.status !== "published" && p.status !== "draft") return "Status must be published or draft.";
  return null;
}

export async function GET(req: Request) {
  const rl = rateLimit(`site-studio-posts:${clientIp(req)}`, 60, 10 * 60 * 1000);
  if (!rl.ok) return rateLimitedResponse(rl.retryAfterSec);
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const admin = getAdminPosts(false).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    status: p.status,
    managed: "admin" as const,
  }));
  const statics = POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    status: "published" as const,
    managed: "code" as const,
  }));
  return NextResponse.json({
    posts: [...admin, ...statics].sort((a, b) => (a.date < b.date ? 1 : -1)),
    configured: adminConfigured(),
    github: !!process.env.GITHUB_CONTENT_TOKEN,
  });
}

export async function POST(req: Request) {
  const rl = rateLimit(`site-studio-posts:${clientIp(req)}`, 30, 10 * 60 * 1000);
  if (!rl.ok) return rateLimitedResponse(rl.retryAfterSec);
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const post = (await req.json().catch(() => null)) as Partial<AdminPost> | null;
  if (!post) return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  const err = validatePost(post);
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const full: AdminPost = {
    slug: post.slug!,
    title: post.title!.trim(),
    metaTitle: post.metaTitle?.trim() || undefined,
    metaDescription: post.metaDescription!.trim(),
    keywords: post.keywords!.map((k) => k.trim()).filter(Boolean),
    excerpt: post.excerpt!.trim(),
    date: post.date!,
    tags: (post.tags || []).map((t) => t.trim()).filter(Boolean).slice(0, 6),
    faqs: post.faqs!.map((f) => ({ q: f.q.trim(), a: f.a.trim() })),
    contentMarkdown: post.contentMarkdown!,
    relatedTools: post.relatedTools!,
    status: post.status!,
    updatedAt: new Date().toISOString(),
  };

  try {
    const sha = await commitPost(full);
    return NextResponse.json({ ok: true, slug: full.slug, commit: sha.slice(0, 8) });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
