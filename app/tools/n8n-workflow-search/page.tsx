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

const tool = toolBySlug("n8n-workflow-search")!;

export const metadata = pageMeta({
  title: "n8n Workflow Search - Find Automation Templates Free",
  description:
    "Search free n8n workflow templates online — find automation workflows by keyword, preview complexity, and import the JSON into n8n in one click. Try now!",
  path: "/tools/n8n-workflow-search",
  keywords: [
    "n8n workflows",
    "n8n templates",
    "n8n automation",
    "workflow search",
    "n8n examples",
  ],
});

const FAQS = [
  {
    q: "Are n8n workflow templates free?",
    a: "Yes — the templates themselves are free to download and import. n8n also has a free self-hosted tier, so you can run most of these automations without paying anything.",
  },
  {
    q: "How do I import a workflow into n8n?",
    a: "Download the template with \u201cGet workflow\u201d, then in n8n go to Workflows and choose Import from File. Select the downloaded JSON and the workflow appears in your editor, ready to configure.",
  },
  {
    q: "What does the \u201csnapshot\u201d badge mean?",
    a: "The live workflow directory was temporarily unreachable, so results come from our weekly snapshot cache instead. The workflows are real templates — they may just lag brand-new additions by a few days.",
  },
  {
    q: "What do the complexity levels mean?",
    a: "Simple templates are connect-your-accounts-and-go; Medium ones may need API keys or expressions; Complex ones are multi-branch automations that assume you know your way around n8n.",
  },
  {
    q: "Can I use these workflows for client or commercial work?",
    a: "Templates are community-shared starting points, so check the template's own notes and n8n's terms for your plan. Most are fine to adapt, but always review credentials and data handling before putting one into production.",
  },
  {
    q: "Why can't I find a workflow for my exact use case?",
    a: "Try broader keywords — \u201cslack\u201d instead of \u201cnotify my team channel when a form is submitted\u201d. Most automations are combinations of common patterns, and a close template is faster to adapt than building from zero.",
  },
  {
    q: "Where can I find free n8n workflow templates?",
    a: "Right here — search by keyword, preview what each workflow does and how complex it is, then copy the JSON and import it into your n8n instance.",
  },
  {
    q: "What does the snapshot badge mean?",
    a: "It marks templates served from a curated offline snapshot rather than a live search. They import into n8n identically — the badge just tells you where the data came from.",
  },

];

const STEPS = [
  {
    title: "Search by keyword",
    text: "Type what you want to automate — \u201cslack notifications\u201d, \u201cgmail to sheets\u201d, \u201cRSS to Twitter\u201d.",
  },
  {
    title: "Narrow with filters",
    text: "Pick a category, complexity level, and trigger type to find a template that fits your setup and skill level.",
  },
  {
    title: "Get the workflow",
    text: "Download the template JSON and import it into n8n via Workflows \u2192 Import from File, then connect your own accounts.",
  },
];

const PARAMS = [
  {
    name: "endpoint",
    type: "string",
    required: "Yes",
    desc: "\u201ccategories\u201d (list all categories) or \u201ctemplates\u201d (default).",
  },
  {
    name: "category",
    type: "string",
    required: "No",
    desc: "Category name or slug, e.g. ai-automation.",
  },
  {
    name: "complexity",
    type: "string",
    required: "No",
    desc: "Simple, Medium, or Complex.",
  },
  {
    name: "triggerType",
    type: "string",
    required: "No",
    desc: "Manual, Scheduled, Triggered, or Webhook.",
  },
  {
    name: "page",
    type: "number",
    required: "No",
    desc: "Page number, default 1.",
  },
  {
    name: "limit",
    type: "number",
    required: "No",
    desc: "Items per page, default 20.",
  },
  {
    name: "q",
    type: "string",
    required: "No",
    desc: "Keyword search over the weekly snapshot (name, description, tags, category). The upstream API has no keyword filter, so q is always served from the snapshot with fallbackUsed set.",
  },
  {
    name: "provider",
    type: "string",
    required: "\u2014",
    desc: "Returned in the envelope: \u201cyatools\u201d (live directory) or \u201ccache\u201d (weekly snapshot). fallbackUsed flags the snapshot.",
  },
  {
    name: "rate limit",
    type: "\u2014",
    required: "\u2014",
    desc: "100 searches per day per IP. Exceeding it returns HTTP 429 with a Retry-After header.",
  },
];

const JS_EXAMPLE = `// Search n8n workflow templates by category
const params = new URLSearchParams({
  endpoint: "templates",
  category: "ai-automation",
  complexity: "Complex",
  page: "1",
  limit: "12",
});
const res = await fetch(\`/api/v1/n8n?\${params}\`);
const { data, provider, fallbackUsed } = await res.json();
console.log(data.templates, data.pagination);
// provider is "yatools" (live) or "cache" (weekly snapshot fallback)`;

