import TextToPdfClient from "./ToolClient";
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
  toolBySlug,
  SITE,
} from "@/lib/site";

const tool = toolBySlug("text-to-pdf")!;

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Text to PDF — YATools",
    url: `${SITE.url}/tools/text-to-pdf`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Convert text to PDF free online — write or paste text, style it with a formatting toolbar, set page layout, and download a clean PDF. No watermark. Try now!",
  };
}

export const metadata = pageMeta({
  title: "Text to PDF Converter - Create Styled PDFs Free Online",
  description:
    "Convert text to PDF free online — write or paste text, style it with a formatting toolbar, set page layout, and download a clean PDF. No watermark. Try now!",
  path: "/tools/text-to-pdf",
  keywords: [
    "text to PDF",
    "text to PDF converter",
    "create PDF from text",
    "text to PDF maker",
    "convert text to PDF",
  ],
});

const faqs = [
  {
    q: "How do I turn text into a PDF here?",
    a: "Type or paste your text into the editor — each chunk is a block you can style with the toolbar: H1/H2/H3 headings, bold, italic, alignment, font size, and bullet lists. The live preview shows exactly how it will look. Set a filename and page size (A4 or Letter), then press Download PDF.",
  },
  {
    q: "How do headings and formatting work?",
    a: "Click any block to select it, then use the toolbar: H1/H2/H3 turn it into a heading, B and I toggle bold and italic, and you can change alignment and font size per block. Press Enter inside a paragraph to split it into two blocks; empty a block and hit Backspace to remove it.",
  },
  {
    q: "Can I control the page layout?",
    a: "Yes. Choose A4 or Letter page size, set the document title and filename, and style each block with its own font size (10–16pt) and alignment — left, center, or justified. Documents use 1-inch margins and paginate automatically across multiple pages.",
  },
  {
    q: "Is the PDF watermarked or limited?",
    a: "No watermark, no page limit, no account. Other “free” converters gate you after a few pages or stamp their logo — this one just hands you the file.",
  },
  {
    q: "Does the preview match the downloaded PDF?",
    a: "Very closely. Both are generated from the same block model — headings, bold/italic, alignment, bullet lists, and font sizes carry over. Minor differences can appear because the PDF uses the Helvetica font while the preview uses your system font stack.",
  },
  {
    q: "Is my text private?",
    a: "Yes. The PDF is built entirely inside your browser with an open-source PDF library. Your words never leave your device, so it's safe for contracts, journals, and unpublished work.",
  },
  {
    q: "How do I convert text to PDF without a watermark?",
    a: "Paste or write your text here, style it, and download — the PDF comes out clean with no watermark, no account, and no page limits.",
  },

];

const useCases = [
  {
    t: "Cover letters & resumes",
    d: "Draft in any editor, paste here, turn section titles into H1/H2 headings with the toolbar, and export a clean PDF ready to attach to a job application — no word processor needed.",
  },
  {
    t: "Homework & study notes",
    d: "Students paste revision notes, split topics into headed blocks, bold the key terms, and download a printable PDF that's far easier to read than a wall of plain text.",
  },
  {
    t: "Minutes of meetings",
    d: "Turn a running meeting log into a shareable PDF in one click. Headings separate agenda items, bullet lists hold the action points, and the title field becomes the document header.",
  },
  {
    t: "Scripts & manuscripts",
    d: "Writers and video creators convert drafts to PDF for sharing with editors or collaborators — justified alignment and real headings give it a typeset feel.",
  },
  {
    t: "Quick receipts & notices",
    d: "Need a simple printable notice, packing list, or receipt text as a PDF? Type it as bullet blocks, download, print. Faster than opening a word processor.",
  },
];

export default function TextToPdfPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/word-counter" },
          { name: "Text to PDF", path: "/tools/text-to-pdf" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Text to PDF" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Text to <em>PDF</em> Online
            </>
          }
          tagline="A free text to PDF converter: write or paste text, style it with a real formatting toolbar, and download a clean, watermark-free PDF."
        />

        <TextToPdfClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your text is never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Text to PDF</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A text to PDF converter turns plain words into a proper document. Write or paste your text into this free online tool, style it with a real formatting toolbar — headings, bold, italics, lists — set the page size, orientation, and margins, and download a clean PDF that looks the way you designed it. Students submit formatted assignments, freelancers create simple invoices and quotes, writers export clean manuscripts, and anyone can turn meeting notes into a shareable file in under a minute.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The live preview shows exactly what the downloaded PDF will look like, so there are no layout surprises. Unlike many converters, the output carries no watermark and there are no page limits or accounts standing between you and the download. Everything is generated in your browser, which means your text is never uploaded or stored — safe for drafts, contracts, and personal documents.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your PDF</em></>} />
        <Steps
          steps={[
            {
              title: "Write or paste",
              text: "Drop your text into the editor. Press Enter inside a paragraph to split it into blocks, and hit Load sample if you want to explore the formatting first.",
            },
            {
              title: "Style it",
              text: "Click any block, then use the toolbar: H1/H2/H3 headings, bold, italic, left/center/justify alignment, font size, and bullet lists. The preview on the right updates on every keystroke.",
            },
            {
              title: "Download",
              text: "Set a filename, pick A4 or Letter, and hit Download PDF — 1-inch margins, automatic pagination, no watermark, no sign-up.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>Where this <em>shines</em></>}
          sub="Five everyday situations where a quick text-to-PDF beats opening a word processor."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {useCases.map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Text to PDF <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["pdf-to-jpg", "merge-pdf", "wikipedia-to-pdf"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
