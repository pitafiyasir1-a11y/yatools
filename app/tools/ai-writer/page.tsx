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

const tool = toolBySlug("ai-writer")!;

export const metadata = pageMeta({
  title: "AI Writer Free Online, No Sign Up — Essays, Emails & Stories",
  description:
    "Write with free AI online — essays, emails, stories, captions, and product descriptions in seconds. Pick a mode and tone. No sign-up. Try it now!",
  path: "/tools/ai-writer",
  keywords: [
  "ai writer free online no sign up",
  "free ai writer",
  "ai essay writer",
  "ai email writer",
  "ai story writer",
  "write with ai"
],
});

const FAQS = [
  {
    "q": "Is this AI writer really free?",
    "a": "Yes — free with no sign-up. Describe your topic, pick a mode and tone, and get a draft in seconds."
  },
  {
    "q": "Is using AI writing cheating?",
    "a": "It depends on your school or workplace rules — some allow AI drafts, others don't. Always check the rules, and never submit AI text as entirely your own work where that is not allowed."
  },
  {
    "q": "Can the AI writer get facts wrong?",
    "a": "Yes. AI text can include wrong names, numbers, and claims. Check every fact before sending or submitting anything."
  },
  {
    "q": "Who owns the text it writes?",
    "a": "It's your draft to edit and use. Short, generic passages are rarely unique — rewrite key lines in your own voice."
  },
  {
    "q": "How long can the writing be?",
    "a": "Keep topics focused for the best results. Very long pieces take longer to generate — split a big essay into sections and write them one at a time."
  }
];

const STEPS = [
  {
    "title": "Describe your topic",
    "text": "One or two sentences is enough — the more specific, the better the draft."
  },
  {
    "title": "Pick a mode and tone",
    "text": "Essay, email, story, caption, or product description — formal, friendly, or short."
  },
  {
    "title": "Copy, edit, use",
    "text": "Copy the draft, rewrite it in your voice, and check the facts before using it."
  }
];

const USE_CASES = [
  {
    "title": "Essays and assignments",
    "text": "A structured first draft to build on — then make it yours."
  },
  {
    "title": "Work emails",
    "text": "Polite, formal emails in seconds — apologies, follow-ups, introductions."
  },
  {
    "title": "Stories and captions",
    "text": "Short stories, reel captions, and post ideas when creativity stalls."
  },
  {
    "title": "Product descriptions",
    "text": "Clear, selling copy for listings, shops, and catalogues."
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
  "ai-chatbot",
  "grammar-checker",
  "ai-code-generator"
];

const CODE_EXAMPLE = `// Call the free AI text API from JavaScript
const res = await fetch("https://text.pollinations.ai/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "Hello! What can you do?" }],
  }),
});
const reply = await res.text(); // plain text, no key needed`;

export default function AiWriterPage() {
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
          AI Writer Free, <em>No Sign Up</em>
        </h1>
        <p className="sec-sub mx-auto mt-4">A free AI writer: essays, emails, stories, captions, and product descriptions in seconds — pick a mode and a tone, no sign-up.</p>
      </header>

      <section aria-label="AI Writer tool">
        <ToolClient />
        <p
          className="text-center text-sm mt-5"
          style={{ color: "var(--muted)" }}
        >
          AI writing is a first draft, not a finished piece — edit it in your own voice and check facts before sending or submitting it.
        </p>
      </section>

      <section className="mt-14">
        <p className="sec-label">About this tool</p>
        <h2 className="sec-title">
          About the <em>AI Writer</em>
        </h2>
        <div className="card p-6 mt-6">
          <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            Staring at a blank page is the hardest part of writing — this free AI writer gives you a first draft in seconds. Describe your topic, pick what to write (essay, email, story, caption, or product description) and a tone (formal, friendly, or short), and get clean, ready-to-edit text with no sign-up. Students start essays, professionals answer emails faster, and sellers write product copy without a copywriter.
          </p>
          <p className="text-sm mt-4" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            The writer runs on a free AI text model, so longer pieces take a little longer and the draft can contain wrong facts or a tone that is not quite yours. Treat the output as a starting point: edit it in your own voice, check names, numbers, and claims, and check your school or workplace rules before submitting AI-assisted work.
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
          The same free text model behind this tool is available as a public API — one POST request, no key.
        </p>
        <CodeBlock label="JavaScript — write with the free AI text API" code={CODE_EXAMPLE} />
      </section>

      <div className="notice mt-12 max-w-3xl mx-auto">
        <strong>Private by design.</strong> Your topic is sent to the free AI service only to generate the draft. Nothing is stored in an account — avoid sharing passwords or sensitive personal information.
      </div>
    </main>
  );
}
