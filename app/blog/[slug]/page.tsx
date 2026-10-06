import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { SITE, pageMeta, faqJsonLd, breadcrumbJsonLd } from "@/lib/site";
import {
  getAdminPost,
  getAdminPosts,
  adminPostDateLabel,
  adminPostReadTime,
  type AdminPost,
} from "@/lib/admin-posts";
import { JsonLd, FaqList, RelatedTools, SectionHead } from "../../tools/tool-parts";
import { POSTS, articleJsonLd } from "../posts";
import Breadcrumbs from "@/components/Breadcrumbs";

/* Dynamic route for admin/automation-created posts.
   Static post folders (app/blog/<slug>/) take precedence over this route.
   Only published admin slugs are generated. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAdminPosts(true).map((p) => ({ slug: p.slug }));
}

function toMeta(post: AdminPost): Parameters<typeof articleJsonLd>[0] {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    dateLabel: adminPostDateLabel(post.date),
    readTime: adminPostReadTime(post.contentMarkdown),
    tags: post.tags,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getAdminPost(slug);
  if (!post) return {};
  return pageMeta({
    title: post.metaTitle || post.title,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
  });
}

/** Render markdown to HTML. Content comes from the site owner / automation (trusted),
    but we still strip script tags and javascript: URLs as defense in depth. */
function renderMarkdown(md: string): string {
  let html = marked.parse(md, { async: false }) as string;
  html = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  html = html.replace(/\s+on\w+="[^"]*"/gi, "");
  html = html.replace(/href="javascript:[^"]*"/gi, 'href="#"');
  return html;
}

export default async function AdminBlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getAdminPost(slug);
  if (!post) notFound();

  const meta = toMeta(post);
  const dateLabel = adminPostDateLabel(post.date);
  const readTime = adminPostReadTime(post.contentMarkdown);
  const html = renderMarkdown(post.contentMarkdown);

  const relatedPosts = [...POSTS.map((p) => ({ slug: p.slug, title: p.title })), ...getAdminPosts(true).filter((p) => p.slug !== post.slug).map((p) => ({ slug: p.slug, title: p.title }))].slice(0, 3);

  return (
    <>
      <JsonLd data={articleJsonLd(meta, post.metaDescription)} />
      {post.faqs.length > 0 && <JsonLd data={faqJsonLd(post.faqs)} />}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
        />

        <p className="eyebrow">
          <span className="dot" aria-hidden="true" />
          {post.tags[0] || "Guides"}
        </p>
        <h1 className="hero-title" style={{ margin: "14px 0", maxWidth: 800 }}>
          {post.title}
        </h1>
        <p
          className="font-mono2"
          style={{
            fontSize: "0.75rem",
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 18,
          }}
        >
          {dateLabel} · {readTime} · {SITE.name}
        </p>
        <p className="sec-sub" style={{ fontSize: "1.08rem", maxWidth: 720 }}>
          {post.excerpt}
        </p>

        <article
          className="prose-neu"
          style={{ maxWidth: 760, marginTop: 32 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {post.relatedTools.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <SectionHead label="Try it free" title={<>Use the free tool</>} />
            <RelatedTools slugs={post.relatedTools} />
          </div>
        )}

        {post.faqs.length > 0 && (
          <div style={{ marginTop: 48, maxWidth: 760 }}>
            <SectionHead label="FAQ" title={<>Frequently asked questions</>} />
            <FaqList faqs={post.faqs} />
          </div>
        )}

        <div style={{ marginTop: 48, maxWidth: 760 }}>
          <SectionHead label="Keep reading" title={<>More guides</>} />
          <div className="tool-grid">
            {relatedPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card card-hover"
                style={{ padding: 20, display: "block", textDecoration: "none", color: "inherit" }}
              >
                <h3 className="font-display" style={{ fontSize: "1.15rem", lineHeight: 1.2 }}>
                  {p.title}
                </h3>
                <span style={{ color: "var(--red-dark)", fontWeight: 600, fontSize: "0.9rem" }}>
                  Read →
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {post.tags.map((tag) => (
            <span key={tag} className="badge badge-green">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
