import ImageCompressorClient from "./ToolClient";
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

const tool = toolBySlug("image-compressor")!;

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Image Compressor — YATools",
    url: `${SITE.url}/tools/image-compressor`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Compress images free online — shrink JPG, PNG, and WebP with a live quality slider. Faster websites, smaller uploads, fully private. No sign-up. Try now!",
  };
}

export const metadata = pageMeta({
  title: "Image Compressor - Shrink JPG, PNG & WebP Free Online",
  description:
    "Compress images free online — shrink JPG, PNG, and WebP with a live quality slider. Faster websites, smaller uploads, fully private. No sign-up. Try now!",
  path: "/tools/image-compressor",
  keywords: [
    "image compressor",
    "compress image",
    "image size reducer",
    "photo compressor",
    "shrink image",
  ],
});

const faqs = [
  {
    q: "How does image compression work here?",
    a: "Your image is re-encoded right in your browser using the canvas encoder. For JPEG and WebP the quality slider controls how aggressively detail is discarded; for PNG the encoder re-saves losslessly at full quality. You see the exact before/after sizes before you download.",
  },
  {
    q: "Does the quality slider affect PNG files?",
    a: "No — and any tool that claims otherwise isn't being straight with you. PNG is a lossless format, so there's no quality dial to turn. If you want a much smaller file, switch the output to JPEG or WebP and use the slider; stay with PNG when you need pixel-perfect quality or transparency.",
  },
  {
    q: "What quality setting should I use?",
    a: "For photos, 70–85% JPEG/WebP is the sweet spot — noticeably smaller files with no visible difference on screens. Below ~50% you'll start seeing blocky artifacts around edges and text. Try a few values; the preview updates live.",
  },
  {
    q: "Can compression ever make a file bigger?",
    a: "Yes — for example, forcing a tiny already-optimized PNG to 100% JPEG can grow the file. This tool shows the percentage saved honestly, including when it goes negative, so you're never misled.",
  },
  {
    q: "Is there a file size limit?",
    a: "No hard limit — everything runs locally, so a 50MP photo compresses just as well as a thumbnail. Very large images may take a few seconds to re-encode on slower devices.",
  },
  {
    q: "How do I compress a JPG without losing quality?",
    a: "Upload your JPG, set the quality slider around 80, and compare the preview — you typically cut the file size by more than half with no visible difference.",
  },

];

const useCases = [
  {
    t: "Faster websites & blogs",
    d: "A 4MB camera photo becomes a 300KB web-ready JPEG at 80% quality — pages load faster, Google's Core Web Vitals improve, and visitors stop bouncing.",
  },
  {
    t: "Email & form attachments",
    d: "Beat the 5–10MB attachment limits on job portals, university applications, and email by squeezing scans and photos down before uploading.",
  },
  {
    t: "Social media uploads",
    d: "Platforms recompress your uploads anyway. Pre-compressing to a sensible size avoids double-compression artifacts and uploads faster on slow connections.",
  },
  {
    t: "Storage cleanup",
    d: "Batch-squeeze old phone backups and screenshot folders to reclaim disk space — visually identical, fraction of the bytes.",
  },
  {
    t: "WebP conversion savings",
    d: "Switching output to WebP typically cuts 25–35% off the same JPEG quality. Use it for web images where browser support is fine — the live preview proves it.",
  },
];

export default function ImageCompressorPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/word-counter" },
          { name: "Image Compressor", path: "/tools/image-compressor" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Image Compressor" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Image <em>Compressor</em> Online
            </>
          }
          tagline="A free image compressor: shrink JPG, PNG, and WebP images with a live quality slider — right in your browser."
        />

        <ImageCompressorClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your images are never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Image Compressor</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            An image compressor shrinks your photo files so they load faster and upload easier — without visibly hurting quality. Drop JPG, PNG, or WebP images into this free online tool, drag the quality slider, and watch the file size update live before you download. Bloggers compress post images so pages load in a blink, sellers shrink product photos for marketplaces with upload limits, and anyone emailing photos avoids the attachment-too-large bounce.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Photos in JPG and WebP compress dramatically — a quality setting around 80 typically cuts the size by more than half with no visible difference. PNGs, which use lossless compression, shrink less; screenshots and graphics with flat colors still benefit. Be honest with yourself about already-optimized files: a tiny, heavily compressed image cannot shrink much further, and that is true of every compressor. All processing happens on your device, so your photos are never uploaded or stored.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>smaller file</em></>} />
        <Steps
          steps={[
            {
              title: "Upload an image",
              text: "Choose any JPG, PNG, WebP, or GIF. It never leaves your device — compression happens locally with the browser's own encoder.",
            },
            {
              title: "Dial in the quality",
              text: "Drag the quality slider (10–100%) and pick an output format. The compressed preview, exact file sizes, and percentage saved update live.",
            },
            {
              title: "Download",
              text: "Happy with the trade-off? Download the compressed image instantly. PNG stays lossless; JPEG and WebP follow your slider.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>Where this <em>shines</em></>}
          sub="Five real reasons to shrink an image before you send or publish it."
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
        <SectionHead label="FAQ" title={<>Image compressor <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["image-converter", "image-resizer", "background-remover"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
