import WordToPdfClient from "./ToolClient";
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
import { softwareAppJsonLd } from "../_conv-shared/seo";

const tool: ToolDef = {
  slug: "word-to-pdf-converter",
  name: "Word to PDF Converter",
  tagline: "A free Word to PDF converter: turn any .docx into a clean PDF with your browser's print engine — no sign-up.",
  description:
    "Convert Word to PDF online for free: render your .docx in the browser and save it as PDF via print. Private, fast, no sign-up.",
  category: "Screenshots & PDF",
  keyword: "word to pdf converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "pdf-to-word-converter",
    "text-to-pdf",
    "pdf-to-jpg"
],
};

export const metadata = pageMeta({
  title: "Word to PDF Converter - Convert DOCX to PDF Free Online",
  description:
    "Word to PDF converter, free online: turn any .docx into a clean, printable PDF with your browser's print engine. No sign-up, no watermark. Try it now!",
  path: "/tools/word-to-pdf-converter",
  keywords: [
    "Word to PDF",
    "Word to PDF converter",
    "DOCX to PDF",
    "convert Word to PDF",
    "Word document to PDF",
  ],
});

const faqs = [
  {
    q: "How does the conversion work?",
    a: "Your .docx is rendered right in your browser, and the conversion uses your browser's built-in print engine — you choose “Save as PDF” in the print dialog. No servers, no uploads, no waiting in a queue.",
  },
  {
    q: "Will the PDF look like my Word document?",
    a: "Yes, for typical documents — headings, paragraphs, tables, images, and page breaks carry over. Very complex layouts (floating objects, intricate headers/footers) may render slightly differently than in desktop Word.",
  },
  {
    q: "Which Word files are supported?",
    a: "Modern .docx files (Word 2007 and later, Google Docs exports, LibreOffice exports). Old .doc files and password-protected documents are not supported — re-save as .docx first.",
  },
  {
    q: "Do I need Microsoft Word installed?",
    a: "No. The whole conversion happens in your browser. You don't need Word, a Microsoft account, or any software installed.",
  },
  {
    q: "Is my document uploaded anywhere?",
    a: "Never. Rendering and PDF creation happen entirely on your device. The document is discarded the moment you leave the page.",
  },
];

const howTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert Word to PDF online",
  description:
    "Render a .docx in your browser and save it as a PDF using the built-in print engine.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload your Word file",
      text: "Drop your .docx onto the upload area or click to choose it. It's rendered locally.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Check the preview",
      text: "Review the rendered document below the uploader to confirm it looks right.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Save as PDF",
      text: "Click “Print / Save as PDF” and choose “Save as PDF” in the print dialog.",
    },
  ],
};

export default function WordToPdfPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd data={howTo} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/word-to-pdf-converter" },
          { name: "Word to PDF Converter", path: "/tools/word-to-pdf-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Word to PDF Converter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Word to <em>PDF Converter</em> Online
            </>
          }
          tagline="A free Word to PDF converter: turn any .docx into a clean PDF with your browser's print engine — no sign-up."
        />

        <WordToPdfClient />
        <PrivacyNote>
          Your Word document is rendered 100% in your browser with docx-preview and converted by
          your browser's print engine. Nothing is ever uploaded.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What this converter <em>handles</em></>}
          sub="Plain facts, no fine print."
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
              t: "Input: .docx",
              d: "Modern Word files from Word, Google Docs, or LibreOffice. Old .doc and password-protected files aren't supported.",
            },
            {
              t: "Output: PDF via print",
              d: "Your browser's own “Save as PDF” produces the file — the same engine used for printing any web page, sharp and reliable.",
            },
            {
              t: "Faithful for normal documents",
              d: "Headings, text, tables, lists, images, and page breaks carry over cleanly. Exotic floating layouts may shift slightly.",
            },
            {
              t: "No limits, no queue",
              d: "No file-size cap on our side, no daily quota, no account. Convert as many documents as you like.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>PDF</em></>} />
        <Steps
          steps={[
            {
              title: "Drop your .docx",
              text: "Drag the file onto the upload area or click to choose it. It renders in your browser — nothing uploads.",
            },
            {
              title: "Preview the pages",
              text: "Scroll through the rendered document below to confirm headings, tables, and images look right.",
            },
            {
              title: "Save as PDF",
              text: "Hit “Print / Save as PDF” and pick “Save as PDF” in the dialog. Choose your folder and done.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When this converter <em>helps</em></>}
          sub="The moments a .docx just won't do."
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
              t: "Job applications",
              d: "Resumes and cover letters land better as PDFs — they look identical on every recruiter's screen, no font surprises.",
            },
            {
              t: "Official submissions",
              d: "Government portals, universities, and courts usually demand PDF. Convert your Word draft in seconds.",
            },
            {
              t: "Sharing without edits",
              d: "Send a contract or proposal as a PDF so the wording can't be quietly changed before it's signed.",
            },
            {
              t: "No Word installed",
              d: "Someone sent you a .docx and your machine has no office suite? Convert and read it as a PDF instead.",
            },
            {
              t: "Printing anywhere",
              d: "PDFs print consistently at copy shops and office printers; .docx files can reflow on unfamiliar machines.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Word to PDF <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["pdf-to-word-converter", "text-to-pdf", "pdf-to-jpg"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
