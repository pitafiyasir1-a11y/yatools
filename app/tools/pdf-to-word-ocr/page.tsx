import PdfToWordOcrClient from "./ToolClient";
import Link from "next/link";
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
  slug: "pdf-to-word-ocr",
  name: "PDF to Word (OCR)",
  tagline: "A free PDF to Word OCR converter: turn scanned PDFs into editable Word docs with in-browser OCR — proofread the results.",
  description:
    "Scanned PDF to Word converter online: OCR turns scanned pages into a real editable .docx — free, private, and 100% in your browser.",
  category: "Screenshots & PDF",
  keyword: "scanned pdf to word converter",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "pdf-to-word-converter",
    "image-to-text",
    "text-to-pdf"
],
};

export const metadata = pageMeta({
  title: "PDF to Word OCR Converter - Scan to DOCX Free Online",
  description:
    "PDF to Word OCR converter, free online: extract text from scanned, image-based PDFs into an editable .docx in your browser. Proofread results. Try now!",
  path: "/tools/pdf-to-word-ocr",
  keywords: [
    "PDF to Word OCR",
    "OCR PDF to Word",
    "scanned PDF to Word",
    "image PDF to Word",
    "OCR converter",
  ],
});

const faqs = [
  {
    q: "What is the difference between this and the regular PDF to Word tool?",
    a: "A text-based PDF already contains selectable text — the regular PDF to Word tool extracts it directly and quickly. A scanned PDF is just pictures of pages, so there's no text to extract. This OCR version reads each page as an image and recognizes the characters, then builds an editable .docx from what it read. Use the regular tool for text PDFs and this one for scans.",
  },
  {
    q: "How accurate is the OCR?",
    a: "Accuracy depends on your scan: clean, high-contrast, straight scans of printed English text convert very well. Skewed pages, small fonts, blurry photos, handwriting, and complex tables will have errors — always proofread the result before using it for anything important.",
  },
  {
    q: "Do I need to upload my PDF anywhere?",
    a: "No. The PDF is rendered and OCR'd entirely inside your browser with pdf.js and tesseract.js. Your file never leaves your device, which makes this safe for sensitive documents.",
  },
  {
    q: "How long does it take?",
    a: "The first run downloads the OCR engine (about 15 MB), then it's cached and later runs start instantly. After that, expect roughly 10–30 seconds per page depending on your device — a 10-page scan takes a few minutes. Keep the tab open while it works.",
  },
  {
    q: "Can I convert only some pages?",
    a: "Yes — choose “Page range” and enter something like 1-5, 8. Skipping pages you don't need saves time, especially on long documents.",
  },
  {
    q: "Will the Word file keep the original layout?",
    a: "No. The output is editable text with page headings — not a pixel-perfect layout clone. OCR reads the words; it does not recreate fonts, columns, tables, or images. For faithful layout, scan quality text extraction is not the right approach; this tool is for getting the words editable.",
  },
];

const howTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert a scanned PDF to Word with OCR",
  description:
    "Turn a scanned PDF into an editable Word document using free browser-based OCR.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload your scanned PDF",
      text: "Drop the scanned PDF onto the upload area. It's read locally — never uploaded to a server.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose pages and start OCR",
      text: "Convert all pages or a range like 1-5, 8, then start. Each page is rendered and read by the OCR engine right in your browser.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Proofread and download",
      text: "Check the preview of the recognized text, then download the real .docx file and edit it in Word or Google Docs.",
    },
  ],
};

export default function PdfToWordOcrPage() {
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
          { name: "PDF to Word (OCR)", path: "/tools/pdf-to-word-ocr" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs
          trail={[{ name: "Home", href: "/" }, { name: "PDF to Word (OCR)" }]}
        />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free PDF to Word <em>OCR</em> Online
            </>
          }
          tagline="A free PDF to Word OCR converter: turn scanned PDFs into editable Word docs with in-browser OCR — proofread the results."
        />

        <PdfToWordOcrClient />
        <PrivacyNote>
          PDF rendering and OCR run 100% in your browser with pdf.js and tesseract.js. Your
          files never leave your device — safe for contracts, medical forms, and personal
          records.
        </PrivacyNote>

        <p
          className="font-mono2"
          style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 14 }}
        >
          For text-based PDFs use our{" "}
          <Link href="/tools/pdf-to-word-converter" style={{ color: "var(--red)", fontWeight: 700 }}>
            faster PDF to Word
          </Link>{" "}
          tool; for scanned or image PDFs, this OCR version is the right one. Not sure which
          you have? If you can't select the text with your mouse, it's scanned.
        </p>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What this OCR converter <em>does</em></>}
          sub="Plain facts about a tool that reads pictures of text."
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
              t: "Input: scanned PDF",
              d: "PDFs whose pages are images — old paper scans, photographed documents, camera-captured receipts. Up to 50 MB.",
            },
            {
              t: "Output: genuine editable .docx",
              d: "A real Word document with page headings and paragraphs — opens and edits cleanly in Word, Google Docs, and LibreOffice.",
            },
            {
              t: "Printed English only",
              d: "Recognition is tuned for clear printed English. Other languages, handwriting, and stylized fonts won't read well.",
            },
            {
              t: "Proofreading is part of the deal",
              d: "OCR guesses characters from pixels. Clean scans read near-perfectly; poor scans need a read-through. We say so up front.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>editable text</em></>} />
        <Steps
          steps={[
            {
              title: "Drop your scanned PDF",
              text: "The file is opened locally in your browser. Nothing is uploaded — not even to check the page count.",
            },
            {
              title: "OCR reads every page",
              text: "Each page renders at 150 DPI and the OCR engine recognizes its text, with live per-page progress (\"OCR page 3 of 12…\"). Pick all pages or a range.",
            },
            {
              title: "Download the .docx",
              text: "A genuine Word file is built with page headings and paragraphs. Proofread it, then edit it anywhere.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When OCR to Word <em>helps</em></>}
          sub="Scans stop being dead-ends."
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
              t: "Digitize paper archives",
              d: "Filing cabinets of printed reports, letters, and records become searchable, editable Word files instead of dusty paper.",
            },
            {
              t: "Reuse old contracts",
              d: "The original Word file is gone and only a scan survives? OCR it back into an editable document you can amend.",
            },
            {
              t: "Study from scanned books",
              d: "Turn scanned textbook chapters into text you can highlight, annotate, and quote in your own notes.",
            },
            {
              t: "Process photographed forms",
              d: "Snap a form with your phone, merge the photos into a PDF, and convert the whole batch to editable text at once.",
            },
            {
              t: "Quote old invoices",
              d: "Pull line items out of scanned invoices into Word instead of retyping numbers and descriptions by hand.",
            },
            {
              t: "Accessibility",
              d: "A screen reader can't read a picture of text. Converting the scan to real text makes the content accessible again.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Scanned PDF to Word <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["pdf-to-word-converter", "image-to-text", "text-to-pdf"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
