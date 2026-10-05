import type { Metadata } from "next";

/* ============ YATools site-wide constants & tool registry (single source of truth) ============ */

export const SITE = {
  name: "YATools",
  url: "https://yatools.vercel.app",
  description:
    "Free online tools for screenshots, audio, documents, Urdu content, and developers — with simple APIs for integration.",
  tagline: "Free tools for screenshots, audio, documents, and everyday work.",
  email: "contact@ahm7xmakki.com", // TODO(owner): set a dedicated YATools address when available
  owner: "Yasir Abbas",
  locale: "en",
} as const;

export type ToolCategory =
  | "Screenshots & PDF"
  | "Audio & Speech"
  | "Urdu Tools"
  | "Developer Tools"
  | "AI Tools"
  | "Everyday Utilities";

export interface ToolDef {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  keyword: string;
  badge: string;
  badgeColor: "red" | "green" | "blue" | "purple";
  api: string | null; // our proxy route, e.g. "/api/v1/websnap"; null = pure client-side
  related: string[]; // slugs of genuinely related tools
}

export const TOOLS: ToolDef[] = [
  {
    slug: "website-screenshot",
    name: "Website Screenshot",
    tagline: "Capture any URL as a full-page screenshot.",
    description:
      "Turn any public web page into a full-page PNG screenshot. Paste a link, get an image — perfect for client reports, design reviews, and archiving pages.",
    category: "Screenshots & PDF",
    keyword: "website screenshot online",
    badge: "API",
    badgeColor: "blue",
    api: "/api/v1/websnap",
    related: ["wikipedia-to-pdf", "movie-tv-search", "qr-code-generator"],
  },
  {
    slug: "audio-to-text",
    name: "Audio to Text",
    tagline: "Transcribe MP3, WAV, M4A and more into editable text.",
    description:
      "Upload an audio file and get an accurate transcript with optional SRT timestamps. Great for lecture notes, interviews, voice messages, and podcasts.",
    category: "Audio & Speech",
    keyword: "audio to text online",
    badge: "AI",
    badgeColor: "purple",
    api: "/api/v1/transcribe",
    related: ["text-to-speech", "urdu-handwriting", "word-counter"],
  },
  {
    slug: "text-to-speech",
    name: "Text to Speech",
    tagline: "Convert any text into natural-sounding audio.",
    description:
      "Type or paste text and generate lifelike speech in multiple voices and languages. Ideal for video narration, Urdu voiceovers, and accessibility.",
    category: "Audio & Speech",
    keyword: "text to speech online",
    badge: "AI",
    badgeColor: "purple",
    api: "/api/v1/tts",
    related: ["audio-to-text", "urdu-handwriting", "word-counter"],
  },
  {
    slug: "urdu-handwriting",
    name: "Urdu Handwriting",
    tagline: "Turn typed notes into realistic handwriting.",
    description:
      "Convert typed English or Urdu text into realistic handwriting on ruled paper. Download as PNG — perfect for notes, assignments, and study material.",
    category: "Urdu Tools",
    keyword: "urdu handwriting generator",
    badge: "Urdu",
    badgeColor: "green",
    api: "/api/v1/hand",
    related: ["wikipedia-to-pdf", "text-to-speech", "word-counter"],
  },
  {
    slug: "wikipedia-to-pdf",
    name: "Wikipedia to PDF",
    tagline: "Convert any Wikipedia article into a clean PDF.",
    description:
      "Save any Wikipedia article as a beautifully formatted, selectable-text PDF with working links. Perfect for offline reading and study packs.",
    category: "Screenshots & PDF",
    keyword: "wikipedia article to pdf",
    badge: "Docs",
    badgeColor: "blue",
    api: "/api/v1/wikipdf",
    related: ["website-screenshot", "urdu-handwriting", "word-counter"],
  },
  {
    slug: "n8n-workflow-search",
    name: "n8n Workflow Search",
    tagline: "Search thousands of n8n automation workflows.",
    description:
      "Find ready-made n8n workflow templates by keyword, category, complexity, and trigger type. Jump-start your next automation instead of building from zero.",
    category: "Developer Tools",
    keyword: "n8n workflow templates",
    badge: "Dev",
    badgeColor: "red",
    api: "/api/v1/n8n",
    related: ["json-formatter", "website-screenshot", "qr-code-generator"],
  },
  {
    slug: "ai-image-generator",
    name: "AI Image Generator",
    tagline: "Generate images from text prompts, free.",
    description:
      "Describe anything and get a high-quality AI image in seconds. Eleven aspect ratios for thumbnails, reels, posts, and presentations.",
    category: "AI Tools",
    keyword: "free ai image generator",
    badge: "AI",
    badgeColor: "purple",
    api: "/api/v1/tti",
    related: ["website-screenshot", "qr-code-generator", "color-picker"],
  },
  {
    slug: "movie-tv-search",
    name: "Movie & TV Search",
    tagline: "Search movies and shows — ratings, cast, posters.",
    description:
      "Look up movies and TV shows with ratings, genres, cast, and posters. Plan your next watch or research titles for content.",
    category: "AI Tools",
    keyword: "movie tv show search",
    badge: "Media",
    badgeColor: "blue",
    api: "/api/v1/msearch",
    related: ["ai-image-generator", "website-screenshot", "qr-code-generator"],
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    tagline: "Create QR codes for links, text, and Wi-Fi.",
    description:
      "Generate crisp QR codes instantly in your browser — for URLs, plain text, or Wi-Fi credentials. Nothing is uploaded; everything stays on your device.",
    category: "Everyday Utilities",
    keyword: "free qr code generator",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["website-screenshot", "password-generator", "color-picker"],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Count words, characters, and reading time.",
    description:
      "Paste text to count words, characters, sentences, and paragraphs — plus estimated reading time. A must-have for writers, students, and creators.",
    category: "Everyday Utilities",
    keyword: "word counter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["case-converter", "text-to-speech", "audio-to-text"],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "Format, validate, and minify JSON.",
    description:
      "Paste raw JSON to pretty-print it, validate it, or minify it for production. Errors are highlighted with clear messages for developers.",
    category: "Developer Tools",
    keyword: "json formatter online",
    badge: "Dev",
    badgeColor: "red",
    api: null,
    related: ["n8n-workflow-search", "word-counter", "case-converter"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    tagline: "Create strong, random passwords.",
    description:
      "Generate cryptographically strong passwords with the options you choose — length, symbols, numbers. Created locally; never sent anywhere.",
    category: "Everyday Utilities",
    keyword: "strong password generator",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["qr-code-generator", "word-counter", "color-picker"],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    tagline: "Convert text between cases in one click.",
    description:
      "Switch text between UPPERCASE, lowercase, Title Case, camelCase, and snake_case instantly. Handy for developers, writers, and data cleanup.",
    category: "Everyday Utilities",
    keyword: "text case converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["word-counter", "json-formatter", "text-to-speech"],
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    tagline: "Pick colors and copy HEX, RGB, HSL codes.",
    description:
      "Choose any color and instantly copy its HEX, RGB, and HSL values. Includes a curated palette of designer-friendly swatches.",
    category: "Everyday Utilities",
    keyword: "color picker hex",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["ai-image-generator", "qr-code-generator", "website-screenshot"],
  },
  {
    slug: "certificate-maker",
    name: "Certificate Maker",
    tagline: "Create fun novelty certificates in seconds.",
    description:
      "Design a novelty certificate with any name, title, and date — pick from 8 styles and download it as PDF, PNG, or JPG. For fun and personal use only.",
    category: "Everyday Utilities",
    keyword: "novelty certificate maker free",
    badge: "Fun",
    badgeColor: "green",
    api: "/api/v1/certificate",
    related: ["ai-image-generator", "urdu-handwriting", "qr-code-generator"],
  },
  {
    slug: "ai-vision-chat",
    name: "AI Vision Chat",
    tagline: "Upload an image and ask AI about it.",
    description:
      "Upload any photo and ask questions about it — describe scenes, read text in images, identify objects. Powered by AI vision, free with fair-use limits.",
    category: "AI Tools",
    keyword: "ai image chat ask questions",
    badge: "AI",
    badgeColor: "purple",
    api: "/api/v1/imgchat",
    related: ["ai-image-generator", "movie-tv-search", "website-screenshot"],
  },
  {
    slug: "text-to-pdf",
    name: "Text to PDF",
    tagline: "Turn styled text into a downloadable PDF.",
    description:
      "Write or paste text, style it with headings, font sizes, and alignment, then download a clean PDF. Everything happens in your browser — nothing is uploaded.",
    category: "Screenshots & PDF",
    keyword: "text to pdf converter free",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["wikipedia-to-pdf", "word-counter", "case-converter"],
  },
  {
    slug: "background-remover",
    name: "Background Remover",
    tagline: "Remove image backgrounds right in your browser.",
    description:
      "Upload a photo and erase its background with an on-device AI model. Your image never leaves your device — processing is 100% local and private.",
    category: "AI Tools",
    keyword: "remove image background free",
    badge: "AI",
    badgeColor: "purple",
    api: null,
    related: ["ai-image-generator", "image-compressor", "image-converter"],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Shrink image file sizes without visible loss.",
    description:
      "Compress JPG, PNG, and WebP images with a quality slider and live before/after size preview. Files stay on your device — nothing is uploaded.",
    category: "Everyday Utilities",
    keyword: "compress image online free",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-converter", "image-resizer", "background-remover"],
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    tagline: "Convert images between PNG, JPG, and WebP.",
    description:
      "Convert your images between PNG, JPEG, and WebP formats instantly in the browser. Free, private, and no watermarks.",
    category: "Everyday Utilities",
    keyword: "convert image png jpg webp",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-compressor", "image-resizer", "background-remover"],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    tagline: "Resize images to exact dimensions.",
    description:
      "Set exact width and height — with aspect-ratio lock — and download your resized image. Fast, free, and fully private in-browser processing.",
    category: "Everyday Utilities",
    keyword: "resize image online free",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-compressor", "image-converter", "background-remover"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    tagline: "Convert length, weight, temperature, and data.",
    description:
      "Instantly convert between metric and imperial units — length, weight, temperature, and data storage. Type a number, get every conversion at once.",
    category: "Everyday Utilities",
    keyword: "unit converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["word-counter", "case-converter", "json-formatter"],
  },
];

export const toolBySlug = (slug: string): ToolDef | undefined =>
  TOOLS.find((t) => t.slug === slug);

export const USE_CASES = [
  {
    slug: "website-screenshots-for-client-reports",
    title: "Website Screenshots for Client Reports",
    description:
      "How freelancers and agencies capture pixel-perfect website screenshots for client reports in seconds.",
    keyword: "website screenshot for client report",
  },
  {
    slug: "whatsapp-voice-note-to-text",
    title: "Convert WhatsApp Voice Notes to Text",
    description:
      "Turn long WhatsApp voice notes into readable, searchable text you can skim, quote, and save.",
    keyword: "whatsapp voice note to text",
  },
  {
    slug: "urdu-text-to-voice-for-creators",
    title: "Urdu Text to Voice for Content Creators",
    description:
      "How Pakistani creators generate Urdu voiceovers for videos without recording a single line.",
    keyword: "urdu text to voice",
  },
  {
    slug: "wikipedia-to-pdf-for-students",
    title: "Wikipedia to PDF for Students",
    description:
      "Build offline study packs by converting Wikipedia articles into clean, printable PDFs.",
    keyword: "wikipedia to pdf for studying",
  },
] as const;

/** Standard metadata builder: unique title/description + canonical + OG/Twitter. */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE.url}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
    },
  };
}

/** JSON-LD helpers (rendered via <script type="application/ld+json">). */
export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
  };
}

export function webAppJsonLd(tool: ToolDef) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.name} — ${SITE.name}`,
    url: `${SITE.url}/tools/${tool.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: tool.description,
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}
