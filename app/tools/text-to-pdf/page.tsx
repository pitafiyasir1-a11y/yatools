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
    "Convert text to PDF free in your browser. Headings, font sizes, and alignment — no uploads, no watermarks, no sign-up. Download instantly.",
  path: "/tools/text-to-pdf",
  keywords: [
    "text to pdf converter free",
    "convert text to pdf online",
    "text to pdf no watermark",
    "make pdf from text",
    "online pdf maker free",
  ],
});

const faqs = [
  {
    q: "How do I turn text into a PDF here?",
    a: "Paste or type your text, optionally mark headings with # and ##, pick a font size and alignment, then press Download PDF. The file is generated on your device and saved straight to your downloads folder.",
  },
  {
    q: "How do headings work?",
    a: "With heading detection on, any line starting with “# ” becomes a large bold heading and “## ” becomes a sub-heading. Turn detection off if your text legitimately starts lines with the # character.",
  },
  {
    q: "Can I control the page layout?",
    a: "Documents are laid out on A4 pages with 1-inch margins. You control the title, body font size (10–16pt), and left, center, or justified alignment. Multi-page documents paginate automatically.",
  },
  {
    q: "Is the PDF watermarked or limited?",
    a: "No watermark, no page limit, no account. Other “free” converters gate you after a few pages or stamp their logo — this one just hands you the file.",
  },
  {
    q: "Is my text private?",
    a: "Yes. The PDF is built entirely inside your browser with an open-source PDF library. Your words never leave your device, so it's safe for contracts, journals, and unpublished work.",
  },
];

const useCases = [
  {
    t: "Cover letters & resumes",
    d: "Draft in any editor, paste here, mark section headings with #, and export a clean A4 PDF ready to attach to a job application — no word processor needed.",
  },
  {
    t: "Homework & study notes",
    d: "Students paste revision notes, split topics with ## sub-headings, and download a printable PDF that's far easier to read than a wall of plain text.",
  },
  {
    t: "Minutes of meetings",
    d: "Turn a running meeting log into a shareable PDF in one click. Headings separate agenda items; the title field becomes the document header.",
  },
  {
    t: "Scripts & manuscripts",
    d: "Writers and video creators convert drafts to PDF for sharing with editors or collaborators — justified alignment gives it a typeset feel.",
  },
  {
    t: "Quick receipts & notices",
    d: "Need a simple printable notice, packing list, or receipt text as a PDF? Type it, download, print. Faster than opening a word processor.",
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
          tagline="Write or paste text, style it with headings, font sizes, and alignment, then download a clean, watermark-free PDF — generated right in your browser."
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
              text: "Drop your text into the box. Start lines with # or ## to create headings and sub-headings automatically.",
            },
            {
              title: "Style it",
              text: "Set the document title, pick a font size from 10 to 16pt, and choose left, center, or justified alignment. The live page estimate updates as you type.",
            },
            {
              title: "Download",
              text: "Hit Download PDF and the file is built instantly on your device — A4 pages, 1-inch margins, no watermark, no sign-up.",
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
            <div key={c.t} className="neu-card" style={{ padding: 20 }}>
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
