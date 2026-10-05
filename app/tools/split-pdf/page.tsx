import SplitPdfClient from "./ToolClient";
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
  SITE,
} from "@/lib/site";

const tool: ToolDef = {
  slug: "split-pdf",
  name: "Split PDF",
  tagline: "Extract pages, page ranges, or split a PDF into parts.",
  description:
    "Split a PDF into separate files: extract page ranges, split every N pages, or pick individual pages — all in your browser, free.",
  category: "Screenshots & PDF",
  keyword: "split pdf online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["merge-pdf", "rotate-pdf", "compress-pdf"],
};

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Split PDF — YATools",
    url: `${SITE.url}/tools/split-pdf`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Split PDF free online — extract page ranges, split every N pages, or pick individual pages. In-browser, private, no sign-up needed. Try it free right now!",
  };
}

export const metadata = pageMeta({
  title: "Split PDF Online Free - Extract Pages & Ranges Fast",
  description:
    "Split PDF free online — extract page ranges, split every N pages, or pick individual pages. In-browser, private, no sign-up needed. Try it free right now!",
  path: "/tools/split-pdf",
  keywords: [
    "split pdf online",
    "split PDF",
    "extract pages from PDF",
    "PDF splitter",
    "separate PDF pages",
  ],
});

const faqs = [
  {
    q: "How do I extract specific pages from a PDF?",
    a: "Choose the “Page ranges” mode and type what you want, like 1-3, 5, 8-10. The tool pulls exactly those pages into a new PDF. Use “Pick pages” to tick pages visually instead.",
  },
  {
    q: "Can I split a PDF into equal parts?",
    a: "Yes — use the “Every N pages” mode. Set N to 5 and a 23-page PDF becomes five files of 5, 5, 5, 5, and 3 pages. Each part downloads as its own PDF.",
  },
  {
    q: "Is splitting a PDF free here?",
    a: "Completely free, with no page or file-count limits, no sign-up, and no watermark. The work happens in your browser tab.",
  },
  {
    q: "Will the extracted pages lose quality?",
    a: "No. Pages are copied at full fidelity — text stays selectable, images keep their resolution, and the layout is unchanged.",
  },
  {
    q: "What if my PDF is password-protected?",
    a: "Encrypted PDFs can't be read by the browser, so they're rejected. Open the file with its password first and save an unlocked copy, then split that.",
  },
  {
    q: "Is my document private?",
    a: "Yes. Your PDF is processed locally in your browser and never uploaded or stored. You can split confidential documents with confidence.",
  },
  {
    q: "Can I extract just one page from a PDF for free?",
    a: "Yes. Select the single page you want, extract it, and download it as its own PDF — the rest of the document stays untouched.",
  },

];

export default function SplitPdfPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/split-pdf" },
          { name: "Split PDF", path: "/tools/split-pdf" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Split PDF" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Split <em>PDF</em> Online
            </>
          }
          tagline="A free PDF splitter: pull out the pages you need — extract ranges, split every N pages, or pick individual ones."
        />

        <SplitPdfClient />
        <PrivacyNote>
          Splitting runs on your device with pdf-lib. Your PDF never leaves your browser.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Split PDF</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            Splitting a PDF breaks one document into the pieces you actually need. Upload a PDF to this free online tool and extract a page range like pages 5 to 12, split the document into equal parts every N pages, or hand-pick individual pages for separate files. Students pull single chapters from a course pack, professionals extract the signed page from a contract, and anyone trimming a bloated report keeps only what matters.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Extracted pages keep their original quality — splitting copies pages rather than re-rendering them, so text stays sharp and images untouched. The whole operation runs in your browser, meaning sensitive documents never travel to a server. Password-protected PDFs need to be unlocked first; the tool will not bypass document security, and that is a deliberate guarantee.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>split</em></>}
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
              d: "Any .pdf file your browser can load. Extremely large files (hundreds of MB) may be slow — split those on a desktop with plenty of memory.",
            },
            {
              t: "Output",
              d: "One or more new PDFs containing exactly the pages you picked, copied at full quality — text stays selectable.",
            },
            {
              t: "Page ranges",
              d: "Numbers and ranges like 1-3, 5, 8-10. Out-of-range or malformed entries are rejected with a clear message, never silently skipped.",
            },
            {
              t: "Encrypted files",
              d: "Password-protected PDFs can't be split until you remove the password with a password you know.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>split pages</em></>} />
        <Steps
          steps={[
            {
              title: "Upload your PDF",
              text: "Choose the PDF you want to split. The tool reads it locally and tells you how many pages it has.",
            },
            {
              title: "Pick a split mode",
              text: "Type page ranges, split every N pages, or tick individual pages from the visual grid — whichever fits the job.",
            },
            {
              title: "Download the results",
              text: "Each output is a separate PDF you can download right away. Split parts are numbered in order.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When splitting <em>helps</em></>}
          sub="Keep the pages you need, lose the rest."
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
              t: "Extract a chapter",
              d: "Pull pages 45–78 out of a 300-page textbook and carry only the chapter you're studying — lighter file, faster phone.",
            },
            {
              t: "Share one invoice",
              d: "A yearly statement PDF holds twelve invoices; extract the one your client actually asked for instead of emailing all twelve.",
            },
            {
              t: "Remove blank or junk pages",
              d: "Scanners love adding blank pages and separator sheets. Pick the real pages and export a clean copy.",
            },
            {
              t: "Break up huge manuals",
              d: "Split a 500-page manual into per-section PDFs so each file is small enough to email or attach to a ticket.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Split PDF <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["merge-pdf", "rotate-pdf", "compress-pdf"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
