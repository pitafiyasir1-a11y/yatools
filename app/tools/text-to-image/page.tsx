import TextToImageClient from "./ToolClient";
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
  slug: "text-to-image",
  name: "Text to Image",
  tagline: "Turn words into shareable typography posters.",
  description:
    "Free text to image generator. Design typography posters with custom fonts, colors, and gradients — square, landscape, or portrait — and download as PNG.",
  category: "Everyday Utilities",
  keyword: "text to image generator",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["qr-code-generator", "text-to-pdf", "word-counter"],
};

export const metadata = pageMeta({
  title: "Text to Image Generator — Free Typography Poster Maker",
  description:
    "Free text to image generator. Turn words into beautiful typography posters with custom fonts, colors, and gradients. Square, landscape, or portrait PNG download. No sign-up.",
  path: "/tools/text-to-image",
  keywords: [
    "text to image generator",
    "text to image maker online",
    "typography poster maker",
    "quote image generator",
  ],
});

const faqs = [
  {
    q: "What is this text to image tool for?",
    a: "It turns plain text into a designed image — quote cards for social media, announcement banners, thumbnails, or printable posters. Pick a font, colors, and canvas size; the tool renders crisp text and exports a high-resolution PNG.",
  },
  {
    q: "Is this AI image generation?",
    a: "No — this is a typography designer, not AI. It renders your exact words in the font and style you choose, so text always comes out spelled correctly and fully under your control.",
  },
  {
    q: "Which image sizes can I export?",
    a: "Three presets: Square 1080 × 1080 (Instagram posts, profile art), Landscape 1200 × 630 (link previews, banners), and Portrait 1080 × 1350 (stories, posters). Every export is a full-resolution PNG.",
  },
  {
    q: "How do I make long text fit?",
    a: "Long lines wrap automatically inside your padding, and pressing Enter adds manual line breaks. If text still overflows, lower the text size or increase the padding with the sliders.",
  },
  {
    q: "Is my text uploaded anywhere?",
    a: "No. The poster is rendered entirely in your browser with the canvas engine — your words never leave your device and nothing is stored.",
  },
];

export default function TextToImagePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Text to Image", path: "/tools/text-to-image" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Text to Image" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Text to Image <em>Generator</em>
            </>
          }
          tagline="Turn words into share-ready typography posters. Custom fonts, colors, and gradients — rendered live in your browser."
        />

        <TextToImageClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your text and designs are never uploaded,
          processed, or stored anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>poster</em></>} />
        <Steps
          steps={[
            {
              title: "Type your text",
              text: "Enter a quote, announcement, or headline. Line breaks and automatic word-wrapping shape the layout.",
            },
            {
              title: "Style it",
              text: "Pick from six fonts, tune the size, alignment, and padding, then set a solid color or a two-tone gradient background.",
            },
            {
              title: "Download the PNG",
              text: "Export at full resolution in square, landscape, or portrait — ready for social posts, banners, or print.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>Design tips for <em>better posters</em></>}
          sub="A few typographic habits that separate sharp posters from noisy ones."
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
              t: "Fewer words, bigger type",
              d: "Short lines at large sizes read instantly on a phone screen. If you have to squint at the preview, your audience will scroll past it.",
            },
            {
              t: "Contrast is everything",
              d: "Dark text on light backgrounds (or the reverse) wins. If you use a gradient, keep the text color far from both gradient colors.",
            },
            {
              t: "One font per poster",
              d: "Mixing fonts looks messy fast. Pick the single font that matches the mood — Bangers for playful, DM Sans for clean, Georgia for serious.",
            },
            {
              t: "Mind the padding",
              d: "Generous padding makes text feel intentional. Tight edges make it feel like a mistake — give your words room to breathe.",
            },
          ].map((c) => (
            <div key={c.t} className="neu-card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Poster <em>questions</em></>} />
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
