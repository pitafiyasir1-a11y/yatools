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

const tool = toolBySlug("ai-chatbot")!;

export const metadata = pageMeta({
  title: "AI Chatbot Free, No Sign Up — Chat with AI Online",
  description:
    "Chat with a free AI chatbot online — ask questions, get explanations, brainstorm ideas, and draft messages. No sign-up, no app, no credits. Try it now!",
  path: "/tools/ai-chatbot",
  keywords: [
  "ai chatbot free no sign up",
  "free ai chatbot",
  "chat with ai online",
  "ai chat bot",
  "talk to ai free",
  "ai assistant free"
],
});

const FAQS = [
  {
    "q": "Is this AI chatbot really free?",
    "a": "Yes. Chat as much as you like with no sign-up, no app, and no credits. It runs on a free AI text model, so at peak times replies can be slow."
  },
  {
    "q": "Does the chatbot remember what I said?",
    "a": "Yes — it keeps your last few messages as context, so follow-up questions like “explain that more simply” work. Start a new chat with Clear chat to forget the thread."
  },
  {
    "q": "Can the chatbot be wrong?",
    "a": "Yes. AI models sometimes state wrong facts confidently. Treat answers as a starting point and double-check dates, numbers, and important claims."
  },
  {
    "q": "Is my chat private?",
    "a": "Your messages are sent to the free AI service only to generate replies, and nothing is stored in an account here. Still, avoid sharing passwords, addresses, or sensitive personal information."
  },
  {
    "q": "What should I not ask it?",
    "a": "Don't rely on it for medical, legal, or financial decisions — it is a general chatbot, not a professional. For those, talk to a qualified person."
  }
];

const STEPS = [
  {
    "title": "Ask your question",
    "text": "Type anything — a homework question, an idea to explore, or a message to draft."
  },
  {
    "title": "Read the reply",
    "text": "The AI answers in seconds. Ask a follow-up and it remembers the conversation."
  },
  {
    "title": "Copy what you need",
    "text": "Use the answer as a starting point — edit it in your own words before using it."
  }
];

const USE_CASES = [
  {
    "title": "Homework help",
    "text": "Get explanations of tricky topics in plain language, with examples."
  },
  {
    "title": "Brainstorming",
    "text": "Generate names, ideas, outlines, and angles when you are stuck."
  },
  {
    "title": "Drafting messages",
    "text": "Start a tricky email or message, then rewrite it in your own voice."
  },
  {
    "title": "Learning anything",
    "text": "Ask “explain it like I'm five” or “give me an analogy” for any topic."
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
  "ai-writer",
  "ai-code-generator",
  "ai-image-generator"
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

export default function AiChatbotPage() {
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
          AI Chatbot Free, <em>No Sign Up</em>
        </h1>
        <p className="sec-sub mx-auto mt-4">A free AI chatbot: ask questions, get explanations, brainstorm ideas, and draft messages — no sign-up, no app, no credits.</p>
      </header>

      <section aria-label="AI Chatbot tool">
        <ToolClient />
        <p
          className="text-center text-sm mt-5"
          style={{ color: "var(--muted)" }}
        >
          Free AI chat — answers come from a free AI text model, so they can be slow at peak times and are sometimes wrong. Double-check important facts.
        </p>
      </section>

      <section className="mt-14">
        <p className="sec-label">About this tool</p>
        <h2 className="sec-title">
          About the <em>AI Chatbot</em>
        </h2>
        <div className="card p-6 mt-6">
          <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            An AI chatbot answers questions, explains things, brainstorms ideas, and drafts messages — like texting a knowledgeable friend who never sleeps. This free online chatbot needs no account, no app, and no credits: type a question and get an answer in seconds. Students get homework explanations, writers beat blank-page block, and anyone can get a quick second opinion or a draft to start from.
          </p>
          <p className="text-sm mt-4" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            The chat remembers your last few messages, so you can ask follow-ups — “explain that more simply” or “give me an example” — and it keeps the thread. It runs on a free AI text model, which means answers can be slow when the service is busy, and the model sometimes states wrong facts confidently. Use it for ideas, explanations, and drafts — and double-check anything important before relying on it.
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
          The same free text model behind this chatbot is available as a public API — one POST request, no key.
        </p>
        <CodeBlock label="JavaScript — chat with the free AI text API" code={CODE_EXAMPLE} />
      </section>

      <div className="notice mt-12 max-w-3xl mx-auto">
        <strong>Private by design.</strong> Your messages are sent to the free AI service only to generate replies. Nothing is stored in an account — avoid sharing passwords or sensitive personal information.
      </div>
    </main>
  );
}
