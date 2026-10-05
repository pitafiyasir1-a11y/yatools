import RotatePdfClient from "./ToolClient";
import {
  Breadcrumbs,
  ToolHero,
  Steps,
  FaqList,
  RelatedTools,
  PrivacyNote,
  SectionHead,
  ApiCta,
  JsonLd,
} from "../tool-parts";
import {
  pageMeta,
  faqJsonLd,
  webAppJsonLd,
  breadcrumbJsonLd,
  type ToolDef,
} from "@/lib/site";

const tool: ToolDef = {
  slug: "rotate-pdf",
  name: "Rotate PDF",
  tagline: "Rotate all or selected PDF pages 90°, 180°, or 270°.",
  description:
    "Fix sideways or upside-down PDF pages: rotate every page or just the ones you pick — in your browser, free.",
  category: "Screenshots & PDF",
  keyword: "rotate pdf online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["merge-pdf", "split-pdf", "compress-pdf"],
};

export const metadata = pageMeta({
  title: "Rotate PDF Online Free — Fix Sideways Pages",
  description:
    "Rotate PDF pages 90°, 180°, or 270° for free. Rotate all pages or pick specific ones — 100% in your browser, no sign-up.",
  path: "/tools/rotate-pdf",
  keywords: [
    "rotate pdf online",
    "rotate pdf pages free",
    "fix sideways pdf",
    "rotate pdf 90 degrees",
  ],
});

const faqs = [
  {
    q: "How do I rotate a PDF?",
    a: "Upload the PDF, choose “All pages” or type the pages you want (like 1, 3, 5-8), then click 90° clockwise, 90° counter-clockwise, or 180°. Download the corrected file — done in seconds.",
  },
  {
    q: "Can I rotate only some pages?",
    a: "Yes. Pick “Choose pages” and type page numbers and ranges, e.g. 2, 5-7. Only those pages rotate; the rest stay exactly as they were.",
  },
  {
    q: "Does rotation reduce quality?",
    a: "No. Rotation just changes each page's orientation flag — no recompression, no re-rendering. Text, images, and layout are byte-for-byte identical, only turned.",
  },
  {
    q: "My scanned pages came out sideways. Will this fix them?",
    a: "That's exactly what this is for. Scanners often save pages in the wrong orientation; rotate them once and save a corrected copy. (If every page needs a different direction, rotate in a few passes.)",
  },
  {
    q: "Is it free, and is my file private?",
    a: "Completely free — no sign-up, no watermark, no limits. Rotation happens in your browser with pdf-lib, so your PDF never leaves your device.",
  },
  {
    q: "What if my PDF is password-protected?",
    a: "Encrypted PDFs can't be processed by the browser, so they're rejected. Open the file with its password and save an unlocked copy first, then rotate.",
  },
];

export default function RotatePdfPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/rotate-pdf" },
          { name: "Rotate PDF", path: "/tools/rotate-pdf" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Rotate PDF" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Rotate <em>PDF</em> pages
            </>
          }
          tagline="Fix sideways or upside-down pages — rotate all pages or just the ones you pick, 90°, 180°, or 270°."
        />

        <RotatePdfClient />
        <PrivacyNote>
          Rotation runs on your device with pdf-lib. Your PDF never leaves your browser.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>rotate</em></>}
          sub="Straightforward limits, stated plainly."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {[
            {
              t: "Input",
              d: "Any .pdf your browser can load. Password-protected files are rejected — remove the password first.",
            },
            {
              t: "Rotation angles",
              d: "90° clockwise, 90° counter-clockwise, or 180° upside-down. Rotations add up: two 90° clicks equal 180°.",
            },
            {
              t: "Page selection",
              d: "Rotate everything at once, or type specific pages like 1, 3, 5-8. Bad or out-of-range entries are rejected with a clear message.",
            },
            {
              t: "Quality",
              d: "Lossless — rotation changes orientation metadata only. No recompression, no quality loss, ever.",
            },
          ].map((c) => (
            <div key={c.t} className="neu-card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>straight pages</em></>} />
        <Steps
          steps={[
            {
              title: "Upload your PDF",
              text: "Choose the PDF with wrongly-oriented pages. The tool reads it locally and shows the page count.",
            },
            {
              title: "Pick pages & direction",
              text: "Rotate all pages at once, or select specific ones. Click 90°, counter-clockwise, or 180° — rotations stack.",
            },
            {
              title: "Download the fixed PDF",
              text: "Save the corrected file. Pages keep full quality because rotation never recompresses anything.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When rotation <em>helps</em></>}
          sub="Sideways scans happen to everyone."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {[
            {
              t: "Fix scanned documents",
              d: "Scanner output often lands sideways or upside-down. Rotate once and save a corrected copy that reads normally.",
            },
            {
              t: "Mixed-orientation reports",
              d: "Landscape charts mixed into a portrait report? Rotate just those pages so the whole document reads in one flow.",
            },
            {
              t: "Phone photos to PDF",
              d: "Photos taken in landscape mode can export portrait pages. Fix the orientation before sharing or printing.",
            },
            {
              t: "Presentation handouts",
              d: "Rotate wide slides back to landscape inside a handout PDF so they print at full size instead of shrunk.",
            },
          ].map((c) => (
            <div key={c.t} className="neu-card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Rotate PDF <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["text-to-pdf", "word-counter", "qr-code-generator"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
