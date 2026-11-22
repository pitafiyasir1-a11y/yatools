import Link from "next/link";
import {
  SITE,
  pageMeta,
  toolBySlug,
  breadcrumbJsonLd,
  faqJsonLd,
  type ToolDef,
} from "@/lib/site";
import ToolClient from "./ToolClient";
import { ToolIcon } from "@/components/tool-icons";

const tool = toolBySlug("ai-logo-generator")!;

export const metadata = pageMeta({
  title: "AI Logo Generator Free, No Watermark — Make a Logo Online",
  description:
    "Generate a free AI logo online — type your business name, pick a style, and download a clean 512×512 logo. No watermark, no sign-up. Try it now!",
  path: "/tools/ai-logo-generator",
  keywords: [
  "ai logo generator free without watermark",
  "free ai logo maker",
  "make a logo with ai",
  "ai logo creator",
  "logo generator free",
  "business logo maker"
],
});

const FAQS = [
  {
    "q": "Is this AI logo generator really free?",
    "a": "Yes — free with no sign-up and no watermark on the downloaded logo. The logo is yours to use."
  },
  {
    "q": "What size is the logo?",
    "a": "512×512 pixels — sharp for profile pictures, websites, and social posts. For large print, upscale it with the free Image Upscaler."
  },
  {
    "q": "Can I use the logo commercially?",
    "a": "Yes, for your own business. Do a quick check that it does not resemble an existing trademark before printing it on products."
  },
  {
    "q": "Why is the text in my logo misspelled?",
    "a": "AI image models still struggle with lettering. Try a new variation, or pick the minimal or modern style, which use less text. Short brand names work best."
  },
  {
    "q": "Can I edit the logo afterwards?",
    "a": "Yes — download it and edit it in any image editor, or use the Background Remover and Image Upscaler here on YATools."
  }
];

const STEPS = [
  {
    "title": "Type your brand name",
    "text": "Add your business name and a few words about what it does."
  },
  {
    "title": "Pick a style",
    "text": "Minimal, modern, vintage, 3D, mascot, or hand-drawn — six styles to match your brand."
  },
  {
    "title": "Generate and download",
    "text": "Get a 512×512 logo in seconds, download it, or roll a new variation."
  }
];

const USE_CASES = [
  {
    "title": "Startups",
    "text": "A brand mark on day one, before you can afford a designer."
  },
  {
    "title": "Shops and cafés",
    "text": "A clean logo for signs, menus, packaging, and social profiles."
  },
  {
    "title": "YouTube channels",
    "text": "Channel art and profile pictures that look intentional, not default."
  },
  {
    "title": "Side projects",
    "text": "Give a weekend project a real identity in under a minute."
  }
];

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Tools", path: "/tools" },
  { name: tool.name, path: `/tools/${tool.slug}` },
];

