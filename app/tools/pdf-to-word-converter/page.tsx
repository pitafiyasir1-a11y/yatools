import PdfToWordClient from "./ToolClient";
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
  slug: "pdf-to-word-converter",
  name: "PDF to Word Converter",
  tagline: "A free PDF to Word converter: turn any text-based PDF into a real, editable .docx — in your browser, no sign-up.",
  description:
    "Convert PDF to Word online for free: extract editable text into a genuine .docx document right in your browser. Private, fast, no sign-up.",
  category: "Screenshots & PDF",
  keyword: "pdf to word converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "word-to-pdf-converter",
    "text-to-pdf",
    "pdf-to-jpg"
],
};

export const metadata = pageMeta({
  title: "PDF to Word Converter - Convert PDFs to DOCX Free Online",
  description:
    "PDF to Word converter, free online: extract editable text from any text-based PDF into a real .docx in your browser. No uploads, no sign-up. Try it now!",
  path: "/tools/pdf-to-word-converter",
  keywords: [
    "PDF to Word",
    "PDF to Word converter",
    "convert PDF to Word",
    "PDF to DOCX",
    "PDF converter",
  ],
});

const faqs = [
  {
    q: "Is this a real Word file or just a renamed PDF?",
    a: "It's a real, editable .docx file built with the industry-standard docx library. You can open it in Microsoft Word, Google Docs, or LibreOffice and edit every word.",
  },
  {
    q: "Will my document look exactly like the PDF?",
    a: "No — this is a text-based conversion, not a layout clone. Text, page order, and basic structure are preserved, but complex layouts, columns, tables, images, and exact fonts will not transfer pixel-perfectly.",
  },
  {
    q: "Can it convert scanned PDFs?",
    a: "No. Scanned PDFs are photos of pages, not text — extracting text from them requires OCR, which this tool doesn't do. The tool tells you clearly when a page has no extractable text.",
  },
  {
    q: "Is there a file size limit?",
    a: "No server-side limit because there is no server involved — everything runs in your browser. Very large PDFs (hundreds of pages) may take a minute and use more memory, so keep tabs light for the biggest files.",
  },
  {
    q: "Is my PDF uploaded anywhere?",
    a: "Never. The PDF is read and converted entirely inside your browser with pdf.js and the docx library. Close the tab and nothing remains on any server.",
  },
];

const howTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert PDF to Word online",
  description:
    "Extract editable text from a PDF and save it as a genuine .docx Word document, free and private.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload your PDF",
      text: "Drop your PDF onto the upload area or click to choose it from your device.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Extract the text",
      text: "The tool reads every page in your browser and pulls out the text, page by page.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Download the Word file",
      text: "Download the generated .docx file and open it in Word, Google Docs, or LibreOffice to edit it.",
    },
  ],
};

export default function PdfToWordPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd data={howTo} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/pdf-to-word-converter" },
          { name: "PDF to Word Converter", path: "/tools/pdf-to-word-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "PDF to Word Converter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free PDF to <em>Word Converter</em> Online
            </>
          }
          tagline="A free PDF to Word converter: turn any text-based PDF into a real, editable .docx — in your browser, no sign-up."
        />

        <PdfToWordClient />
        <PrivacyNote>
          Text extraction and DOCX generation run 100% in your browser with pdf.js and the docx
          library. Your files never leave your device.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What this converter <em>does</em></>}
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
              t: "Input: PDF",
              d: "Any text-based PDF — reports, articles, ebooks, invoices. Password-protected or corrupted PDFs can't be opened.",
            },
            {
              t: "Output: genuine .docx",
              d: "A real Word document with editable paragraphs and page headings — opens in Word, Google Docs, and LibreOffice.",
            },
            {
              t: "Text-based, not pixel-perfect",
              d: "Editable text transfers; exact layouts, tables, images, and fonts don't. For layout-faithful output, a desktop office suite is still better.",
            },
            {
              t: "No OCR",
              d: "Scanned pages (photos of text) have no extractable text. The tool flags these pages instead of inventing words.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>editable</em></>} />
        <Steps
          steps={[
            {
              title: "Drop your PDF",
              text: "Drag the file onto the upload area or click to choose it. It's read locally — never uploaded.",
            },
            {
              title: "Text gets extracted",
              text: "Every page is read in your browser and its text pulled out, page by page, with a live progress bar.",
            },
            {
              title: "Download the DOCX",
              text: "Get a real, editable .docx file with page headings. Open it in Word or Google Docs and edit away.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When this converter <em>helps</em></>}
          sub="Everyday moments a locked PDF stands in your way."
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
              t: "Reuse report text",
              d: "Pull paragraphs out of a PDF report to quote or rework them in a document you're writing — no retyping.",
            },
            {
              t: "Fix an invoice",
              d: "The invoice PDF has a wrong address and the original file is gone? Extract the text, correct it, and re-save.",
            },
            {
              t: "Repurpose ebook content",
              d: "Turn reference PDFs and manuals into editable drafts you can rearrange, summarize, or translate.",
            },
            {
              t: "Submit editable assignments",
              d: "Some portals demand .docx uploads. Convert your PDF draft and submit the editable file it asks for.",
            },
            {
              t: "Audit a long document",
              d: "Extract the full text of a contract or paper, then search, annotate, and comment on it in Word.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>PDF to Word <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["word-to-pdf-converter", "text-to-pdf", "pdf-to-jpg"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
