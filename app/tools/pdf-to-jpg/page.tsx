import PdfToJpgClient from "./ToolClient";
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
  slug: "pdf-to-jpg",
  name: "PDF to JPG",
  tagline: "Turn every PDF page into a high-quality JPG image.",
  description:
    "Convert PDF pages to JPG images in your browser. Preview every page, download individually or all at once — free, no uploads.",
  category: "Screenshots & PDF",
  keyword: "pdf to jpg online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["image-to-pdf", "image-compressor", "image-converter"],
};

export const metadata = pageMeta({
  title: "PDF to JPG Online Free — Convert PDF Pages to Images",
  description:
    "Convert each PDF page to a high-quality JPG image for free. Preview pages, pick quality, download individually or all — in your browser.",
  path: "/tools/pdf-to-jpg",
  keywords: [
    "pdf to jpg online",
    "convert pdf pages to images",
    "pdf to image free",
    "extract pages as jpg",
  ],
});

const faqs = [
  {
    q: "How do I convert a PDF to JPG?",
    a: "Upload the PDF, choose image quality (standard 1×, high 2×, or extra 3×), and hit render. Every page becomes a JPG preview you can download one by one — or grab them all with the “Download all pages” button.",
  },
  {
    q: "What quality will the JPGs be?",
    a: "Pages render as white-background JPEGs at 92% quality. The 2× setting renders each page at double resolution, which stays crisp for presentations and prints. 3× is overkill for screens but useful if the image will be zoomed or printed large.",
  },
  {
    q: "Can I download all pages at once?",
    a: "Yes — the “Download all pages” button saves each page as its own JPG, one after another. Your browser may ask for permission when many downloads start; that's normal. (There's no ZIP option here, so each page is a separate file.)",
  },
  {
    q: "Will text stay sharp?",
    a: "At 2× the pages look sharp on screens and in slides. Vector PDFs (exported from Word, PowerPoint, design tools) render crisply at any setting. Scanned PDFs can't exceed their original scan resolution — a blurry scan becomes a blurry JPG.",
  },
  {
    q: "Is it free, and is my PDF private?",
    a: "Completely free, no sign-up, no watermark. Rendering happens in your browser with pdf.js — your PDF never leaves your device.",
  },
  {
    q: "My PDF has 200 pages. Will this work?",
    a: "It will, but expect it to take a while — pages render one by one on your device's main thread. For very long documents, try the 1× quality setting first; you can always re-render at higher quality.",
  },
];

export default function PdfToJpgPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/pdf-to-jpg" },
          { name: "PDF to JPG", path: "/tools/pdf-to-jpg" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "PDF to JPG" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              PDF to <em>JPG</em>
            </>
          }
          tagline="Turn each PDF page into a high-quality JPG image — preview, pick quality, download pages individually or all at once."
        />

        <PdfToJpgClient />
        <PrivacyNote>
          Pages are rendered on your device with pdf.js. Your PDF is never uploaded or stored anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>convert</em></>}
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
              d: "Any .pdf your browser can load. Password-protected files are rejected — remove the password first, then convert.",
            },
            {
              t: "Output",
              d: "One JPG per page at 92% quality with a white background, named yourfile-page-1.jpg, page-2.jpg, and so on.",
            },
            {
              t: "Quality levels",
              d: "1× for quick previews, 2× for crisp screens and slides (recommended), 3× for print-sized images. Higher = bigger files and slower rendering.",
            },
            {
              t: "Big documents",
              d: "Pages render one at a time on your device. Long PDFs take a few minutes — that's the price of keeping everything private and free.",
            },
          ].map((c) => (
            <div key={c.t} className="neu-card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>page images</em></>} />
        <Steps
          steps={[
            {
              title: "Upload your PDF",
              text: "Choose the PDF you want to convert. The tool reads it locally and counts the pages for you.",
            },
            {
              title: "Pick quality & render",
              text: "Select 1×, 2×, or 3× rendering quality, then render. Each page appears as a JPG preview with its file size.",
            },
            {
              title: "Download your images",
              text: "Save individual pages with their download buttons, or use “Download all pages” to save every page one after another.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When PDF-to-JPG <em>helps</em></>}
          sub="Sometimes a picture beats a document."
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
              t: "Slides from PDFs",
              d: "Drop a report page into PowerPoint or Google Slides as an image — no screenshot cropping, exact page layout preserved.",
            },
            {
              t: "Share on social media",
              d: "Turn a certificate, poster, or infographic page into a JPG you can post on Instagram, Facebook, or WhatsApp status.",
            },
            {
              t: "Embed in chat & docs",
              d: "Some chats and editors don't accept PDFs. A page-as-JPG pastes straight into WhatsApp, Discord, or a Word document.",
            },
            {
              t: "Quick previews",
              d: "Render a 50-page document's pages as images to skim thumbnails fast, then download only the pages you actually need.",
            },
          ].map((c) => (
            <div key={c.t} className="neu-card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>PDF to JPG <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["image-compressor", "image-converter", "image-resizer"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
