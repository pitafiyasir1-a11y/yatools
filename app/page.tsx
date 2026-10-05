import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE,
  TOOLS,
  USE_CASES,
  pageMeta,
  orgJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from "@/lib/site";
import SectionHead from "@/components/SectionHead";
import ToolCard from "@/components/ToolCard";
import Faq from "@/components/Faq";

const meta = pageMeta({
  title: "Free Online Tools for Screenshots, Audio & Documents",
  description: SITE.description,
  path: "/",
  keywords: [
    "free online tools",
    "website screenshot online",
    "text to speech online",
    "audio to text online",
    "free ai image generator",
    "qr code generator",
    "json formatter online",
    "urdu tools",
    "free developer api",
  ],
});

export const metadata: Metadata = {
  ...meta,
  alternates: { ...meta.alternates, languages: { ur: "/ur" } },
};

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: "en",
};

const FAQS = [
  {
    q: "Are the tools really free?",
    a: "Yes — all 14 tools are free to use, with no trials, paywalls, or accounts. API-powered tools run on a fair daily allowance so the service stays free for everyone; the six in-browser tools have no limits at all.",
  },
  {
    q: "Do I need an account or signup?",
    a: "No. There are zero signups, logins, or card details required. Open a tool, paste your input, and get your result.",
  },
  {
    q: "What happens to the files I upload?",
    a: "Your files are used only to produce your result — they are never published, sold, or shared. API-powered tools process them temporarily and discard them afterwards. See the Privacy page for the full details.",
  },
  {
    q: "Is there an API I can build on?",
    a: "Yes. Eight tools expose simple HTTP endpoints under /api/v1/ — no API key required, with a free daily allowance per endpoint. The developer docs walk through every parameter with examples.",
  },
  {
    q: "Can I use the results commercially?",
    a: "Mostly yes — the screenshots, PDFs, AI images, transcriptions, and QR codes you generate are yours to use, including for commercial work. The one exception is Text-to-Speech audio, which is free for personal, non-commercial use under the voice provider's terms. See the Terms page for the full details.",
  },
  {
    q: "What if I hit the daily limit on an API tool?",
    a: "Allowances reset the next day, so you can simply try again tomorrow. In-browser tools never hit limits, so where one fits — like the QR generator or word counter — you can keep working without waiting.",
  },
];

const TRUST = [
  "No signup required",
  "Free daily allowance",
  "No card required",
  "Developer API included",
];

const STEPS = [
  {
    title: "Pick a tool",
    text: "Open any of the 14 tools below — nothing to install, nothing to sign up for.",
  },
  {
    title: "Paste your input",
    text: "Drop in a URL, upload a file, or type your text. In-browser tools never send anything to a server.",
  },
  {
    title: "Get your result",
    text: "Download, copy, or share your result instantly. Everything you make is yours to keep.",
  },
];

const WHY_FREE = [
  {
    title: "Built on free infrastructure",
    text: "YATools runs on free tiers and open services, so the cost of keeping it online is close to zero — and that saving is passed straight to you.",
  },
  {
    title: "Fair-use allowances",
    text: "API-powered tools get a free daily allowance per user. It keeps one person's heavy day from spoiling the service for everyone else.",
  },
  {
    title: "Six tools cost nothing to run",
    text: "The QR generator, word counter, JSON formatter, password generator, case converter, and color picker run entirely in your browser — zero server cost, zero limits.",
  },
];

const API_BULLETS = [
  "No API key — call /api/v1/* endpoints directly",
  "Free daily allowance on every endpoint",
  "JSON responses with clear error messages",
  "Full parameter reference at /developers",
];

const JS_SNIPPET = `// Screenshot any public URL — no API key needed
const res = await fetch("https://yatools.vercel.app/api/v1/websnap", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com" }),
});

const data = await res.json();
// See /developers for the exact response shape
console.log(data);`;

const PY_SNIPPET = `# Same endpoint, Python
import requests

r = requests.post(
    "https://yatools.vercel.app/api/v1/websnap",
    json={"url": "https://example.com"},
)
# See /developers for the exact response shape
print(r.json())`;

