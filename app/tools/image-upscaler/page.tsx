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

import ImageUpscalerClient from "./ToolClient";

const tool: ToolDef = {
  slug: "image-upscaler",
  name: "AI Image Upscaler",
  tagline: "A free AI image upscaler: enlarge photos 2x — sharper and cleaner. First run downloads the AI model once, then it is cached.",
  description:
    "AI image upscaler online: enlarge photos 2x with the ESRGAN neural network. Free, private, runs entirely in your browser — no uploads.",
  category: "AI Tools",
  keyword: "ai image upscaler online",
  badge: "AI",
  badgeColor: "purple",
  api: null,
  related: [
    "image-compressor",
    "image-converter",
    "background-remover"
],
};

export const metadata = pageMeta({
  title: "Image Upscaler - AI Photo Enhancement Tool Free Online",
  description:
    "Image upscaler, free online: enlarge photos 2x with AI — sharper and cleaner, right in your browser. The AI model loads once, then caches. Try it now!",
  path: "/tools/image-upscaler",
  keywords: [
    "image upscaler",
    "AI image upscaler",
    "upscale image AI",
    "image enhancer AI",
    "photo upscaler",
  ],
});

const faqs = [
  {
    q: "How does the AI image upscaler work?",
    a: "It runs the ESRGAN-Slim neural network (trained on millions of photos) directly in your browser with TensorFlow.js. The model studies your image's textures and edges, then reconstructs it at double resolution — much sharper than simple stretching.",
  },
  {
    q: "Is it really free? What's the catch?",
    a: "Yes, completely free with no sign-up. There's no catch: the AI runs on your own device, so there's no server cost per image. The first run downloads the ~0.9 MB model once; after that it's cached in your browser.",
  },
  {
    q: "What image sizes work best?",
    a: "Best results come from small or low-resolution photos — old camera shots, thumbnails, compressed social-media images. The tool processes images up to 1024px on the long side (larger ones are scaled down first, stated honestly on screen) and outputs a true 2x enlargement.",
  },
  {
    q: "Will it fix a very blurry or pixelated photo?",
    a: "It improves sharpness and cleans up compression artifacts noticeably, but be realistic: no upscaler can invent detail that was never there. A slightly soft or small photo improves a lot; an extremely blurry one improves a little.",
  },
  {
    q: "Is my photo uploaded anywhere?",
    a: "No. The AI model and your image never leave your device — everything happens locally in your browser tab. That's also why it's free and unlimited.",
  },
  {
    q: "What format is the upscaled image?",
    a: "PNG, at exactly double the width and height of the processed image. PNG keeps every pixel the AI generated, with no extra compression loss.",
  },
];

export default function ImageUpscalerPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/image-upscaler" },
          { name: "AI Image Upscaler", path: "/tools/image-upscaler" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "AI Image Upscaler" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free AI Image <em>Upscaler</em> Online
            </>
          }
          tagline="A free AI image upscaler: enlarge photos 2x — sharper and cleaner. First run downloads the AI model once, then it is cached."
        />

        <ImageUpscalerClient />
        <PrivacyNote>
          The ESRGAN model runs 100% on your device with TensorFlow.js. Your photos are never uploaded, stored, or seen by anyone.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>upscale</em></>}
          sub="Straightforward limits, stated plainly."
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
              t: "2x AI enlargement",
              d: "ESRGAN-Slim neural network doubles width and height with genuinely reconstructed detail — not bicubic stretching.",
            },
            {
              t: "JPG, PNG, WebP in",
              d: "Any common image format up to ~10MB. Output is always PNG at 2x, so no generation of quality is lost to recompression.",
            },
            {
              t: "1024px processing cap",
              d: "The AI runs on photos up to 1024px on the long side; bigger images are scaled down first (we tell you when it happens). Full-megapixel AI upscaling would take minutes on most devices.",
            },
            {
              t: "Private by design",
              d: "Model downloads once (~0.9 MB), then lives in your browser cache. No accounts, no uploads, no watermarks on the output.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>2x sharper</em></>} />
        <Steps
          steps={[
            {
              title: "Drop in a photo",
              text: "Choose a JPG, PNG, or WebP image up to ~10MB. It stays on your device — nothing is uploaded.",
            },
            {
              title: "Let the AI work",
              text: "Press “Upscale 2x”. First run downloads the ~0.9 MB model once and warms it up; the neural net then rebuilds your image at double resolution.",
            },
            {
              title: "Compare and download",
              text: "Drag the before/after slider to inspect the result, then download the 2x PNG. Run it again on another photo — the model is already cached.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When upscaling <em>helps</em></>}
          sub="Small images, big difference."
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
              t: "Old low-res photos",
              d: "Photos from early digital cameras or old phones get a real second life — sharper enough to share or print small again.",
            },
            {
              t: "Thumbnails & avatars",
              d: "A tiny logo or profile picture stretched big looks mushy. Upscale 2x first and it holds up at larger sizes.",
            },
            {
              t: "Product & listing photos",
              d: "Marketplace and store photos pulled from compressed sources look more professional after a clean 2x pass.",
            },
            {
              t: "Screenshots for docs",
              d: "UI screenshots embedded in documentation or slides stay crisp when the page is zoomed or projected.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Upscaler <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["image-compressor", "image-converter", "background-remover"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
