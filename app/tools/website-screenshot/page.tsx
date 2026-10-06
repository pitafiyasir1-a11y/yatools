import Link from "next/link";
import {
  SITE,
  pageMeta,
  toolBySlug,
  webAppJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  type ToolDef,
} from "@/lib/site";
import ToolClient from "./ToolClient";
import { ToolIcon } from "@/components/tool-icons";

function getTool() {
  const t = toolBySlug("website-screenshot");
  if (!t) throw new Error("Tool not found in registry: website-screenshot");
  return t;
}
const tool = getTool();

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

export const metadata = pageMeta({
  title: "Website Screenshot Tool - Capture Any URL Free Online",
  description:
    "Capture a full-page website screenshot free online — paste any URL, preview, and download the PNG. File-info lookup and capture history included. Try now!",
  path: "/tools/website-screenshot",
  keywords: [
    "website screenshot tool",
    "capture website screenshot",
    "URL screenshot online",
    "full page screenshot",
    "website screen grabber",
  ],
});

const STEPS = [
  {
    title: "Paste the page URL",
    text: "Copy any public link — with or without https:// — and paste it into the box above.",
  },
  {
    title: "Click Capture",
    text: "The page loads in a real browser and renders the full page, top to bottom.",
  },
  {
    title: "Download the PNG",
    text: "Preview the screenshot, download it as a PNG, or open the full-size image in a new tab.",
  },
];

const LIMITS: [string, string][] = [
  ["Input", "Any public http:// or https:// URL"],
  ["Output", "PNG image — full page, top to bottom"],
  ["File info check", "Preview the expected file type and size before capturing"],
  ["History", "Your last 10 captures are saved in this browser for one-click re-runs"],
  ["Render time", "Usually a few seconds; heavy pages can take ~20 seconds"],
  ["Viewport", "Desktop layout"],
  ["Not supported", "Pages behind a login, or sites that block automated browsers"],
];

const USE_CASES = [
  {
    title: "Client reports",
    text: "Attach a pixel-perfect capture of a homepage or landing page to proposals and progress reports.",
  },
  {
    title: "Design QA",
    text: "Compare staging vs. production pages side by side without taking manual screenshots.",
  },
  {
    title: "Page archiving",
    text: "Keep a visual record of a page before a redesign or a content change.",
  },
  {
    title: "Bug reports",
    text: "Show developers exactly what a page looked like when something broke.",
  },
  {
    title: "Competitor research",
    text: "Collect full-page captures of competitor sites for teardowns and mood boards.",
  },
];

const FAQS = [
  {
    q: "Is the website screenshot tool free?",
    a: "Yes. You can capture and download screenshots without signing up or paying anything.",
  },
  {
    q: "What format is the screenshot?",
    a: "Every capture downloads as a PNG image of the full page, from top to bottom.",
  },
  {
    q: "How long does a capture take?",
    a: "Most pages render in a few seconds. Very heavy pages with lots of scripts can take around 20 seconds.",
  },
  {
    q: "Why did my URL fail?",
    a: "The page may require a login, block automated browsers, or the URL may be mistyped. Double-check the address and try again.",
  },
  {
    q: "Do you store my screenshots?",
    a: "No. Screenshots are generated on request and never stored on our servers.",
  },
  {
    q: "Can I take a full-page screenshot of any website for free?",
    a: "Yes. Paste any public URL and you get a full-page PNG capture — top to bottom — with no sign-up, no watermark, and no daily cap on the tool itself.",
  },
  {
    q: "Is there a watermark on the screenshots?",
    a: "No. Every capture downloads as a clean PNG with nothing stamped on it, so it is safe to use in client reports, presentations, and documentation.",
  },

];

const RELATED_SLUGS: string[] = ["qr-code-generator", "text-to-pdf", "image-to-pdf"];

