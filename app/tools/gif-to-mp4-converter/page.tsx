import GifToMp4Client from "./ToolClient";
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

const tool: ToolDef = {
  slug: "gif-to-mp4-converter",
  name: "GIF to MP4 Converter",
  tagline: "A free GIF to MP4 converter: turn heavy GIFs into tiny MP4 videos — up to 90% smaller, in your browser.",
  description:
    "Free online GIF to MP4 converter: turn animated GIFs into small, compatible MP4 videos in your browser. No upload, no sign-up, no watermark.",
  category: "Everyday Utilities",
  keyword: "gif to mp4",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "video-to-gif-converter",
    "mp4-to-mp3-converter",
    "image-converter"
],
};

export const metadata = pageMeta({
  title: "GIF to MP4 Converter - Shrink GIFs to Video Free Online",
  description:
    "GIF to MP4 converter, free online: turn heavy animated GIFs into tiny MP4 videos up to 90% smaller. No sign-up, no watermark. No account needed. Try it now!",
  path: "/tools/gif-to-mp4-converter",
  keywords: [
    "GIF to MP4",
    "GIF to MP4 converter",
    "convert GIF to MP4",
    "animated GIF to video",
    "GIF to MP4 for social media",
  ],
});

const faqs = [
  {
    q: "Why convert a GIF to MP4?",
    a: "Size, mostly. A GIF is an old, inefficient format — the same animation as an MP4 is typically 5–10× smaller. MP4s also play on every phone, social app, and website, while some platforms mangle or refuse to loop GIFs.",
  },
  {
    q: "Will the MP4 look as good as the GIF?",
    a: "Yes — usually better. GIFs are limited to 256 colors, so gradients look banded; MP4 keeps full color and smooth gradients. We encode at CRF 20, which is visually near-lossless for this kind of content.",
  },
  {
    q: "What happens to transparency in my GIF?",
    a: "MP4 doesn't support transparency, so see-through areas come out solid (usually black). If your GIF has a transparent background and that matters, keep it as a GIF or PNG sequence instead.",
  },
  {
    q: "Is my GIF uploaded anywhere?",
    a: "No. Conversion runs entirely in your browser with ffmpeg.wasm. The first run downloads a ~30 MB video engine once; after that everything is instant and local.",
  },
  {
    q: "Is there a size limit?",
    a: "About 100 MB per GIF. That's generous — most GIFs are well under it. If yours is bigger, it's almost certainly worth converting.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert a GIF to MP4",
  description: "Turn an animated GIF into a small MP4 video with YATools' free converter.",
  step: [
    {
      "@type": "HowToStep",
      name: "Upload your GIF",
      text: "Drop a .gif file (up to ~100 MB) onto the tool. It stays in your browser — nothing is uploaded.",
    },
    {
      "@type": "HowToStep",
      name: "Choose frame rate and size",
      text: "Optionally lower the frame rate to 15 fps or downscale the resolution for an even smaller file.",
    },
    {
      "@type": "HowToStep",
      name: "Convert and download",
      text: "Hit Convert to MP4, wait a moment, then download the MP4 video — usually 5–10× smaller than the GIF.",
    },
  ],
};

export default function GifToMp4Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={howToJsonLd} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/gif-to-mp4-converter" },
          { name: "GIF to MP4 Converter", path: "/tools/gif-to-mp4-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "GIF to MP4 Converter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free GIF to <em>MP4 Converter</em> Online
            </>
          }
          tagline="A free GIF to MP4 converter: turn heavy GIFs into tiny MP4 videos — up to 90% smaller, in your browser."
        />

        <GifToMp4Client />
        <PrivacyNote>
          Conversion runs 100% in your browser with ffmpeg.wasm. Your GIF is never uploaded, stored, or seen by anyone but you.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>convert</em></>}
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
              t: "Inputs",
              d: "Animated .gif files up to ~100 MB. Read straight from your device — nothing is uploaded first.",
            },
            {
              t: "Output",
              d: "H.264 MP4 with faststart enabled — streams instantly on the web and plays on every phone and social app.",
            },
            {
              t: "Dramatic savings",
              d: "GIF is one of the least efficient video formats ever made. Expect 5–10× smaller files with better color quality.",
            },
            {
              t: "Honest limits",
              d: "MP4 has no transparency (see-through GIF backgrounds come out solid), and the frame-rate/size options trade size against smoothness — we tell you exactly what each does.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a tiny <em>video</em></>} />
        <Steps
          steps={[
            {
              title: "Drop in your GIF",
              text: "Choose an animated .gif file up to ~100 MB. It never leaves your browser — conversion happens on your device.",
            },
            {
              title: "Tune it (optional)",
              text: "Lower the frame rate to 15 fps or downscale the size for an even smaller file — or leave everything as-is.",
            },
            {
              title: "Convert & download",
              text: "Hit Convert to MP4, wait a moment, then download the video with the exact before/after sizes shown.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>Where MP4 beats <em>GIF</em></>}
          sub="Almost everywhere, honestly."
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
              t: "Share on messaging apps",
              d: "A 30 MB GIF becomes a 3 MB MP4 that sends instantly on WhatsApp and Telegram instead of timing out.",
            },
            {
              t: "Post on social media",
              d: "Twitter/X, Instagram and LinkedIn all prefer video. MP4 uploads faster and plays smoothly where GIFs stutter.",
            },
            {
              t: "Embed on your website",
              d: "Replace a 15 MB hero GIF with a 1.5 MB looping MP4 and your page loads in a fraction of the time — better for visitors and SEO.",
            },
            {
              t: "Product demos & tutorials",
              d: "Screen-capture GIFs balloon fast. Convert them to MP4 for crisp, small demo clips you can email or host anywhere.",
            },
            {
              t: "Save phone storage",
              d: "That folder of reaction GIFs? Convert the keepers to MP4 and reclaim real space without losing the animation.",
            },
            {
              t: "Private conversion",
              d: "No server ever sees your GIF — handy for memes made from personal photos or internal company screen recordings.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>GIF to MP4 <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["video-to-gif-converter", "mp4-to-mp3-converter", "image-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
