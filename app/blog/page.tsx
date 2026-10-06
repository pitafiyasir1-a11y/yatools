import Link from "next/link";
import { SITE, pageMeta, breadcrumbJsonLd } from "@/lib/site";
import { JsonLd } from "../tools/tool-parts";
import Breadcrumbs from "@/components/Breadcrumbs";
import { POSTS, blogJsonLd, type BlogPostMeta } from "./posts";
import { getAdminPosts, adminPostDateLabel, adminPostReadTime } from "@/lib/admin-posts";

export const metadata = pageMeta({
  title: "YATools Blog — Free Tool Guides & How-Tos",
  description:
    "Practical how-to guides for YATools' free online tools: merge PDFs, compress images, make QR codes, remove backgrounds, and more.",
  path: "/blog",
  keywords: [
    "yatools blog",
    "free online tools guides",
    "how to merge pdf",
    "compress images guide",
    "qr code tutorial",
  ],
});

/** All posts: static guides + admin/automation posts, newest first. */
function allPosts(): BlogPostMeta[] {
  const admin: BlogPostMeta[] = getAdminPosts(true).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    dateLabel: adminPostDateLabel(p.date),
    readTime: adminPostReadTime(p.contentMarkdown),
    tags: p.tags,
  }));
  const merged = [...POSTS, ...admin];
  merged.sort((a, b) => (a.date < b.date ? 1 : -1));
  return merged;
}

export default function BlogIndex() {
  return (
    <>
      <JsonLd data={blogJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]}
        />

        <p className="eyebrow">
          <span className="dot" aria-hidden="true" />
          Guides & tutorials
        </p>
        <h1 className="hero-title" style={{ margin: "14px 0" }}>
          YATools <em>Blog</em>
        </h1>
        <p className="sec-sub" style={{ fontSize: "1.08rem", maxWidth: 700 }}>
          Short, practical how-to guides for the free tools on this site. No fluff, no
          filler — every guide walks you through a real task, step by step, and links
          straight to the tool that does it.
        </p>

        <div className="tool-grid" style={{ marginTop: 32 }}>
          {allPosts().map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card card-hover"
              style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {post.tags.map((tag) => (
                  <span key={tag} className="badge badge-green">
                    {tag}
                  </span>
                ))}
              </div>
              <h2
                className="font-display"
                style={{ fontSize: "1.55rem", lineHeight: 1.05, marginBottom: 10 }}
              >
                {post.title}
              </h2>
              <p
                style={{
                  color: "var(--text2)",
                  fontSize: "0.94rem",
                  lineHeight: 1.65,
                  marginBottom: 16,
                  flexGrow: 1,
                }}
              >
                {post.excerpt}
              </p>
              <div
                className="font-mono2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.72rem",
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                <span>
                  {post.dateLabel} · {post.readTime}
                </span>
                <span style={{ color: "var(--red-dark)", fontWeight: 600 }}>Read →</span>
              </div>
            </Link>
          ))}
        </div>

        <div
          className="card"
          style={{
            marginTop: 40,
            padding: "clamp(20px, 4vw, 32px)",
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <p className="sec-label">All tools</p>
            <h2 className="sec-title" style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)" }}>
              Want to skip the <em>reading?</em>
            </h2>
            <p className="sec-sub">
              {SITE.name} has 36 free tools — screenshots, PDFs, audio, images, QR codes
              and more. No sign-up, no watermarks.
            </p>
          </div>
          <Link href="/" className="btn btn-primary">
            Browse all tools →
          </Link>
        </div>
      </div>
    </>
  );
}