function softwareAppJsonLd(t: ToolDef) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${t.name} — ${SITE.name}`,
    url: `${SITE.url}/tools/${t.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: t.description,
  };
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="code-window mt-4">
      <div className="code-bar">
        <span className="code-dot" style={{ background: "#ff5f57" }} />
        <span className="code-dot" style={{ background: "#febc2e" }} />
        <span className="code-dot" style={{ background: "#28c840" }} />
        <span
          className="font-mono2 text-xs ml-2"
          style={{ color: "#a9a7a0" }}
        >
          {label}
        </span>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="card p-2 sm:p-4 mt-6">
      {faqs.map((f) => (
        <details key={f.q} className="faq-item">
          <summary className="faq-q">
            {f.q}
            <span aria-hidden="true">+</span>
          </summary>
          <p className="faq-a">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

function RelatedGrid({ related }: { related: ToolDef[] }) {
  return (
    <div className="tool-grid mt-6">
      {related.map((t) => (
        <Link
          key={t.slug}
          href={`/tools/${t.slug}`}
          className="card card-hover p-5 block"
        >
          <span className={`badge badge-${t.badgeColor}`}>
            {t.badge}
          </span>
          <h3 className="font-display text-2xl mt-3">{t.name}</h3>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {t.tagline}
          </p>
        </Link>
      ))}
    </div>
  );
}

const RELATED_SLUGS: string[] = [
  "ai-image-generator",
  "background-remover",
  "image-upscaler"
];

const CODE_EXAMPLE = `// Generate a logo with the free AI image API
const prompt = encodeURIComponent("minimal modern logo for a coffee shop, flat vector style");
const url = "https://image.pollinations.ai/prompt/" + prompt + "?width=512&height=512&nologo=true";
document.getElementById("logo").src = url; // direct image URL, no key`;

export default function AiLogoGeneratorPage() {
  const related = RELATED_SLUGS
    .map((s) => toolBySlug(s))
    .filter((t): t is ToolDef => Boolean(t));

  return (
    <main className="wrap py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppJsonLd(tool)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(crumbs)),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="font-mono2 text-xs mb-8 flex items-center gap-2"
        style={{ color: "var(--muted)" }}
      >
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>/</span>
        <Link href="/#tools" className="hover:underline">
          Tools
        </Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{tool.name}</span>
      </nav>

      <header className="text-center max-w-3xl mx-auto mb-10">
        <span aria-hidden="true" className="tool-icon tool-icon-lg" style={{ margin: "0 auto 16px" }}>
          <ToolIcon slug={tool.slug} />
        </span>
        <span className="eyebrow">
          <span className="dot" />
          Free tool
        </span>
        <h1 className="hero-title mt-5">
          AI Logo Generator Free, <em>No Watermark</em>
        </h1>
        <p className="sec-sub mx-auto mt-4">A free AI logo generator: type your business name, pick a style, and download a clean 512×512 logo — no watermark, no sign-up.</p>
      </header>

      <section aria-label="AI Logo Generator tool">
        <ToolClient />
        <p
          className="text-center text-sm mt-5"
          style={{ color: "var(--muted)" }}
        >
          Free AI logos — 512×512, no watermark. Lettering can come out garbled sometimes; hit “New variation” for a cleaner try.
        </p>
      </section>

      <section className="mt-14">
        <p className="sec-label">About this tool</p>
        <h2 className="sec-title">
          About the <em>AI Logo Generator</em>
        </h2>
        <div className="card p-6 mt-6">
          <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            A logo is the face of a business, and this free AI logo generator makes one in under a minute. Type your business name, say what it does, pick one of six styles — minimal, modern, vintage, 3D, mascot, or hand-drawn — and download a clean 512×512 logo with no watermark and no sign-up. Startups get a brand mark on day one, shops get a sign-ready logo, and creators get channel art without hiring a designer.
          </p>
          <p className="text-sm mt-4" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            AI logos are generated from scratch, so every result is original — but AI still struggles with lettering, and the brand name can come out misspelled or garbled. If that happens, generate a new variation or pick a style with less text. Before using a logo commercially, check it does not resemble an existing trademark.
          </p>
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">How it works</p>
        <h2 className="sec-title">
          Three steps to <em>done</em>
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-6">
              <div
                className="font-display text-4xl"
                style={{ color: "var(--red)" }}
              >
                {i + 1}
              </div>
              <h3 className="font-bold mt-2">{s.title}</h3>
              <p className="text-sm mt-1" style={{ color: "var(--text2)" }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">Use cases</p>
        <h2 className="sec-title">
          What it is <em>for</em>
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {USE_CASES.map((u) => (
            <div key={u.title} className="card p-6">
              <h3 className="font-bold">{u.title}</h3>
              <p className="text-sm mt-1" style={{ color: "var(--text2)" }}>
                {u.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">FAQ</p>
        <h2 className="sec-title">
          Questions, <em>answered</em>
        </h2>
        <FaqList faqs={FAQS} />
      </section>

      <section className="mt-14">
        <p className="sec-label">Related tools</p>
        <h2 className="sec-title">
          Keep <em>going</em>
        </h2>
        <RelatedGrid related={related} />
      </section>

      <section className="mt-14">
        <p className="sec-label">For developers</p>
        <h2 className="sec-title">
          Use the <em>free API</em> in your own app
        </h2>
        <p className="sec-sub mt-2">
          The same free image model behind this tool is available as a public API — one GET request, no key.
        </p>
        <CodeBlock label="JavaScript — generate a logo with the free AI image API" code={CODE_EXAMPLE} />
      </section>

      <div className="notice mt-12 max-w-3xl mx-auto">
        <strong>Private by design.</strong> Your prompt is sent to the image API only to generate your logo. Prompts aren't tied to your identity and nothing is stored in an account.
      </div>
    </main>
  );
}
