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

const tool = toolBySlug("ai-code-generator")!;

export const metadata = pageMeta({
  title: "AI Code Generator Free — Write Python, JavaScript & HTML Code",
  description:
    "Generate code free with AI — describe what you need in plain words and get working Python, JavaScript, HTML, SQL, or Java code. No sign-up. Try it now!",
  path: "/tools/ai-code-generator",
  keywords: [
  "ai code generator free",
  "generate code with ai",
  "ai python code generator",
  "free ai coding tool",
  "write code with ai",
  "ai programmer"
],
});

const FAQS = [
  {
    "q": "Is this AI code generator really free?",
    "a": "Yes — free with no sign-up. Describe the task, pick a language, and get code back in seconds."
  },
  {
    "q": "Is the generated code correct?",
    "a": "Usually, but not always. AI code can have bugs — always read it, run it, and test it before using it in anything important."
  },
  {
    "q": "What languages does it support?",
    "a": "Python, JavaScript, HTML/CSS, SQL, and Java. Describe the task in plain words and pick the language."
  },
  {
    "q": "Can I use the code in my own project?",
    "a": "Yes. Review it first — you are responsible for what you ship. For production code, have a human review it."
  },
  {
    "q": "Can it build a whole app?",
    "a": "No — it writes functions, snippets, and single files. Whole applications need architecture and testing no snippet generator can do."
  }
];

const STEPS = [
  {
    "title": "Describe the task",
    "text": "Plain words work — “a function that checks if a string is a palindrome”."
  },
  {
    "title": "Pick a language",
    "text": "Python, JavaScript, HTML/CSS, SQL, or Java."
  },
  {
    "title": "Copy and test",
    "text": "Copy the code into your project, run it, and fix anything that fails."
  }
];

const USE_CASES = [
  {
    "title": "Quick functions",
    "text": "Validators, converters, formatters, and helpers in seconds."
  },
  {
    "title": "Learning to code",
    "text": "See working examples of patterns you are studying, then modify them."
  },
  {
    "title": "HTML prototypes",
    "text": "A login form or landing section to drop into a mockup."
  },
  {
    "title": "SQL queries",
    "text": "SELECTs, JOINs, and aggregations from a plain-English description."
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
  "json-formatter",
  "regex-tester",
  "ai-chatbot"
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

export default function AiCodeGeneratorPage() {
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
          AI Code Generator <em>Free</em>
        </h1>
        <p className="sec-sub mx-auto mt-4">A free AI code generator: describe what you need in plain words and get working Python, JavaScript, HTML/CSS, SQL, or Java code — no sign-up.</p>
      </header>

      <section aria-label="AI Code Generator tool">
        <ToolClient />
        <p
          className="text-center text-sm mt-5"
          style={{ color: "var(--muted)" }}
        >
          AI code can contain bugs — always read it, test it, and never run code you do not understand on important data.
        </p>
      </section>

      <section className="mt-14">
        <p className="sec-label">About this tool</p>
        <h2 className="sec-title">
          About the <em>AI Code Generator</em>
        </h2>
        <div className="card p-6 mt-6">
          <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            You know what you want the code to do — this free AI code generator writes it for you. Describe the task in plain words, pick a language (Python, JavaScript, HTML/CSS, SQL, or Java), and get working code back in seconds, with no sign-up. Beginners get unstuck on homework, developers scaffold boilerplate fast, and non-programmers build small utilities without learning to code first.
          </p>
          <p className="text-sm mt-4" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            The generator returns only the code with a short comment — no explanation to wade through. But AI code can contain bugs, security holes, or outdated patterns, so always read it and test it before using it, and never run code you do not understand on important data. It writes functions and snippets, not whole applications.
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
        <CodeBlock label="JavaScript — generate code with the free AI text API" code={CODE_EXAMPLE} />
      </section>

      <div className="notice mt-12 max-w-3xl mx-auto">
        <strong>Private by design.</strong> Your task description is sent to the free AI service only to generate the code. Nothing is stored in an account — avoid pasting passwords, keys, or private code.
      </div>
    </main>
  );
}
