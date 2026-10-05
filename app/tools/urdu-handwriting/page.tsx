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
  const t = toolBySlug("urdu-handwriting");
  if (!t) throw new Error("Tool not found in registry: urdu-handwriting");
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
  title: "Urdu Handwriting Generator - Convert Text Free Online",
  description:
    "Convert Urdu text to realistic handwriting free online. Type in Urdu, pick paper and ink styles, and download handwritten notes as an image or PDF. Try now!",
  path: "/tools/urdu-handwriting",
  keywords: [
    "Urdu handwriting",
    "Urdu text to handwriting",
    "handwritten Urdu",
    "Urdu notes generator",
    "Urdu writing tool",
  ],
});

const STEPS = [
  {
    title: "Type your text",
    text: "English, Urdu, or a mix — up to 4,000 characters per render.",
  },
  {
    title: "Pick a handwriting style",
    text: "14 fonts including 4 Urdu right-to-left styles, ink colors, size, and ruled or plain paper.",
  },
  {
    title: "Download the pages",
    text: "Long text flows onto multiple A4 pages automatically. Download each page as a PNG.",
  },
];

const LIMITS: [string, string][] = [
  ["Output", "PNG images, A4 proportions"],
  ["Fonts", "14 handwriting fonts, including 4 Urdu right-to-left styles"],
  ["Ink", "7 pen colors plus any custom hex color"],
  ["Size", "16–80 px handwriting size"],
  ["Pages", "Long text automatically flows onto multiple pages"],
  [
    "Rendering",
    "Primary mode runs entirely in your browser — nothing is uploaded",
  ],
];

const USE_CASES = [
  {
    title: "Study notes",
    text: "Turn typed summaries into handwriting-style notes for revision.",
  },
  {
    title: "Assignments",
    text: "Give typed work a handwritten look on ruled paper.",
  },
  {
    title: "Urdu notes",
    text: "Write Urdu notes in Nastaliq-style handwriting, right-to-left.",
  },
  {
    title: "Quotes & cards",
    text: "Create hand-lettered style quotes for posts and greeting cards.",
  },
  {
    title: "Worksheets",
    text: "Make practice sheets that look handwritten for students.",
  },
  {
    title: "Journaling",
    text: "Draft journal entries with a personal, handwritten feel.",
  },
];

const FAQS = [
  {
    q: "Is the handwriting generator free?",
    a: "Yes. Type your text, style it, and download the PNG pages without signing up or paying anything.",
  },
  {
    q: "Does it support Urdu?",
    a: "Yes. Four fonts — Nastaliq, Gulzar, Naskh and Lateef — render Urdu right-to-left automatically when you select them.",
  },
  {
    q: "Is my text uploaded anywhere?",
    a: "No. The primary mode draws everything on a canvas in your browser, so your text never leaves your device.",
  },
  {
    q: "What is “Render via API instead”?",
    a: "An alternative server-side render of the same text with the same font, color, and paper options. Useful if the browser preview doesn't load a font correctly.",
  },
  {
    q: "Can I change the paper and ink?",
    a: "Yes — choose ruled notebook paper or a plain sheet, pick from 7 pen colors or enter any custom hex color, and set the handwriting size from 16 to 80 px.",
  },
  {
    q: "Do you store my text?",
    a: "No. Everything is rendered on the spot and nothing is stored.",
  },
  {
    q: "Can I convert Urdu text to handwriting online for free?",
    a: "Yes. Type or paste Urdu text and get realistic handwritten-style output instantly — no sign-up, no watermark, and your text stays in your browser.",
  },
  {
    q: "Can I download my handwritten Urdu notes as a PDF?",
    a: "Yes. Export your notes as a printable PDF for assignments and worksheets, or as an image to share on WhatsApp and social media.",
  },

];

const RELATED_SLUGS: string[] = ["text-to-pdf", "wikipedia-to-pdf", "word-counter"];

export default function UrduHandwritingPage() {
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
        <Link href="/tools" className="hover:underline">Tools</Link>
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
          Free Urdu <em>Handwriting</em> Online
        </h1>
        <p className="sec-sub mx-auto mt-4">A free Urdu handwriting generator: type Urdu text and get realistic handwritten notes on styled paper — download as image or PDF.</p>
      </header>

      <section className="card p-5 sm:p-8 md:p-10" aria-label="Handwriting tool">
        <ToolClient />
      </section>
      <p
        className="font-mono2 text-xs mt-3 text-center"
        style={{ color: "var(--muted)" }}
      >
        Rendered in your browser — nothing is uploaded or stored.
      </p>

            <section className="mt-14">
        <p className="sec-label">About this tool</p>
        <h2 className="sec-title">
          About the <em>Urdu Handwriting</em>
        </h2>
        <div className="card p-6 mt-6">
          <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            An Urdu handwriting generator turns typed Urdu text into realistic handwritten notes — perfect for students preparing assignments, teachers making worksheets, and anyone who wants the warmth of handwriting without picking up a pen. Type or paste your Urdu text into this free online tool, choose from paper and ink styles, and watch your words render in natural, flowing Urdu script. The interface is in simple English so anyone can use it, and the rendering happens primarily on a client-side canvas, which means your text never has to leave your device.
          </p>
          <p className="text-sm mt-4" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            Handwritten-style notes are easier on the eyes for long study sessions and look far more personal for letters, quotes, and classroom materials than plain typed text. You can fine-tune the look with different paper backgrounds and ink colors, then export the result as an image to share or a PDF to print. Because the main engine runs in your browser, generation is instant and private; an optional API render mode exists for a different handwriting style when you want variety.
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
            Use the <em>Handwriting API</em> in your own app
          </h2>
          <p className="sec-sub mt-2">
            The same engine behind this tool is available as a simple API —
            send text, get a handwriting image back.
          </p>
        </div>
        <a
          className="btn btn-primary shrink-0"
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(
            "API access: Urdu Handwriting"
          )}`}
        >
          Request API access
        </a>
      </section>
    </main>
  );
}
