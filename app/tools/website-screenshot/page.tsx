import Link from "next/link";
import {
  SITE,
  pageMeta,
  toolBySlug,
  webAppJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from "@/lib/site";
import ToolClient from "./ToolClient";

function getTool() {
  const t = toolBySlug("website-screenshot");
  if (!t) throw new Error("Tool not found in registry: website-screenshot");
  return t;
}
const tool = getTool();

export const metadata = pageMeta({
  title: "Website Screenshot — Free Online | YATools",
  description:
    "Capture any public URL as a full-page PNG screenshot. Free online website screenshot tool — paste a link, preview, and download. No sign-up.",
  path: "/tools/website-screenshot",
  keywords: [
    "website screenshot online",
    "url to png",
    "full page screenshot",
    "capture website image",
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
];

export default function WebsiteScreenshotPage() {
  return (
    <main className="wrap pt-10 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd(tool)) }}
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
        <Link href="/tools" className="hover:underline">Tools</Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{tool.name}</span>
      </nav>

      <header className="text-center max-w-2xl mx-auto mb-10">
        <span className="eyebrow">
          <span className="dot" />
          Free tool
        </span>
        <h1 className="hero-title mt-4">
          Website <em>Screenshot</em>
        </h1>
        <p className="sec-sub mx-auto mt-4">{tool.tagline}</p>
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
          {tool.related.map((slug) => {
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
