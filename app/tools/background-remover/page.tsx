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
  SITE,
} from "@/lib/site";

const tool = toolBySlug("background-remover")!;

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Background Remover — YATools",
    url: `${SITE.url}/tools/background-remover`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Remove image backgrounds free online with on-device AI — upload a photo, erase the background in seconds, download a transparent PNG. Private. Try now!",
  };
}

export const metadata = pageMeta({
  title: "Background Remover - Erase Image Backgrounds Free Online",
  description:
    "Remove image backgrounds free online with on-device AI — upload a photo, erase the background in seconds, download a transparent PNG. Private. Try now!",
  path: "/tools/background-remover",
  keywords: [
    "background remover",
    "remove background",
    "background eraser",
    "AI background remover",
    "photo background remover",
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
  {
    q: "Is there a free background remover that works in the browser?",
    a: "Yes. The AI runs on-device in your browser — upload a photo, remove the background, and download a transparent PNG with nothing ever uploaded.",
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
      <JsonLd data={softwareAppJsonLd()} />
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
              Free Background <em>Remover</em> Online
            </>
          }
          tagline="A free AI background remover: erase photo backgrounds with on-device AI — your image never leaves your browser."
        />

        <BackgroundRemoverClient />
        <PrivacyNote>
          Your image never leaves your device — the AI model runs entirely in your browser, and
          nothing is uploaded, stored, or logged.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Background Remover</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A background remover uses AI to separate your subject from its background and erase everything behind it. Upload any photo to this free online tool and get a clean cutout with a transparent background in seconds — perfect for product listings, profile pictures, thumbnails, and design mockups. The AI runs entirely on your device using a neural network that loads in your browser, which means your images are never uploaded to any server; even sensitive photos stay completely private.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The first run downloads the AI model once, which takes a little while depending on your connection, and then it is cached — every removal after that starts instantly. Results are best with clear subjects: portraits, products, pets, and vehicles against reasonably distinct backgrounds. Fine hair strands and semi-transparent objects are the hardest cases for any automatic tool. Download the cutout as a PNG with full transparency, ready to drop onto any new background in your editor of choice.
          </p>
        </div>


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
            <div key={c.t} className="card" style={{ padding: 20 }}>
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
        <RelatedTools slugs={["image-compressor", "image-converter", "image-upscaler"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
