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
  {
    slug: "pdf-to-word-converter",
    title: "PDF to Word: How to Convert PDF to Editable Word Documents Free",
    excerpt:
      "Convert PDF to editable Word documents for free with Google Docs, Word, or LibreOffice — plus why true PDF→Word is harder than it looks.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "7 min read",
    tags: ["PDF", "Office", "How-to"],
  },
  {
    slug: "word-to-pdf-converter",
    title: "Word to PDF: Free Ways to Convert DOCX to PDF",
    excerpt:
      "Your apps already convert Word to PDF perfectly: built-in Export in Word, Google Docs download, and your phone — no converter sites needed.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["PDF", "Office", "How-to"],
  },
  {
    slug: "excel-to-pdf-converter",
    title: "Excel to PDF: Convert Spreadsheets Without Losing Formatting",
    excerpt:
      "Stop cut-off columns and tiny text: the print-to-PDF page setup that makes Excel and Google Sheets export clean, readable PDFs.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "7 min read",
    tags: ["PDF", "Office", "How-to"],
  },
  {
    slug: "pdf-to-excel",
    title: "PDF to Excel: Extract Tables from PDFs Free",
    excerpt:
      "Why table extraction is hard, and the three genuinely free methods that work — Google Sheets import, LibreOffice, and Tabula — plus the OCR path for scans.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["PDF", "Office", "How-to"],
  },
  {
    slug: "pdf-to-powerpoint",
    title: "PDF to PowerPoint: Turn PDF Pages into Slides Free",
    excerpt:
      "The reliable free method: rasterize each PDF page and insert it as a slide — pixel-perfect, no sign-up — plus the editable-text workaround and why one-click converters fail.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["PDF", "Office", "How-to"],
  },
  {
    slug: "powerpoint-to-pdf",
    title: "PowerPoint to PDF: Export PPTX Without Losing Formatting",
    excerpt:
      "Your apps already convert PowerPoint to PDF perfectly: the built-in Export settings for fonts, slide size, notes, and quality — no converter sites needed.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["PDF", "Office", "How-to"],
  },
  {
    slug: "how-to-convert-pdf-to-word-free",
    title: "How to Convert PDF to Word for Free (2026 Guide)",
    excerpt:
      "Convert PDF to Word free: our in-browser converter for digital PDFs, the OCR route for scans, and desktop fallbacks — real editable DOCX, no sign-up.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["PDF", "Office", "How-to"],
  },
  {
    slug: "best-heic-to-jpg-converters-2026",
    title: "Best Free HEIC to JPG Converters in 2026",
    excerpt:
      "The best free HEIC to JPG converters ranked: our private in-browser converter, cloud options, and the iPhone setting that skips conversion entirely.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["Images", "How-to"],
  },
  {
    slug: "top-10-free-online-tools-2026",
    title: "Top 10 Free Online Tools You Need in 2026",
    excerpt:
      "Our top 10 free online tools for 2026 — PDF, image, AI, and everyday utilities — each with a one-line verdict. All free, private, no sign-up.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "7 min read",
    tags: ["Roundup", "How-to"],
  },
  {
    slug: "pdf-to-word-free-vs-paid",
    title: "PDF to Word: Free vs Paid Tools Compared",
    excerpt:
      "Free vs paid PDF to Word tools compared honestly: where free wins outright, where paid earns its money, and the free desktop tier most people overlook.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "7 min read",
    tags: ["PDF", "Office", "Comparison"],
  },
  {
    slug: "removebg-vs-free-alternatives",
    title: "Remove.bg vs Free Alternatives: Which Is Better?",
    excerpt:
      "Remove.bg vs free alternatives compared honestly — features, limits, privacy — including our free in-browser background remover. No fake claims.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["Images", "AI", "Comparison"],
  },
  {
    slug: "how-to-remove-background-from-images-with-ai",
    title: "How to Remove Background from Images with AI (Free)",
    excerpt:
      "Remove image backgrounds free with AI: a step-by-step tutorial using our in-browser tool, plus pro tips for clean edges, hair, and transparent PNGs.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["Images", "AI", "How-to"],
  },
  {
    slug: "how-to-convert-heic-to-jpg-on-windows",
    title: "How to Convert iPhone HEIC to JPG on Windows",
    excerpt:
      "Convert iPhone HEIC to JPG on Windows free: our in-browser converter, the HEIF extension + Photos route, and the iPhone setting that avoids it.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["Images", "How-to"],
  },
  {
    slug: "how-to-convert-word-to-pdf-free",
    title: "How to Convert Word to PDF for Free (2026 Guide)",
    excerpt:
      "Convert Word to PDF free: our in-browser converter, Word's built-in export, and Google Docs — with formatting tips that keep your document intact.",
    date: "2026-10-06",
    dateLabel: "Oct 6, 2026",
    readTime: "6 min read",
    tags: ["Documents", "How-to"],
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
