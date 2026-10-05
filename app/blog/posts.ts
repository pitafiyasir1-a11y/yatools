import { SITE } from "@/lib/site";

/* Shared metadata for /blog index + post pages. */

export interface BlogPostMeta {
  slug: string;
  title: string; // display H1
  excerpt: string;
  date: string; // ISO, for JSON-LD
  dateLabel: string; // display
  readTime: string;
  tags: string[];
}

export const POSTS: BlogPostMeta[] = [
  {
    slug: "merge-pdf-files-free",
    title: "How to Merge PDF Files for Free (3 Easy Methods)",
    excerpt:
      "Combine multiple PDFs into one file in seconds — with a free online merger, macOS Preview, or your iPhone. No sign-up, no watermarks.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["PDF", "How-to"],
  },
  {
    slug: "compress-images-without-losing-quality",
    title: "How to Compress Images Without Losing Quality",
    excerpt:
      "Shrink JPG, PNG, and WebP files with no visible quality loss: the right quality setting, the best format, and when to resize first.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["Images", "How-to"],
  },
  {
    slug: "qr-code-with-logo",
    title: "How to Make a QR Code With Your Logo (Free)",
    excerpt:
      "Put your logo in the middle of a QR code that still scans perfectly. The trick is high error correction — here's the exact 3-step method.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "5 min read",
    tags: ["QR codes", "How-to"],
  },
  {
    slug: "remove-image-background-free",
    title: "How to Remove an Image Background for Free",
    excerpt:
      "Erase photo backgrounds right in your browser — no uploads, no sign-up, no watermark. Plus tips for clean edges and honest limits.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "5 min read",
    tags: ["Images", "AI", "How-to"],
  },
  {
    slug: "unlock-pdf-guide",
    title: "How to Unlock a PDF You Own: Legitimate Options Explained",
    excerpt:
      "Locked out of your own PDF? What PDF passwords actually do, the legitimate ways to regain access, and why random unlocker sites are risky.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "5 min read",
    tags: ["PDF", "How-to"],
  },
];

export function postBySlug(slug: string): BlogPostMeta | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Schema.org Article JSON-LD for blog posts. */
export function articleJsonLd(post: BlogPostMeta, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    datePublished: post.date,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };
}

/** Schema.org Blog JSON-LD for the index page. */
export function blogJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "YATools Blog",
    url: `${SITE.url}/blog`,
    description:
      "Practical how-to guides for YATools' free online tools: merge PDFs, compress images, make QR codes, remove backgrounds, and more.",
    blogPost: POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      url: `${SITE.url}/blog/${p.slug}`,
      datePublished: p.date,
      author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    })),
  };
}
