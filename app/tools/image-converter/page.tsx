import ImageConverterClient from "./ToolClient";
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

const tool = toolBySlug("image-converter")!;

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Image Converter — YATools",
    url: `${SITE.url}/tools/image-converter`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Convert images between PNG, JPG, and WebP free online — fast, private, in-browser conversion with quality control. No sign-up, no watermark. Try it now!",
  };
}

export const metadata = pageMeta({
  title: "Image Converter - Change PNG, JPG & WebP Free Online",
  description:
    "Convert images between PNG, JPG, and WebP free online — fast, private, in-browser conversion with quality control. No sign-up, no watermark. Try it now!",
  path: "/tools/image-converter",
  keywords: [
    "image converter",
    "convert image",
    "image format converter",
    "PNG to JPG",
    "JPG to PNG",
  ],
});

const faqs = [
  {
    q: "Which formats can I convert between?",
    a: "PNG, JPG (JPEG), and WebP — in any direction. Upload any common image (PNG, JPG, WebP, GIF, BMP) and pick your target format. Animated GIFs convert to a static first frame.",
  },
  {
    q: "Does the quality slider affect PNG files?",
    a: "No — and that's intentional. PNG is a lossless format, so it has no quality setting to adjust; every pixel is preserved exactly. The slider only applies to JPG and WebP, which are lossy: lower quality gives you a smaller file.",
  },
  {
    q: "Will converting change my image's dimensions?",
    a: "No. This converter keeps the original width and height in pixels. If you also need to resize, use the Image Resizer after converting.",
  },
  {
    q: "What happens to transparency when converting to JPG?",
    a: "JPG doesn't support transparency, so transparent areas are flattened onto a white background. Convert to PNG or WebP instead if you need to keep transparency.",
  },
  {
    q: "Are my images uploaded anywhere?",
    a: "Never. The conversion runs entirely in your browser using the HTML canvas API. Your files aren't sent to a server, stored, or tracked — safe for client work and personal photos.",
  },
  {
    q: "How do I convert PNG to JPG for free?",
    a: "Upload your PNG, choose JPG as the output, adjust quality if you like, and download — the conversion happens instantly in your browser.",
  },

];

export default function ImageConverterPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/image-converter" },
          { name: "Image Converter", path: "/tools/image-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Image Converter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Image <em>Converter</em> Online
            </>
          }
          tagline="A free image converter: switch images between PNG, JPG, and WebP in seconds — right in your browser."
        />

        <ImageConverterClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your images are never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Image Converter</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            An image converter changes your photo from one file format to another — the right format for the right job. Drop a PNG, JPG, or WebP into this free online tool, pick the target format, and download the converted file in seconds. Convert PNG screenshots to JPG for smaller email attachments, turn JPGs into WebP for faster websites, or make PNGs when you need transparency and crisp graphics. Your image dimensions stay exactly the same; only the encoding changes.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Two things are worth knowing. First, converting a JPG to PNG will not restore quality lost to JPG compression, and the PNG will usually be larger — format conversion cannot invent detail. Second, JPG does not support transparency, so transparent areas become a solid background when you convert a PNG with transparency to JPG. The quality slider applies to JPG and WebP output. Everything converts locally in your browser: no uploads, no queues, no accounts.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>new format</em></>} />
        <Steps
          steps={[
            {
              title: "Drop your image",
              text: "Upload any PNG, JPG, WebP, GIF, or BMP from your device — or drag it straight onto the page.",
            },
            {
              title: "Pick a format",
              text: "Choose PNG for lossless quality, JPG for photos, or WebP for the smallest modern file. Dial quality down for JPG and WebP to shrink the file further.",
            },
            {
              title: "Download the result",
              text: "See the original vs. converted file size side by side, then grab the new file — no watermark, no sign-up.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>Pick the <em>right format</em></>}
          sub="Each format has a job it does best."
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
              t: "PNG — pixel-perfect",
              d: "Lossless compression keeps every pixel exactly as drawn. Best for logos, screenshots, icons, and anything with text or transparency. Downside: larger files.",
            },
            {
              t: "JPG — photos",
              d: "Lossy compression tuned for photographs and gradients. A quality of 80–90% usually looks identical to the original at a fraction of the size. No transparency.",
            },
            {
              t: "WebP — smallest modern files",
              d: "Supports both lossy and lossless modes plus transparency, typically 25–35% smaller than equivalent JPGs. Works in all modern browsers — the best default for the web.",
            },
            {
              t: "Why is my converted file bigger?",
              d: "Converting a heavily compressed JPG to PNG can't restore detail — PNG losslessly preserves the JPG's artifacts, so the file often grows. Convert toward the lossy format (JPG/WebP) to shrink things.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Examples" title={<>Typical <em>use cases</em></>} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>blog-hero.txt</span>
            </div>
            <pre>{`Photographer sends a 4.2 MB PNG.
Convert to WebP at 85% →
620 KB. Same look, page loads
in a blink instead of a yawn.`}</pre>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>print-flyer.txt</span>
            </div>
            <pre>{`Printer asks for JPG, not WebP.
Convert the approved WebP hero
to JPG at 95% → safe, compatible,
zero quality surprises.`}</pre>
          </div>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Image converter <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["image-compressor", "image-resizer", "image-to-pdf"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