export default function WebsiteScreenshotPage() {
  return (
    <main className="wrap pt-10 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd(tool)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd(tool)) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Tools", path: "/tools" },
              { name: tool.name, path: `/tools/${tool.slug}` },
            ])
          ),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="font-mono2 text-xs mb-8 flex items-center gap-2"
        style={{ color: "var(--muted)" }}
      >
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/#tools" className="hover:underline">Tools</Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{tool.name}</span>
      </nav>

      <header className="text-center max-w-2xl mx-auto mb-10">
        <span aria-hidden="true" className="tool-icon tool-icon-lg" style={{ margin: "0 auto 16px" }}>
          <ToolIcon slug={tool.slug} />
        </span>
                <span className="eyebrow">
          <span className="dot" />
          Free tool
        </span>
        <h1 className="hero-title mt-4">
          Free Website Screenshot <em>Tool</em> Online
        </h1>
        <p className="sec-sub mx-auto mt-4">A free website screenshot tool: paste any public URL, capture the full page, and download a crisp PNG — no sign-up, no watermark.</p>
      </header>

      <section className="card p-5 sm:p-8 md:p-10" aria-label="Screenshot tool">
        <ToolClient />
      </section>
      <p
        className="font-mono2 text-xs mt-3 text-center"
        style={{ color: "var(--muted)" }}
      >
        Files are processed in real time and never stored.
      </p>

            <section className="mt-14">
        <p className="sec-label">About this tool</p>
        <h2 className="sec-title">
          About the <em>Website Screenshot Tool</em>
        </h2>
        <div className="card p-6 mt-6">
          <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            A website screenshot tool should do one thing perfectly: turn any public URL into a clean, full-page image in seconds. Paste a link and this free online website screenshot tool loads the page in a real browser, renders it top to bottom, and hands you a PNG you can download, preview full-size, or open in a new tab. Designers use it to archive client homepages before a redesign, QA teams capture staging versus production for bug reports, and marketers grab competitor landing pages for teardown decks — all without installing anything.
          </p>
          <p className="text-sm mt-4" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            Two extras set it apart. The file-info lookup tells you the expected file type and size before you capture, so there are no surprises. And your last ten captures are kept as a history right in your browser, making one-click re-runs of the same URLs effortless. Captures render in a desktop viewport and usually finish in a few seconds, though very heavy pages can take around twenty. Pages behind a login or sites that block automated browsers cannot be captured — that is a hard technical limit, not a paywall. Nothing you capture is stored on any server.
          </p>
        </div>
      </section>

<section className="mt-14">
        <p className="sec-label">Supported formats &amp; limits</p>
        <h2 className="sec-title">
          What it <em>handles</em>
        </h2>
        <div className="card p-2 sm:p-4 mt-6 overflow-x-auto">
          <table className="param-table">
            <thead>
              <tr>
                <th>Detail</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {LIMITS.map(([k, v]) => (
                <tr key={k}>
                  <td>
                    <strong>{k}</strong>
                  </td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <div className="font-display text-4xl" style={{ color: "var(--red)" }}>
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
        <div className="mt-4">
          {FAQS.map((f) => (
            <div key={f.q} className="faq-item">
              <h3 className="faq-q" style={{ cursor: "default" }}>
                {f.q}
              </h3>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">Related tools</p>
        <h2 className="sec-title">
          Keep <em>going</em>
        </h2>
        <div className="tool-grid mt-6">
          {RELATED_SLUGS.map((slug) => {
            const t = toolBySlug(slug);
            if (!t) return null;
            return (
              <Link
                key={slug}
                href={`/tools/${slug}`}
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
            );
          })}
        </div>
      </section>

      <section className="card p-6 md:p-8 mt-14 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div>
          <p className="sec-label">For developers</p>
          <h2 className="sec-title">
            Use the <em>Screenshot API</em> in your own app
          </h2>
          <p className="sec-sub mt-2">
            The same engine behind this tool is available as a simple API —
            pass a URL, get a PNG back.
          </p>
        </div>
        <a
          className="btn btn-primary shrink-0"
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(
            "API access: Website Screenshot"
          )}`}
        >
          Request API access
        </a>
      </section>
    </main>
  );
}