const CURL_SNIPPET = `# Or straight from the terminal
curl -X POST https://yatools.vercel.app/api/v1/websnap \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://example.com"}'`;

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display m-0 text-4xl md:text-5xl" style={{ color: "var(--text)", lineHeight: 1 }}>
        {value}
      </p>
      <p className="font-mono2 m-0 mt-1 text-xs uppercase" style={{ color: "var(--muted)", letterSpacing: "0.08em" }}>
        {label}
      </p>
    </div>
  );
}

function CodeWindow({ code, title }: { code: string; title: string }) {
  return (
    <div className="code-window">
      <div className="code-bar">
        <span className="code-dot" style={{ background: "#ff5f57" }} />
        <span className="code-dot" style={{ background: "#febc2e" }} />
        <span className="code-dot" style={{ background: "#28c840" }} />
        <span className="ml-2 text-xs" style={{ color: "#9b998f" }}>{title}</span>
      </div>
      <pre>{code}</pre>
    </div>
  );
}

const apiTools = TOOLS.filter((t) => t.api !== null);
const browserTools = TOOLS.filter((t) => t.api === null);
const categories = Array.from(new Set(TOOLS.map((t) => t.category)));

export default function HomePage() {
  return (
    <>
      <JsonLd data={orgJsonLd()} />
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }])} />
      <JsonLd data={faqJsonLd(FAQS)} />

      {/* ================= HERO ================= */}
      <section className="wrap pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-3xl">
          <span className="eyebrow">
            <span className="dot" aria-hidden="true" />
            Free online tools
          </span>
          <h1 className="hero-title mt-5 mb-5">
            Free tools for <em>screenshots</em>, audio, documents &amp; everyday work.
          </h1>
          <p className="mb-8 max-w-xl text-lg leading-relaxed" style={{ color: "var(--text2)" }}>
            14 genuinely free tools — capture pages, convert audio, generate images,
            format JSON, and more. No signup, no card, and eight of them come with a
            free API you can call from your own apps.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/#tools" className="neu-btn neu-btn-primary no-underline">
              Explore tools
            </Link>
            <Link href="/developers" className="neu-btn no-underline">
              View API docs
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat value="14" label="Free tools" />
            <Stat value="8" label="API-powered" />
            <Stat value="6" label="In-browser" />
            <Stat value="0" label="Signups" />
          </div>
        </div>
      </section>

      {/* ================= TRUST STRIP ================= */}
      <div className="wrap">
        <div className="neu-card flex flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-4">
          {TRUST.map((t) => (
            <span key={t} className="flex items-center gap-2 text-sm font-bold" style={{ color: "var(--text)" }}>
              <span style={{ color: "var(--green)" }}>
                <CheckIcon />
              </span>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ================= TOOLS (grouped) ================= */}
      <section id="tools" className="wrap scroll-mt-20 py-16">
        <SectionHead
          eyebrow="The toolbox"
          title={
            <>
              All <em>14 tools</em>, one tab.
            </>
          }
          sub="Eight tools run on our free API with a fair daily allowance. Six run entirely in your browser — no limits, nothing uploaded."
        />
        <h3 className="font-mono2 mb-4 text-xs font-medium uppercase" style={{ color: "var(--muted)", letterSpacing: "0.08em" }}>
          API-powered — free daily allowance
        </h3>
        <div className="tool-grid mb-10">
          {apiTools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
        <h3 className="font-mono2 mb-4 text-xs font-medium uppercase" style={{ color: "var(--muted)", letterSpacing: "0.08em" }}>
          In-browser — unlimited, nothing leaves your device
        </h3>
        <div className="tool-grid">
          {browserTools.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="wrap pb-16">
        <hr className="sec-rule mb-12" />
        <SectionHead
          eyebrow="Browse"
          title={
            <>
              Six <em>categories</em>, zero clutter.
            </>
          }
          sub="Each tool page has its own guide, FAQ, and — for API tools — live documentation."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const tools = TOOLS.filter((t) => t.category === cat);
            return (
              <Link key={cat} href="/#tools" className="neu-card neu-card-hover no-underline p-5">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="font-display inline-flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
                    style={{
                      border: "2.5px solid var(--ink)",
                      background: "var(--red-tint)",
                      color: "var(--red-dark)",
                      lineHeight: 1,
                      paddingTop: "4px",
                    }}
                  >
                    {cat.charAt(0)}
                  </span>
                  <div>
                    <h3 className="m-0 text-base font-extrabold" style={{ color: "var(--text)" }}>
                      {cat}
                    </h3>
                    <p className="font-mono2 m-0 text-xs" style={{ color: "var(--muted)" }}>
                      {tools.length} {tools.length === 1 ? "tool" : "tools"}
                    </p>
                  </div>
                </div>
                <p className="m-0 mt-3 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {tools.map((t) => t.name).join(" · ")}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="wrap pb-16">
        <hr className="sec-rule mb-12" />
        <SectionHead
          eyebrow="How it works"
          title={
            <>
              Done in <em>three steps</em>.
            </>
          }
          sub="No accounts, no installs, no learning curve."
        />
        <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="neu-card p-5">
              <span
                aria-hidden="true"
                className="font-display mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-xl text-white"
                style={{
                  background: "var(--red)",
                  border: "2.5px solid var(--ink)",
                  boxShadow: "3px 3px 0 var(--ink)",
                  lineHeight: 1,
                  paddingTop: "2px",
                }}
              >
                {i + 1}
              </span>
              <h3 className="mb-1 text-base font-extrabold" style={{ color: "var(--text)" }}>
                {s.title}
              </h3>
              <p className="m-0 text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
                {s.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ================= WHY FREE ================= */}
      <section className="wrap pb-16">
        <hr className="sec-rule mb-12" />
        <SectionHead
          eyebrow="The model"
          title={
            <>
              Why it&apos;s <em>free</em>.
            </>
          }
          sub="No catch — here's the honest math behind keeping YATools free."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {WHY_FREE.map((w) => (
            <div key={w.title} className="neu-card p-6">
              <h3 className="mb-2 text-lg font-extrabold" style={{ color: "var(--text)" }}>
                {w.title}
              </h3>
              <p className="m-0 text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
                {w.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section id="use-cases" className="wrap scroll-mt-20 pb-16">
        <hr className="sec-rule mb-12" />
        <SectionHead
          eyebrow="Guides"
          title={
            <>
              Real jobs, <em>done faster</em>.
            </>
          }
          sub="Step-by-step guides for getting the most out of YATools."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {USE_CASES.map((u) => (
            <Link key={u.slug} href={`/use-cases/${u.slug}`} className="neu-card neu-card-hover no-underline p-6">
              <p className="font-mono2 mb-2 text-xs uppercase" style={{ color: "var(--red)", letterSpacing: "0.08em" }}>
                Guide
              </p>
              <h3 className="mb-2 text-xl font-extrabold" style={{ color: "var(--text)" }}>
                {u.title}
              </h3>
              <p className="m-0 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {u.description}
              </p>
              <span className="mt-4 inline-block text-sm font-bold" style={{ color: "var(--red-dark)" }}>
                Read the guide &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= API ================= */}
      <section id="api" className="wrap scroll-mt-20 pb-16">
        <hr className="sec-rule mb-12" />
        <SectionHead
          eyebrow="For developers"
          title={
            <>
              Every API tool, <em>one HTTP call</em> away.
            </>
          }
          sub="Eight tools expose free endpoints under /api/v1/. No API key, no signup — just fetch."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <CodeWindow code={JS_SNIPPET} title="javascript" />
          <CodeWindow code={PY_SNIPPET} title="python" />
          <CodeWindow code={CURL_SNIPPET} title="curl" />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          {API_BULLETS.map((b) => (
            <span key={b} className="flex items-center gap-2 text-sm font-bold" style={{ color: "var(--text)" }}>
              <span style={{ color: "var(--green)" }}>
                <CheckIcon />
              </span>
              {b}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/developers" className="neu-btn neu-btn-primary no-underline">
            Read the API docs
          </Link>
          <Link href="/tools/website-screenshot" className="neu-btn no-underline">
            Try a live tool
          </Link>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="wrap scroll-mt-20 pb-20">
        <hr className="sec-rule mb-12" />
        <SectionHead
          eyebrow="FAQ"
          title={
            <>
              Questions, <em>answered</em>.
            </>
          }
          sub="The short version of everything people ask before using YATools."
        />
        <Faq faqs={FAQS} />
        <div className="mt-10 text-center">
          <Link href="/#tools" className="neu-btn neu-btn-primary no-underline">
            Try a tool now
          </Link>
        </div>
      </section>
    </>
  );
}
