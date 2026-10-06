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

const tool = toolBySlug("wikipedia-to-pdf")!;

export const metadata = pageMeta({
  title: "Wikipedia to PDF Converter - Download Articles Free Online",
  description:
    "Convert any Wikipedia article to PDF free online. Paste the article link, get a clean, readable PDF with images and links — no sign-up, no watermark. Try now!",
  path: "/tools/wikipedia-to-pdf",
  keywords: [
    "Wikipedia to PDF",
    "download Wikipedia PDF",
    "Wikipedia article PDF",
    "save Wikipedia page",
    "Wikipedia converter",
  ],
});

const FAQS = [
  {
    q: "Is this Wikipedia to PDF converter really free?",
    a: "Yes. No signup, no watermark, and no cost — just a fair-use limit of 20 conversions per day so the tool stays fast for everyone.",
  },
  {
    q: "What happens if the PDF service is down?",
    a: "The page switches to fallback mode automatically: it loads the article directly from Wikipedia's public API into a print-styled view marked \u201cRendered from Wikipedia (fallback)\u201d, and you use Print / Save as PDF in your browser to create the file yourself.",
  },
  {
    q: "Does the PDF keep links, images, and formatting?",
    a: "Yes. The PDF has selectable text, headings, images, and working links — much cleaner than printing the article page from your browser.",
  },
  {
    q: "Which Wikipedia articles can I convert?",
    a: "Any article title works — enter it exactly as it appears on Wikipedia. The automatic fallback mode covers English Wikipedia; the print approach works with any language's article.",
  },
  {
    q: "Is saving Wikipedia articles as PDFs legal?",
    a: "Article text is published under the Creative Commons Attribution-ShareAlike (CC BY-SA) license, so you can save, print, and share it with attribution. The fallback view keeps the attribution line under every article.",
  },
  {
    q: "Do you store the articles I convert?",
    a: "No. Each conversion is generated per request and is not tied to an account. In fallback mode your browser talks to Wikipedia directly.",
  },
  {
    q: "Can I download a Wikipedia article as a PDF for free?",
    a: "Yes. Paste the article link and download a clean PDF with formatting, images, and links preserved — no account, no watermark, no cost.",
  },
  {
    q: "Is saving Wikipedia articles as PDFs legal?",
    a: "For personal use like offline reading and study, yes — Wikipedia content is published under a free license. Just respect the license terms if you republish the material.",
  },

];

const STEPS = [
  {
    title: "Enter the article title",
    text: "Type or paste the Wikipedia article title — for example, \u201cArtificial intelligence\u201d. Partial or exact titles both work.",
  },
  {
    title: "Generate the PDF",
    text: "Click Generate PDF. The article is fetched and converted into a clean PDF with selectable text and working links.",
  },
  {
    title: "Download or print",
    text: "Download your PDF. If the converter is busy, fallback mode loads the article from Wikipedia so you can print it to PDF yourself.",
  },
];

const PARAMS = [
  {
    name: "query",
    type: "string",
    required: "Yes",
    desc: "Wikipedia article title (spaces are auto-converted). Max 200 characters.",
  },
  {
    name: "response",
    type: "PDF stream",
    required: "\u2014",
    desc: "On success the endpoint returns an application/pdf stream — save it straight to disk.",
  },
  {
    name: "errors",
    type: "JSON",
    required: "\u2014",
    desc: "{ ok:false, error:{ code, message } }. Codes: MISSING_QUERY, QUERY_TOO_LONG, ARTICLE_NOT_FOUND, WIKIPDF_DOWN, RATE_LIMITED.",
  },
  {
    name: "rate limit",
    type: "\u2014",
    required: "\u2014",
    desc: "20 conversions per day per IP. Exceeding it returns HTTP 429 with a Retry-After header.",
  },
];

const JS_EXAMPLE = `// Convert a Wikipedia article to PDF and download it
const title = "Albert Einstein";
const res = await fetch(
  \`/api/v1/wikipdf?query=\${encodeURIComponent(title)}\`
);
const ct = res.headers.get("content-type") || "";
if (ct.includes("application/pdf")) {
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = \`Wikster-\${title.replace(/\\s+/g, "_")}.pdf\`;
  a.click();
} else {
  const { error } = await res.json();
  throw new Error(error.message); // ARTICLE_NOT_FOUND, WIKIPDF_DOWN, …
}`;