const CURL_EXAMPLE = `# List every workflow category with its template count
curl "https://yatools-tan.vercel.app/api/v1/n8n?endpoint=categories" | head -c 600`;

const USE_CASES = [
  {
    title: "Lead capture pipelines",
    text: "Form submission \u2192 CRM entry \u2192 Slack notification — the classic sales automation, ready to import.",
  },
  {
    title: "Content distribution",
    text: "RSS feed \u2192 AI summary \u2192 social post. Repurpose every article across channels automatically.",
  },
  {
    title: "Data sync",
    text: "Keep Google Sheets, Notion, and your database in sync without manual copy-paste.",
  },
  {
    title: "DevOps alerts",
    text: "Uptime monitors and error webhooks \u2192 Discord or PagerDuty alerts the moment something breaks.",
  },
  {
    title: "E-commerce order flow",
    text: "New order \u2192 invoice \u2192 fulfillment steps \u2192 customer update, chained in one workflow.",
  },
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

const RELATED_SLUGS: string[] = ["json-formatter", "base64-encoder-decoder", "qr-code-generator"];

export default function N8nWorkflowSearchPage() {
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
          Free n8n Workflow <em>Search</em> Online
        </h1>
        <p className="sec-sub mx-auto mt-4">Search free n8n workflows and automation templates by keyword — check complexity and import the JSON into n8n.</p>
      </header>

      <section aria-label="n8n workflow search tool">
        <ToolClient />
        <p
          className="text-center text-sm mt-5"
          style={{ color: "var(--muted)" }}
        >
          Free for normal use — 100 searches per day. If the live directory is
          down, results come from a weekly snapshot so search keeps working.
        </p>
      </section>

            <section className="mt-14">
        <p className="sec-label">About this tool</p>
        <h2 className="sec-title">
          About the <em>n8n Workflow Search</em>
        </h2>
        <div className="card p-6 mt-6">
          <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            n8n workflow search is how automation builders stop starting from a blank canvas. Instead of wiring nodes by hand, type what you want to automate — say, syncing form responses to a spreadsheet or posting RSS items to Slack — and this free search tool surfaces ready-made n8n workflow templates you can import as JSON in one click. Each result shows a complexity rating so beginners can start with simple two-node flows while advanced users jump straight into multi-branch automations with webhooks, code nodes, and error handling.
          </p>
          <p className="text-sm mt-4" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            The template library is maintained as a curated snapshot that is refreshed regularly, and entries marked with a snapshot badge come from that offline dataset rather than a live query — they still import into n8n exactly the same way. Freelancers reuse proven patterns across client projects, teams standardize their automations on tested templates, and learners study real workflows to understand how nodes connect. Every template is free to inspect and adapt, and importing is just a matter of copying the JSON into your n8n canvas.
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
        <p className="sec-label">API parameters</p>
        <h2 className="sec-title">
          The <em>endpoint</em>
        </h2>
        <p className="sec-sub mt-2">
          The same directory behind this tool is available as{" "}
          <code className="font-mono2 text-sm">GET /api/v1/n8n</code>.
        </p>
        <div className="card p-2 sm:p-4 mt-6 overflow-x-auto">
          <table className="param-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Type</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {PARAMS.map((r) => (
                <tr key={r.name}>
                  <td>
                    <code>{r.name}</code>
                  </td>
                  <td>
                    <code>{r.type}</code>
                  </td>
                  <td>{r.required}</td>
                  <td>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">Examples</p>
        <h2 className="sec-title">
          Try it in <em>code</em>
        </h2>
        <CodeBlock label="JavaScript — search templates" code={JS_EXAMPLE} />
        <CodeBlock label="cURL — list categories" code={CURL_EXAMPLE} />
      </section>

      <section className="mt-14">
        <p className="sec-label">Use cases</p>
        <h2 className="sec-title">
          Automations to <em>steal</em>
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

      <section className="card p-6 md:p-8 mt-14 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div>
          <p className="sec-label">For developers</p>
          <h2 className="sec-title">
            Use the <em>n8n Directory API</em> in your own app
          </h2>
          <p className="sec-sub mt-2">
            Search community n8n templates programmatically — categories,
            complexity, and trigger filters included.
          </p>
        </div>
        <a
          className="btn btn-primary shrink-0"
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(
            "API access: n8n Workflow Search"
          )}`}
        >
          Request API access
        </a>
      </section>

      <div className="notice mt-12 max-w-3xl mx-auto">
        <strong>Private by design.</strong> Search queries pass through our
        proxy to the workflow directory. We don&apos;t log what you search
        for or build a profile.
      </div>
    </main>
  );
}
