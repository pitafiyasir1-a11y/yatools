import ImageCropperClient from "./ToolClient";
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
  slug: "image-cropper",
  name: "Image Cropper",
  tagline: "Crop photos to any size with drag-to-select.",
  description:
    "Crop images online for free. Drag to select the exact area, lock aspect ratios like 1:1 or 16:9, preview live, and download the full-resolution crop.",
  category: "Everyday Utilities",
  keyword: "crop image online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["image-resizer", "invert-image", "mirror-image"],
};

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Image Cropper — YATools",
    url: `${SITE.url}/tools/image-cropper`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Crop images free online with drag-to-select — lock aspect ratios like 1:1 or 16:9, preview live, and download the full-resolution crop free. Try it now!",
  };
}

export const metadata = pageMeta({
  title: "Image Cropper - Crop Photos to Any Size Free Online",
  description:
    "Crop images free online with drag-to-select — lock aspect ratios like 1:1 or 16:9, preview live, and download the full-resolution crop free. Try it now!",
  path: "/tools/image-cropper",
  keywords: [
    "crop image online",
    "image cropper",
    "crop photo",
    "free image crop",
    "crop picture",
  ],
});

const faqs = [
  {
    q: "How do I crop an image?",
    a: "Upload your photo, then click or tap and drag across the image to draw the crop box. You can start a new selection any time by dragging again. The live preview shows exactly what you'll download.",
  },
  {
    q: "Can I crop to a specific aspect ratio?",
    a: "Yes. Pick Free for any shape, or lock to 1:1 (square, great for profile pictures), 4:3 (classic photo), or 16:9 (widescreen). Locked ratios reshape the selection as you drag.",
  },
  {
    q: "Will the cropped image lose quality?",
    a: "No. The crop is cut from the original pixels at full resolution — only the area outside your selection is discarded. Nothing is resized or recompressed beyond your chosen PNG/JPG format.",
  },
  {
    q: "Does it work on phones and tablets?",
    a: "Yes. The selection box supports both mouse and touch, so you can drag with a finger on mobile and get the same live preview and download.",
  },
  {
    q: "Is my image uploaded anywhere?",
    a: "No. Cropping happens entirely in your browser with the canvas engine — your image never leaves your device and nothing is stored.",
  },
  {
    q: "How do I crop an image to 1:1 for Instagram?",
    a: "Upload your photo, enable the 1:1 aspect-ratio lock, drag the box over your subject, and download — the crop stays perfectly square at full resolution.",
  },
  {
    q: "Can I crop a photo into a circle?",
    a: "Crops here are rectangular, which is what every platform expects for uploads. For a circular profile picture, crop a square 1:1 first — most apps mask it into a circle automatically.",
  },

];

export default function ImageCropperPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Image Cropper", path: "/tools/image-cropper" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Image Cropper" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Image <em>Cropper</em> Online
            </>
          }
          tagline="A free image cropper: drag to select exactly what to keep — aspect-ratio locks, live preview, full-resolution download."
        />

        <ImageCropperClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your image is never uploaded, processed, or
          stored anywhere.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Image Cropper</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            An image cropper lets you cut away everything you do not want and keep exactly the frame you do. Upload a photo to this free online tool and drag a selection box over the area to keep — lock the aspect ratio to 1:1 for Instagram, 16:9 for video thumbnails, or 4:3 for classic prints, then download the crop at full resolution. Photographers reframe shots, sellers isolate products from messy backgrounds, and social creators fit one photo to every platform's dimensions.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The live preview shows precisely what the download will contain, so there is no guesswork about edges. Because cropping here simply selects pixels from your original, the kept area loses no quality — the output is as sharp as the source. It works smoothly on phones and tablets too, with touch-friendly handles for the selection box. Your images never leave your device: the entire crop happens in the browser.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>clean crop</em></>} />
        <Steps
          steps={[
            {
              title: "Upload your photo",
              text: "Drag and drop any image or click to browse. It opens in the crop editor with the full image pre-selected.",
            },
            {
              title: "Drag your selection",
              text: "Click or touch and drag to draw the crop box. Lock 1:1, 4:3, or 16:9 for exact ratios, and watch the live preview.",
            },
            {
              title: "Download the crop",
              text: "Hit Crop & download to save just your selection as PNG or JPG — cut from the original at full resolution.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>Cropping <em>done right</em></>}
          sub="Small habits that make the difference between a decent crop and a great one."
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
              t: "Match the destination",
              d: "Profile pictures want 1:1, YouTube thumbnails want 16:9. Crop to the ratio of where the image will live so nothing gets auto-cropped later.",
            },
            {
              t: "Keep some breathing room",
              d: "Don't crop faces or products edge-to-edge — a little margin keeps the result from feeling cramped on every screen.",
            },
            {
              t: "Crop before you resize",
              d: "Always crop first, then resize to final dimensions. Cropping after resizing throws away pixels you already paid for.",
            },
            {
              t: "PNG for graphics, JPG for photos",
              d: "Screenshots and logos stay crisp as PNG. Camera photos are smaller as JPG with no visible difference.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Cropping <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["image-resizer", "image-compressor", "mirror-image"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
