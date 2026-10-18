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
  SITE,
} from "@/lib/site";

const tool: ToolDef = {
  slug: "text-to-image",
  name: "Text to Image",
  tagline: "Turn words into shareable typography posters.",
  description:
    "Free text to image generator. Design typography posters with 8 pro templates, neon glow, 3D depth, custom fonts, colors, gradients and textures — 6 canvas sizes — and download as PNG.",
  category: "Everyday Utilities",
  keyword: "text to image generator",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["qr-code-generator", "text-to-pdf", "word-counter"],
};

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Text to Image Generator — YATools",
    url: `${SITE.url}/tools/text-to-image`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Turn words into images free online — design typography posters with custom fonts, colors, and gradients. Square, portrait, or landscape PNG. Try it now!",
  };
}

export const metadata = pageMeta({
  title: "Text to Image Generator - Create Typography Posters Free",
  description:
    "Turn words into images free online — design typography posters with 8 pro templates, neon glow and 3D text effects, custom fonts, colors, gradients and textures. 6 canvas sizes, full-resolution PNG. Try it now!",
  path: "/tools/text-to-image",
  keywords: [
    "text to image generator",
    "text to image",
    "typography poster maker",
    "quote image maker",
    "text poster generator",
    "neon text generator",
    "quote card maker",
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
    a: "Six presets: Square 1080 × 1080 (Instagram posts), Portrait 1080 × 1350, Story 1080 × 1920 (stories/reels covers), Landscape 1200 × 630 (link previews), YouTube 1280 × 720 (thumbnails), and Wide banner 1920 × 640. Every export is a full-resolution PNG.",
  },
  {
    q: "How do I make long text fit?",
    a: "Long lines wrap automatically inside your padding, and pressing Enter adds manual line breaks. If text still overflows, lower the text size or increase the padding with the sliders.",
  },
  {
    q: "What are design templates?",
    a: "One-click starting points: Neon Nights, Golden Luxury, Bold Impact, Minimal Clean, Ocean Drive, Sunset Pop, Retro Cream, and Midnight Purple. Pick one, edit the text, and every font, color, effect, and background updates instantly. Hit Shuffle for a random style.",
  },
  {
    q: "What text effects are available?",
    a: "Five effects: none, soft shadow, neon glow, outline, and 3D depth (extruded). Each effect has its own color picker, so a glow can be cyan on dark or gold on black — your call.",
  },
  {
    q: "Is my text uploaded anywhere?",
    a: "No. The poster is rendered entirely in your browser with the canvas engine — your words never leave your device and nothing is stored.",
  },
  {
    q: "How do I turn a quote into a shareable image?",
    a: "Type the quote, pick a font and background style, choose your image size, and download the PNG — ready to post in under a minute.",
  },
  {
    q: "Is this AI image generation?",
    a: "No. This is a typography poster designer — you style real text yourself, so the wording is always exactly right, unlike AI-generated images.",
  },

];

export default function TextToImagePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
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
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Text to Image <em>Generator</em> Online
            </>
          }
          tagline="A free text to image generator: turn words into share-ready typography posters — custom fonts, colors, and gradients."
        />

        <TextToImageClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your text and designs are never uploaded,
          processed, or stored anywhere.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Text to Image Generator</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            This text to image generator turns your words into designed typography posters — quotes, announcements, and headlines rendered as shareable images. Start from 8 pro design templates (neon, luxury, retro and more), or build custom: two text layers, 10 fonts, neon glow, outline and 3D text effects, gradients, texture patterns, and 6 canvas sizes. Download a crisp PNG. Creators make quote cards for social feeds, businesses design simple sale announcements, and friends turn inside jokes into shareable graphics — no design software needed.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            To be clear about what this is: a typography designer, not an AI art generator. You control the lettering, layout, and style directly, which means the output always says exactly what you typed — no AI surprises, no misspelled words. Long text reflows across lines automatically, and the live preview shows the final poster before you download. Everything renders in your browser, so your words stay private.
          </p>
        </div>


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
              text: "Pick a design template or go custom: 10 fonts, headline + subtext layers, neon glow, outline, 3D depth, letter spacing, gradients, and texture patterns.",
            },
            {
              title: "Download the PNG",
              text: "Export at full resolution in 6 sizes — square, portrait, story, landscape, YouTube thumbnail, or wide banner — ready for social posts, banners, or print.",
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
            <div key={c.t} className="card" style={{ padding: 20 }}>
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
        <RelatedTools slugs={["qr-code-generator", "text-to-pdf", "word-counter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
