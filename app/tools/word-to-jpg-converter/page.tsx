import WordToJpgClient from "./ToolClient";
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
  slug: "word-to-jpg-converter",
  name: "Word to JPG Converter",
  tagline: "A free Word to JPG converter: turn every .docx page into a shareable JPG image — no sign-up, no watermark.",
  description:
    "Convert Word to JPG online for free: render each .docx page as a crisp image in your browser. Choose quality, download individually. No sign-up.",
  category: "Screenshots & PDF",
  keyword: "word to jpg converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "word-to-pdf-converter",
    "pdf-to-jpg",
    "image-converter"
],
};

export const metadata = pageMeta({
  title: "Word to JPG Converter - DOCX Pages to JPG Free Online",
  description:
    "Word to JPG converter, free online: turn every page of a .docx into a shareable JPG image in your browser. No sign-up, no watermark. Try it now — it’s free!",
  path: "/tools/word-to-jpg-converter",
  keywords: [
    "Word to JPG",
    "Word to JPG converter",
    "DOCX to JPG",
    "convert Word to JPG",
    "Word document to JPG",
  ],
});

const faqs = [
  {
    q: "How does the conversion work?",
    a: "Your .docx is rendered in your browser with docx-preview, then each page is captured as a JPG image with html2canvas. You can pick the quality level and download pages one by one or all at once.",
  },
  {
    q: "What quality will the JPGs be?",
    a: "Pages are captured at double resolution for crisp text. You choose the JPEG quality: Medium for small files, High (recommended) for a balance, or Maximum for the sharpest result.",
  },
  {
    q: "Can I convert just one page?",
    a: "Yes. After conversion every page appears as a thumbnail with its own download button — grab only the pages you need.",
  },
  {
    q: "Will the text still be editable in the JPG?",
    a: "No — and that's worth knowing upfront. A JPG is a picture of the page: the text can't be selected, copied, or edited. If you need editable text, use our PDF to Word tool instead.",
  },
  {
    q: "Is my document uploaded anywhere?",
    a: "Never. Rendering and image capture happen entirely on your device. Your document is discarded the moment you leave the page.",
  },
];

const howTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert Word to JPG online",
  description:
    "Render a .docx in your browser and save each page as a crisp JPG image.",
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
      name: "Pick a quality",
      text: "Choose Medium, High, or Maximum JPG quality depending on whether file size or sharpness matters more.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Download the images",
      text: "Convert the pages, then download them individually or all at once as JPG files.",
    },
  ],
};

export default function WordToJpgPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd data={howTo} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/word-to-jpg-converter" },
          { name: "Word to JPG Converter", path: "/tools/word-to-jpg-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Word to JPG Converter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Word to <em>JPG Converter</em> Online
            </>
          }
          tagline="A free Word to JPG converter: turn every .docx page into a shareable JPG image — no sign-up, no watermark."
        />

        <WordToJpgClient />
        <PrivacyNote>
          Your Word document is rendered and captured 100% in your browser with docx-preview and
          html2canvas. Nothing is ever uploaded.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What this converter <em>produces</em></>}
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
              t: "Output: JPG per page",
              d: "Each page becomes its own .jpg at double resolution. Filenames keep your document's name plus the page number.",
            },
            {
              t: "You control the quality",
              d: "Three JPEG quality levels. High is the sweet spot for sharing; Maximum if the image will be printed or zoomed.",
            },
            {
              t: "Pictures, not text",
              d: "The output is an image — text can't be selected or edited. For editable output, use PDF to Word instead.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>images</em></>} />
        <Steps
          steps={[
            {
              title: "Drop your .docx",
              text: "Drag the file onto the upload area or click to choose it. Rendering happens in your browser.",
            },
            {
              title: "Choose quality & convert",
              text: "Pick a JPG quality level and hit “Convert pages to JPG”. Watch the progress bar do its work.",
            },
            {
              title: "Download pages",
              text: "Every page appears as a thumbnail — download the ones you need, or grab them all at once.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When page images <em>help</em></>}
          sub="Sometimes a picture of the document is exactly the format you need."
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
              t: "Share on chat & social",
              d: "Messaging apps and social posts accept images, not .docx files. Convert the page and send it like any photo.",
            },
            {
              t: "Embed in slides",
              d: "Drop a page image straight into PowerPoint, Canva, or a website mockup without font or layout surprises.",
            },
            {
              t: "Archive certificates",
              d: "Save award letters, certificates, and reference letters as images that look identical everywhere, forever.",
            },
            {
              t: "Post documents visually",
              d: "Blogs and forums often only allow image uploads — a page JPG is the universal workaround.",
            },
            {
              t: "Quick previews",
              d: "Need to show someone what a document looks like without sending the editable file? An image preview does it.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Word to JPG <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["word-to-pdf-converter", "pdf-to-jpg", "image-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
