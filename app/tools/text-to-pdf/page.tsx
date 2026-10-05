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
} from "@/lib/site";

const tool = toolBySlug("text-to-pdf")!;

export const metadata = pageMeta({
  title: "Free Text to PDF — Convert Text to PDF Online",
  description:
    "Convert text to PDF free in your browser. Formatting toolbar with headings, bold, italic, alignment, bullet lists, and a live preview — no uploads, no watermarks, no sign-up.",
  path: "/tools/text-to-pdf",
  keywords: [
    "text to pdf converter free",
    "convert text to pdf online",
    "text to pdf no watermark",
    "make pdf from text",
    "online pdf maker free",
    "text to pdf with formatting",
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
              Text to <em>PDF</em>
            </>
          }
          tagline="Write or paste text, style it with a real formatting toolbar — headings, bold, italic, alignment, bullet lists — watch it update in the live preview, then download a clean, watermark-free PDF in your browser."
        />

        <TextToPdfClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your text is never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>

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
        <RelatedTools slugs={["wikipedia-to-pdf", "word-counter", "case-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
