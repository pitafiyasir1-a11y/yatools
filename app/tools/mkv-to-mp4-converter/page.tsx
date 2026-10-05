import MkvToMp4ToolClient from "./ToolClient";
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
  slug: "mkv-to-mp4-converter",
  name: "MKV to MP4 Converter",
  tagline: "A free MKV to MP4 converter: turn MKV video into universal MP4 — remux or re-encode, in your browser.",
  description:
    "MKV to MP4 converter online free: remux MKV to MP4 instantly when possible, re-encode to H.264 + AAC when needed. Runs 100% in your browser — no uploads.",
  category: "Everyday Utilities",
  keyword: "mkv to mp4 converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "mov-to-mp4-converter",
    "video-compressor",
    "video-converter"
],
};

export const metadata = pageMeta({
  title: "MKV to MP4 Converter - Change MKV Videos Free Online",
  description:
    "MKV to MP4 converter, free online: remux or re-encode MKV video into universal MP4 in your browser. No uploads, no sign-up. No watermarks, ever. Try it now!",
  path: "/tools/mkv-to-mp4-converter",
  keywords: [
    "MKV to MP4",
    "MKV to MP4 converter",
    "convert MKV to MP4",
    "MKV to MP4 free",
    "MKV converter",
  ],
});

const faqs = [
  {
    q: "Will I lose quality converting MKV to MP4?",
    a: "Usually not at all. This tool first tries a remux — repackaging your existing video and audio streams into an MP4 container without touching the data, so quality and size stay identical. Only if your MKV's codecs can't live in MP4 does it re-encode to H.264 + AAC, and it tells you which path was taken.",
  },
  {
    q: "Why did my file get re-encoded instead of remuxed?",
    a: "MP4 is pickier than MKV about which codecs it allows. If your MKV uses something like VP9 video or Opus audio, those streams can't go into an MP4 as-is, so the tool re-encodes them to H.264 + AAC — the pair every player understands. The re-encode uses high-quality settings (CRF 23) to keep the difference invisible.",
  },
  {
    q: "What happens to subtitles and extra audio tracks?",
    a: "A remux keeps the streams that fit in MP4; the re-encode path converts the main video and audio tracks. Soft subtitle tracks don't always survive the trip into MP4 — if you need subtitles, hardcode them before converting, or keep the original MKV.",
  },
  {
    q: "How big can my MKV file be?",
    a: "Up to about 50 MB. The video engine runs in your browser's memory, so very large movies are best converted with desktop software. Clips, episodes, and recordings under the cap convert fine.",
  },
  {
    q: "Is my video uploaded anywhere?",
    a: "No. The ffmpeg video engine (~30 MB) loads once into your tab, and your MKV is converted locally. Your video never leaves your device — no server, no account, no watermark.",
  },
];

const steps = [
  {
    title: "Drop in an MKV file",
    text: "Choose a .mkv file up to ~50MB. It stays on your device — the page never uploads it anywhere.",
  },
  {
    title: "Convert to MP4",
    text: "Press “Convert to MP4”. The tool tries an instant lossless remux first, and re-encodes to H.264 + AAC only if your MKV's codecs need it.",
  },
  {
    title: "Preview and download",
    text: "Watch the MP4 right on the page, see whether it was remuxed or re-encoded, then download it. It plays on every phone, TV, and computer.",
  },
];

export default function MkvToMp4Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd data={howToJsonLd(tool, steps)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/mkv-to-mp4-converter" },
          { name: "MKV to MP4 Converter", path: "/tools/mkv-to-mp4-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "MKV to MP4 Converter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free MKV to MP4 <em>Converter</em> Online
            </>
          }
          tagline="A free MKV to MP4 converter: turn MKV video into universal MP4 — remux or re-encode, in your browser."
        />

        <MkvToMp4ToolClient />
        <PrivacyNote>
          Conversion runs 100% in your browser with ffmpeg.wasm. Your MKV is never uploaded, stored, or seen by anyone.
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
              t: "MKV in, MP4 out",
              d: "This page converts MKV (.mkv) files only — the flexible container format popular for movies, shows, and screen recordings. Output is always a standard .mp4 that plays everywhere.",
            },
            {
              t: "Remux first, re-encode if needed",
              d: "The tool tries `-c copy` remuxing first: instant, lossless, same file size. If your MKV holds codecs MP4 can't contain (VP9, Opus, and friends), it re-encodes to H.264 + AAC at high quality — and reports which path was taken.",
            },
            {
              t: "~50 MB file cap",
              d: "The video engine runs in your browser's memory, so files are capped at about 50 MB. Clips, episodes, and recordings under the cap convert fine; full-length movies belong in desktop software.",
            },
            {
              t: "Private by design",
              d: "The ffmpeg engine (~30 MB) downloads once per visit, then conversions are local. No accounts, no uploads, no watermarks — and no record of what you converted.",
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
          sub="MKV is flexible; MP4 is universal."
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
              t: "Play MKVs on any TV or phone",
              d: "Smart TVs, iPhones, and game consoles often refuse MKV files. Convert to MP4 and the same video plays from a USB stick, a media server, or your camera roll.",
            },
            {
              t: "Upload footage anywhere",
              d: "YouTube, Instagram, and most upload forms prefer MP4. If your recording or download came as MKV, convert it here and the upload just works.",
            },
            {
              t: "Send videos that actually open",
              d: "An MKV attachment confuses half the apps out there. An MP4 opens on the recipient's phone with zero explanation needed — no “what app do I need?” messages.",
            },
            {
              t: "Archive-friendly copies",
              d: "Keep the original MKV as your master, and keep MP4 copies for everyday watching. MP4's H.264 + AAC pairing will still play on devices built a decade from now.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>MKV converter <em>questions</em></>} />
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
