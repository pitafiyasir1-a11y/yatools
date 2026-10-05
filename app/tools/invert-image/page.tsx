import InvertImageClient from "./ToolClient";
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
  slug: "invert-image",
  name: "Invert Image",
  tagline: "Flip any photo into its negative with one click.",
  description:
    "Invert image colors online for free. Upload a photo and flip every pixel to its opposite color — instant photo-negative effect, right in your browser.",
  category: "Everyday Utilities",
  keyword: "invert image colors online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["image-converter", "image-resizer", "background-remover"],
};

export const metadata = pageMeta({
  title: "Invert Image Colors Online — Free Photo Negative Tool",
  description:
    "Invert image colors online for free. Upload any photo and flip it to a negative in one click. PNG/JPG download, before-and-after preview, no sign-up.",
  path: "/tools/invert-image",
  keywords: [
    "invert image colors online",
    "photo negative online",
    "invert colors image free",
    "negative filter photo",
  ],
});

const faqs = [
  {
    q: "What does inverting an image do?",
    a: "Inverting flips every color channel to its opposite: black becomes white, blue becomes orange, and so on. The result is the classic photographic negative effect — useful for dark-mode mockups, print negatives, and stylized edits.",
  },
  {
    q: "Will inverting reduce the quality of my image?",
    a: "No. The inversion happens pixel-by-pixel at the original resolution, so dimensions and sharpness stay the same. PNG download is lossless; JPG applies its usual mild compression.",
  },
  {
    q: "Should I download as PNG or JPG?",
    a: "Choose PNG when you want a perfect, lossless copy of the inverted image. Choose JPG for smaller files when you're sharing online or don't need transparency.",
  },
  {
    q: "Is my image uploaded anywhere?",
    a: "No. The inversion runs entirely on your device with the browser's canvas engine — your image never leaves your computer, and nothing is stored.",
  },
  {
    q: "Can I invert the same image twice to get the original back?",
    a: "Yes — inverting is a perfect round trip. Invert an inverted image and you get the exact original back (PNG to PNG).",
  },
];

export default function InvertImagePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Invert Image", path: "/tools/invert-image" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Invert Image" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Invert Image <em>Colors</em>
            </>
          }
          tagline="Turn any photo into its negative in one click. Free, private, and instant — right in your browser."
        />

        <InvertImageClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your image is never uploaded, processed, or
          stored anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>negative</em></>} />
        <Steps
          steps={[
            {
              title: "Upload a photo",
              text: "Drag and drop any image (PNG, JPG, WebP, GIF, BMP) or click to browse. It opens instantly in the before/after viewer.",
            },
            {
              title: "Invert the colors",
              text: "Hit Invert colors and every pixel is flipped to its exact opposite — black to white, red to cyan — at full resolution.",
            },
            {
              title: "Download it",
              text: "Pick PNG for a lossless copy or JPG for a smaller file, then download the negative to your device.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>When <em>inversion</em> comes in handy</>}
          sub="The negative effect is more than a filter — people use it for real work."
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
              t: "Dark-mode previews",
              d: "Invert a light UI screenshot to rough out how it would look as a dark theme before touching any code.",
            },
            {
              t: "Print negatives",
              d: "Need a negative for screen printing, cyanotypes, or alternative photography? Invert once and print.",
            },
            {
              t: "Reading scanned text",
              d: "White text on dark scans is easier on the eyes for many readers — invert a dark scan and read comfortably.",
            },
            {
              t: "Stylized edits",
              d: "Negatives make striking thumbnails, posters, and social posts. Invert twice to return to the exact original.",
            },
          ].map((c) => (
            <div key={c.t} className="neu-card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Inversion <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={tool.related} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
