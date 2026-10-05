import MovToMp4ToolClient from "./ToolClient";
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
  breadcrumbJsonLd,
  type ToolDef,
} from "@/lib/site";
import { softwareAppJsonLd, howToJsonLd } from "../_conv-shared/seo";

const tool: ToolDef = {
  slug: "mov-to-mp4-converter",
  name: "MOV to MP4 Converter",
  tagline: "A free MOV to MP4 converter: turn MOV clips — including iPhone videos — into MP4s that play everywhere.",
  description:
    "MOV to MP4 converter online free: perfect for iPhone videos. Remux MOV to MP4 instantly when possible, re-encode to H.264 + AAC when needed. 100% in-browser.",
  category: "Everyday Utilities",
  keyword: "mov to mp4 converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "mkv-to-mp4-converter",
    "video-compressor",
    "video-converter"
],
};

export const metadata = pageMeta({
  title: "MOV to MP4 Converter - Convert iPhone MOV Free Online",
  description:
    "MOV to MP4 converter, free online: turn iPhone MOV clips into MP4s that play everywhere. Runs 100% in your browser, no uploads. Try it now — it’s free!",
  path: "/tools/mov-to-mp4-converter",
  keywords: [
    "MOV to MP4",
    "MOV to MP4 converter",
    "convert MOV to MP4",
    "iPhone MOV to MP4",
    "MOV converter",
  ],
});

const faqs = [
  {
    q: "Why won't my MOV play on Windows or Android?",
    a: "MOV is Apple's container, and some Windows apps and Android players handle it badly — especially iPhone clips recorded in HEVC. MP4 with H.264 + AAC is the one combination every device on earth plays, which is exactly what this tool produces.",
  },
  {
    q: "Will I lose quality converting MOV to MP4?",
    a: "Usually not at all. The tool first tries a lossless remux — repackaging your existing streams into an MP4 without touching the data. iPhone HEVC clips and MOVs with unusual codecs get re-encoded to H.264 + AAC at high quality (CRF 23), and the result tells you which path was taken.",
  },
  {
    q: "My iPhone video was recorded in HEVC. Will it work?",
    a: "Yes. HEVC (H.265) doesn't fit every MP4 use case, so HEVC clips take the re-encode path to H.264 + AAC — which plays on far more devices, including older phones, TVs, and browsers. It takes longer than a remux, but the result is the most compatible file possible.",
  },
  {
    q: "How big can my MOV file be?",
    a: "Up to about 50 MB. iPhone clips add up fast — a minute of 4K can be 400 MB — so trim or transfer shorter clips for browser conversion. The engine runs entirely in your browser's memory.",
  },
  {
    q: "Is my video uploaded anywhere?",
    a: "No. The ffmpeg video engine (~30 MB) loads once into your tab, and your MOV is converted locally. Your video never leaves your device — no server, no account, no watermark.",
  },
];

const steps = [
  {
    title: "Drop in a MOV file",
    text: "Choose a .mov file up to ~50MB — an iPhone clip, a screen recording, anything. It stays on your device; nothing is uploaded.",
  },
  {
    title: "Convert to MP4",
    text: "Press “Convert to MP4”. The tool tries an instant lossless remux first, and re-encodes to H.264 + AAC only when your MOV needs it (like iPhone HEVC clips).",
  },
  {
    title: "Preview and download",
    text: "Watch the MP4 right on the page, see whether it was remuxed or re-encoded, then download it. It plays on every phone, TV, and computer.",
  },
];

export default function MovToMp4Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd data={howToJsonLd(tool, steps)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/mov-to-mp4-converter" },
          { name: "MOV to MP4 Converter", path: "/tools/mov-to-mp4-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "MOV to MP4 Converter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free MOV to MP4 <em>Converter</em> Online
            </>
          }
          tagline="A free MOV to MP4 converter: turn MOV clips — including iPhone videos — into MP4s that play everywhere."
        />

        <MovToMp4ToolClient />
        <PrivacyNote>
          Conversion runs 100% in your browser with ffmpeg.wasm. Your MOV is never uploaded, stored, or seen by anyone.
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
              t: "MOV in, MP4 out",
              d: "This page converts MOV (.mov) files only — Apple's container, and the format iPhone cameras, QuickTime, and many screen recorders save in. Output is always a standard .mp4 that plays everywhere.",
            },
            {
              t: "Remux first, re-encode if needed",
              d: "The tool tries `-c copy` remuxing first: instant, lossless, same file size. iPhone HEVC clips and MOVs with unusual codecs take the re-encode path to H.264 + AAC — slower, but playable on far more devices. The result reports which path was taken.",
            },
            {
              t: "~50 MB file cap",
              d: "iPhone video adds up fast — a minute of 4K can be 400 MB — and the engine runs in browser memory, so files are capped at about 50 MB. Trim longer clips before converting.",
            },
            {
              t: "Private by design",
              d: "The ffmpeg engine (~30 MB) downloads once per visit, then conversions are local. No accounts, no uploads, no watermarks — your clips never leave your device.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your MP4</em></>} />
        <Steps steps={steps} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When conversion <em>helps</em></>}
          sub="From Apple-only to plays-anywhere."
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
              t: "iPhone videos for everyone",
              d: "An iPhone MOV — especially HEVC — won't play on some Windows PCs, Android phones, and smart TVs. Convert to MP4 and the clip opens for grandparents, clients, and colleagues alike.",
            },
            {
              t: "Upload to social and YouTube",
              d: "Social apps and upload forms prefer MP4. Convert your MOV screen recording or camera clip here and the upload goes through without a “format not supported” surprise.",
            },
            {
              t: "Windows-friendly clips",
              d: "Editing on a Windows machine? Some Windows editors and players handle MOV badly. An H.264 MP4 drops into any timeline — Premiere, DaVinci, CapCut — without transcoding headaches.",
            },
            {
              t: "Smaller files to share",
              d: "A re-encoded H.264 MP4 is typically much smaller than the original MOV, especially for HEVC iPhone footage. Same clip, easier to attach, message, or back up.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>MOV converter <em>questions</em></>} />
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
