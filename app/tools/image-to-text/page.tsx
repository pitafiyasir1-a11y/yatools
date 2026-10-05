import ImageToTextClient from "./ToolClient";
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
  slug: "image-to-text",
  name: "Image to Text OCR",
  tagline: "Extract editable text from any image.",
  description:
    "Free image to text OCR online. Upload a photo, screenshot, or scan and extract editable English text — right in your browser, no sign-up.",
  category: "Everyday Utilities",
  keyword: "image to text ocr online",
  badge: "AI",
  badgeColor: "purple",
  api: null,
  related: ["audio-to-text", "word-counter", "text-to-pdf"],
};

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Image to Text OCR — YATools",
    url: `${SITE.url}/tools/image-to-text`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Extract text from images free online with in-browser OCR — upload photos, screenshots, or scans and get editable English text free. No sign-up. Try now!",
  };
}

export const metadata = pageMeta({
  title: "Image to Text OCR - Extract Text from Images Free Online",
  description:
    "Extract text from images free online with in-browser OCR — upload photos, screenshots, or scans and get editable English text free. No sign-up. Try now!",
  path: "/tools/image-to-text",
  keywords: [
    "image to text ocr online",
    "image to text",
    "photo to text",
    "OCR online",
    "extract text from image",
  ],
});

const faqs = [
  {
    q: "How does the OCR work?",
    a: "Your browser downloads the Tesseract OCR engine (about 10 MB, cached after the first run) and reads the image locally. Recognition takes roughly 10–30 seconds depending on image size — larger images take longer.",
  },
  {
    q: "Which languages are supported?",
    a: "English only, for now. Clear printed English text — screenshots, documents, signs, book pages — gives the best results.",
  },
  {
    q: "Why is some text misread?",
    a: "OCR is best with sharp, high-contrast printed text. It struggles with handwriting, stylized fonts, blurry photos, rotated text, and busy backgrounds. For best results, use a straight-on, well-lit capture. Always proofread the result.",
  },
  {
    q: "Is my image uploaded anywhere?",
    a: "No. Both the OCR engine download (from a public CDN) and the recognition itself happen on your device — your image never leaves your browser and nothing is stored.",
  },
  {
    q: "Can I edit the extracted text?",
    a: "Yes — the result appears in an editable text box. Fix any misread words, then copy the cleaned text with one click.",
  },
  {
    q: "How do I extract text from a screenshot for free?",
    a: "Upload the screenshot and the in-browser OCR reads the visible text into an editable box — copy it straight into your document.",
  },
  {
    q: "Which languages does the OCR support?",
    a: "English text is supported, including common Latin characters, numbers, and punctuation. Handwriting and heavily stylized fonts are not supported — clean printed text gives the best results.",
  },

];

export default function ImageToTextPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Image to Text", path: "/tools/image-to-text" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Image to Text" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Image to Text <em>OCR</em> Online
            </>
          }
          tagline="A free image to text OCR tool: pull editable text out of photos, screenshots, and scans — right in your browser."
        />

        <ImageToTextClient />
        <PrivacyNote>
          Everything runs 100% in your browser — the OCR engine and your image never touch our
          servers, and nothing is stored anywhere.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Image to Text OCR</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            Image to text OCR reads the words inside your pictures and hands them back as editable text. Upload a photo, screenshot, or scanned page to this free online tool and the optical character recognition engine — running entirely in your browser — extracts the English text for you to copy and edit. Students digitize textbook pages, professionals pull text from slides and whiteboards, and anyone can rescue the words from a screenshot instead of retyping them.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Accuracy depends on the source: crisp, high-contrast text on a clean background extracts almost perfectly, while blurry photos, decorative fonts, and cluttered backgrounds produce more errors — always proofread important passages. Because the OCR runs on your device, your images are never uploaded anywhere, which makes this safe for documents you would not send to a server. The extracted text is plain and editable, ready to paste into any document.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>editable text</em></>} />
        <Steps
          steps={[
            {
              title: "Upload an image",
              text: "Drag and drop a photo, screenshot, or scan — or click to browse. Clear, high-contrast text reads best.",
            },
            {
              title: "Extract the text",
              text: "Press Extract text. The OCR engine loads (about 10 MB on first run) and reads your image in 10–30 seconds.",
            },
            {
              title: "Edit and copy",
              text: "The result lands in an editable box. Fix any misreads, then copy the clean text with one click.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>Getting <em>accurate</em> results</>}
          sub="OCR accuracy is mostly about the input image. These habits help a lot."
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
              t: "Straight and sharp",
              d: "Photograph documents straight-on in good light. Skewed angles and motion blur are the top causes of garbled output.",
            },
            {
              t: "High contrast wins",
              d: "Dark text on a light background reads far better than light text on busy or dark backgrounds.",
            },
            {
              t: "Printed beats handwritten",
              d: "Printed and on-screen text recognizes reliably. Handwriting — even neat handwriting — is a different, much harder problem.",
            },
            {
              t: "Always proofread",
              d: "Similar-looking characters (0/O, 1/l/I) get mixed up. Skim the extracted text before pasting it anywhere important.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>OCR <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["audio-to-text", "word-counter", "text-to-pdf"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