const CURL_EXAMPLE = `# The response is a PDF file, not JSON — save it straight to disk
curl -o wikster.pdf \\
  "https://yatools-tan.vercel.app/api/v1/wikipdf?query=Albert%20Einstein"`;

const USE_CASES = [
  {
    title: "Build study packs",
    text: "Convert the articles on your syllabus into offline PDFs and bundle them into an exam revision pack.",
  },
  {
    title: "Archive research sources",
    text: "Keep citable copies of the articles you reference in papers and reports.",
  },
  {
    title: "Print classroom handouts",
    text: "Get clean, ad-free versions of articles without Wikipedia's site chrome — ideal for handouts.",
  },
  {
    title: "Read on the go",
    text: "Save long articles before flights, commutes, or anywhere with spotty internet.",
  },
  {
    title: "Low-bandwidth reading",
    text: "One lightweight PDF beats reloading a heavy, script-laden article page on a slow connection.",
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

const RELATED_SLUGS: string[] = ["pdf-to-jpg", "text-to-pdf", "merge-pdf"];

export default function WikipediaToPdfPage() {
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
        <Link href="/tools" className="hover:underline">
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
          Free Wikipedia to <em>PDF</em> Online
        </h1>
        <p className="sec-sub mx-auto mt-4">A free Wikipedia to PDF converter: paste any article link and download a clean, readable PDF — no sign-up, no watermark.</p>
      </header>

      <section aria-label="Wikipedia to PDF tool">
        <ToolClient />
        <p
          className="text-center text-sm mt-5"
          style={{ color: "var(--muted)" }}
        >
          Content from{" "}
          <a
            href="https://www.wikipedia.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            Wikipedia
          </a>
          , CC BY-SA. Conversions are limited to 20 per day per user.
        </p>
      </section>

            <section className="mt-14">
        <p className="sec-label">About this tool</p>
        <h2 className="sec-title">
          About the <em>Wikipedia to PDF</em>
        </h2>
        <div className="card p-6 mt-6">
          <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            A Wikipedia to PDF converter saves any Wikipedia article as a clean, portable document you can read offline, print, or file away. Paste the article URL into this free online tool and get a properly formatted PDF that keeps the article's structure, images, and links intact — far more readable than a raw browser printout. Students build offline study packs, researchers archive reference material before it changes, travelers save destination guides for trips without connectivity, and teachers prepare handouts in seconds.
          </p>
          <p className="text-sm mt-4" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            If the primary PDF service is ever down, a fallback provider takes over automatically so your download still goes through. The PDFs carry no watermark and there is no account or payment step anywhere in the flow. Saving Wikipedia articles for personal, offline reading is fine — Wikipedia's content is freely licensed — but remember that articles evolve, so check the date on anything you cite. Nothing you convert is stored on any server.
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
          The same converter behind this tool is available as{" "}
          <code className="font-mono2 text-sm">GET /api/v1/wikipdf</code>.
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
        <CodeBlock label="JavaScript — download the PDF" code={JS_EXAMPLE} />
        <CodeBlock label="cURL — save straight to disk" code={CURL_EXAMPLE} />
      </section>

      <section className="mt-14">
        <p className="sec-label">Use cases</p>
        <h2 className="sec-title">
          Made for <em>real work</em>
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
            Use the <em>Wikipedia PDF API</em> in your own app
          </h2>
          <p className="sec-sub mt-2">
            One GET request returns a clean PDF of any Wikipedia article —
            free for reasonable use.
          </p>
        </div>
        <a
          className="btn btn-primary shrink-0"
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(
            "API access: Wikipedia to PDF"
          )}`}
        >
          Request API access
        </a>
      </section>

      <div className="notice mt-12 max-w-3xl mx-auto">
        <strong>Private by design.</strong> Your article title is sent to our
        converter only to fetch the article. We don&apos;t store your
        requests, and nothing is tied to an account.
      </div>
    </main>
  );
}
