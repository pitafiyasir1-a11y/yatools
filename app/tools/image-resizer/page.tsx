import ImageResizerClient from "./ToolClient";
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

const tool = toolBySlug("image-resizer")!;

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Image Resizer — YATools",
    url: `${SITE.url}/tools/image-resizer`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Resize images to exact dimensions free online — set width and height with aspect-ratio lock, preview live, and download instantly. No sign-up. Try now!",
  };
}

export const metadata = pageMeta({
  title: "Image Resizer - Resize Photos to Exact Size Free Online",
  description:
    "Resize images to exact dimensions free online — set width and height with aspect-ratio lock, preview live, and download instantly. No sign-up. Try now!",
  path: "/tools/image-resizer",
  keywords: [
    "resize image online free",
    "image resizer",
    "resize photo",
    "change image dimensions",
    "photo resizer",
  ],
});

const faqs = [
  {
    q: "What does the aspect-ratio lock do?",
    a: "When the lock is on, changing the width automatically adjusts the height (and vice versa) to keep the original proportions — so your image never gets stretched or squashed. Turn it off to set any width and height freely.",
  },
  {
    q: "Is there a maximum size?",
    a: "Each side is capped at 8,000 pixels. Beyond that, browser canvas rendering gets slow and memory-hungry, so the tool politely asks you to pick a smaller size. 4K (3840 × 2160) presets are fully supported.",
  },
  {
    q: "Does resizing reduce file size?",
    a: "Usually, yes — fewer pixels generally means a smaller file, especially with JPG or WebP output. The tool shows a live output-size estimate under the resized preview before you download, so there are no surprises. Pair it with the Image Compressor if you need the smallest possible file.",
  },
  {
    q: "Will upscaling make my image look better?",
    a: "No. Enlarging an image beyond its original dimensions just stretches existing pixels — it adds no new detail, so it can look softer. The tool shows an honest note whenever you upscale. Resizing down is always safe; resizing up works best for small increases and clean graphics.",
  },
  {
    q: "How accurate is the live preview?",
    a: "Pixel-accurate. The preview is the actual resized image rendered in your browser — the same render the download uses — so what you see side-by-side with the original is exactly what you get, including the file-size estimate.",
  },
  {
    q: "Are my photos uploaded anywhere?",
    a: "Never. The whole resize happens in your browser with the canvas API — your images are never sent to a server, stored, or tracked.",
  },
  {
    q: "How do I resize an image to exact dimensions?",
    a: "Enter the target width and height, keep the aspect-ratio lock on to avoid stretching, and download — the output matches your numbers precisely.",
  },

];

export default function ImageResizerPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/image-resizer" },
          { name: "Image Resizer", path: "/tools/image-resizer" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Image Resizer" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Image <em>Resizer</em> Online
            </>
          }
          tagline="A free image resizer: set exact width and height — with aspect-ratio lock — and download your resized image instantly."
        />

        <ImageResizerClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your images are never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Image Resizer</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            An image resizer changes a photo's dimensions to exactly what you need. Type the target width and height into this free online tool — or scale by percentage — and download the resized image in seconds. Bloggers fit images to their theme's content width, sellers meet marketplace dimension requirements, developers generate correctly sized assets, and anyone preparing a profile picture gets the exact pixels the platform asks for.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The aspect-ratio lock keeps your photo from stretching: change the width and the height follows proportionally. The live preview shows the original next to the resized result as you type, so you can judge sharpness before downloading. One honest note: shrinking a large photo down always looks great, but enlarging a small one cannot invent detail — upscaling past the original size softens the image, and no resizer can fix that. All resizing happens in your browser, so your photos stay private.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to the <em>perfect size</em></>} />
        <Steps
          steps={[
            {
              title: "Upload your image",
              text: "Drop any image onto the page. The tool shows its original dimensions so you know what you're starting from.",
            },
            {
              title: "Set new dimensions",
              text: "Type exact width and height, or hit a preset — Full HD, 4K, Instagram post and story, link previews, avatars. The resized preview updates live next to the original with an exact file-size estimate.",
            },
            {
              title: "Download",
              text: "Pick PNG, JPG, or WebP output (with a quality slider for JPG/WebP) and grab the resized file. If you're upscaling past the original, the tool says so honestly before you commit.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>Sizes that <em>just work</em></>}
          sub="Common dimensions people actually need — all available as presets."
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
              t: "1920 × 1080 — Full HD",
              d: "The classic 16:9 size for YouTube thumbnails, slides, and desktop wallpapers. Sharp enough for most screens without bloating the file.",
            },
            {
              t: "1080 × 1080 — Instagram square",
              d: "The standard square post size for Instagram and Facebook. With the lock on, a square crop of any photo resizes cleanly to this.",
            },
            {
              t: "1200 × 630 — link previews",
              d: "The Open Graph size used by Facebook, X, and LinkedIn link cards. Set this as your og:image for crisp social shares.",
            },
            {
              t: "800 × 600 — web-friendly",
              d: "A sensible size for in-article images and thumbnails — big enough to look good, small enough to load fast on mobile data.",
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
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>og-image.txt</span>
            </div>
            <pre>{`Phone photo is 4032 × 3024 —
far too big for a blog hero.
Lock ON, set width to 1200 →
height follows at 900. Download
as JPG at 85% → loads in a flash.`}</pre>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>marketplace.txt</span>
            </div>
            <pre>{`Selling a phone case: marketplace
wants square photos. Keep the lock ON,
set width to 1080 → height follows at
1080. Batch done in seconds.`}</pre>
          </div>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Image resizer <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["image-compressor", "image-converter", "image-cropper"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
