import BackgroundRemoverClient from "./ToolClient";
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

const tool = toolBySlug("background-remover")!;

export const metadata = pageMeta({
  title: "Free Background Remover — AI, 100% In-Browser",
  description:
    "Remove image backgrounds with on-device AI. Free, private, no uploads — your photo never leaves your device. Download transparent PNG.",
  path: "/tools/background-remover",
  keywords: [
    "remove image background free",
    "background remover online",
    "remove photo background free",
    "transparent background maker",
    "ai background removal",
  ],
});

const faqs = [
  {
    q: "How does this remove backgrounds without uploading?",
    a: "It runs a real neural network (an image-segmentation AI model) directly inside your browser using WebAssembly/WebGPU. The model detects the foreground subject and erases everything else — all on your device.",
  },
  {
    q: "Why does the first run take a while?",
    a: "The first run downloads the AI model (~40MB) to your browser — that's what the “Downloading AI model…” progress bar shows. Once cached, later removals start almost instantly. This also means the first run needs an internet connection; everything after that is pure local computation.",
  },
  {
    q: "Which browsers work best?",
    a: "Chromium-based browsers (Chrome, Edge, Brave, Arc) give the fastest results because they best support the hardware acceleration the model uses. Firefox and Safari generally work but can be slower. If you see a failure message, try a smaller image or switch to Chrome.",
  },
  {
    q: "What kind of images work best?",
    a: "Photos with a clear subject — people, products, pets — against a distinguishable background give the cleanest cutouts. Very busy backgrounds, fine hair wisps, or glass/transparency can leave rough edges that need manual touch-up.",
  },
  {
    q: "Is my image really private?",
    a: "Yes. Your photo never leaves your device — no upload, no server, no logs. That's the whole point of doing the AI inference in the browser.",
  },
];

const useCases = [
  {
    t: "Product photos for listings",
    d: "Sellers strip backgrounds from product shots to get clean catalog-style images for Daraz, Shopify, or Instagram — no Photoshop subscription needed.",
  },
  {
    t: "Profile pictures & headshots",
    d: "Turn any photo into a crisp headshot with a transparent background, then layer it over your CV header, presentation slide, or YouTube thumbnail.",
  },
  {
    t: "Thumbnails & graphics",
    d: "Creators cut subjects out of screenshots and photos for video thumbnails, memes, and social posts — the PNG keeps crisp edges on any backdrop.",
  },
  {
    t: "Stickers & overlays",
    d: "Make WhatsApp-style stickers or design overlays: remove the background, download the PNG, and drop the cutout into Canva or any editor.",
  },
  {
    t: "ID-style document photos",
    d: "Quickly isolate a person from a casual photo for forms, badges, or profile registrations where you need a clean, plain subject cutout.",
  },
];

export default function BackgroundRemoverPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/word-counter" },
          { name: "Background Remover", path: "/tools/background-remover" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Background Remover" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Background <em>Remover</em>
            </>
          }
          tagline="Erase photo backgrounds with on-device AI. Your image never leaves your browser — get a transparent PNG in seconds, no sign-up, no watermark."
        />

        <BackgroundRemoverClient />
        <PrivacyNote>
          Your image never leaves your device — the AI model runs entirely in your browser, and
          nothing is uploaded, stored, or logged.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>cutout</em></>} />
        <Steps
          steps={[
            {
              title: "Upload a photo",
              text: "Choose any JPG, PNG, or WebP up to ~10MB. It stays on your device — nothing is sent to a server.",
            },
            {
              title: "Remove the background",
              text: "The in-browser AI downloads once (~40MB, cached afterwards), then segments your subject. Watch honest progress: model download, then removal.",
            },
            {
              title: "Download the PNG",
              text: "Compare before and after side by side, then download a transparent-background PNG ready for any design tool.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>Where this <em>shines</em></>}
          sub="Five real situations where a one-click background cutout saves the day."
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
        <SectionHead label="FAQ" title={<>Background remover <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["ai-image-generator", "image-compressor", "image-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
