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

import VideoConverterClient from "./ToolClient";

const tool: ToolDef = {
  slug: "video-converter",
  name: "Video Converter",
  tagline: "A free video converter online: turn MOV, MKV, and WebM into MP4 that plays everywhere.",
  description:
    "Video converter online free: convert MOV, MKV, WebM, and AVI to MP4 (H.264 + AAC) in your browser. Fast remux when possible, re-encode fallback. No uploads.",
  category: "Everyday Utilities",
  keyword: "video converter online free",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "video-trimmer",
    "mp4-to-mp3-converter",
    "video-to-gif-converter"
],
};

export const metadata = pageMeta({
  title: "Free Video Converter - Convert Videos to MP4 Online",
  description:
    "Video converter online, free: turn MOV, MKV, and WebM into MP4 that plays everywhere. Runs in your browser, no uploads. No watermarks, ever. Try it now!",
  path: "/tools/video-converter",
  keywords: [
    "video converter online free",
    "convert video online",
    "mov to mp4 online",
    "mkv to mp4 online",
    "free video converter",
  ],
});

const faqs = [
  {
    q: "Which formats can I convert to MP4?",
    a: "MOV (iPhone/Mac), MKV, WebM, and AVI — anything your browser's file picker hands over. The output is always MP4 with H.264 video and AAC audio, the combination that plays on virtually every device.",
  },
  {
    q: "How fast is the conversion?",
    a: "Often seconds. The tool first tries a remux — repackaging the existing video and audio streams into MP4 without touching them, which is instant and loses zero quality. Only if the codecs can't live in MP4 (like VP9 or AV1) does it fall back to a full re-encode, which takes longer. The result screen tells you which path was used.",
  },
  {
    q: "Will I lose quality?",
    a: "Not with a remux — streams are copied bit-for-bit. With a re-encode there's a small, usually invisible quality cost. Either way the tool reports exactly what it did, so there are no surprises.",
  },
  {
    q: "Do subtitles survive the conversion?",
    a: "No — only the video and audio streams are carried over; subtitle tracks are dropped. If you need burned-in subtitles, add them in a video editor first.",
  },
  {
    q: "My iPhone video won't play on Windows. Will this fix it?",
    a: "Usually, yes. iPhone videos are MOV files that some Windows players and older devices choke on. Converting to MP4 (H.264 + AAC) fixes playback in the vast majority of cases.",
  },
  {
    q: "Is my video uploaded anywhere?",
    a: "No. The conversion runs locally with ffmpeg.wasm in your browser tab — your file never touches a server, which is also why there are no queues or watermarks.",
  },
];

export default function VideoConverterPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/video-converter" },
          { name: "Video Converter", path: "/tools/video-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Video Converter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Video <em>Converter</em> Online
            </>
          }
          tagline="A free video converter online: turn MOV, MKV, and WebM into MP4 that plays everywhere."
        />

        <VideoConverterClient />
        <PrivacyNote>
          Conversion runs 100% in your browser with ffmpeg.wasm. Your video is never uploaded, stored, or seen by anyone.
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
              t: "MOV, MKV, WebM, AVI in",
              d: "Any common container up to ~100MB. Already-MP4 files are rejected politely — there's nothing to convert.",
            },
            {
              t: "MP4 (H.264 + AAC) out",
              d: "The most compatible combination in existence, with faststart so it streams before fully downloading.",
            },
            {
              t: "Remux first, re-encode fallback",
              d: "Compatible codecs are repackaged instantly with zero quality loss; incompatible ones are re-encoded. You're told which happened.",
            },
            {
              t: "Private by design",
              d: "First run loads the ~30 MB video engine once. No accounts, no uploads, no watermarks.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>MP4</em></>} />
        <Steps
          steps={[
            {
              title: "Drop in a video",
              text: "Choose a MOV, MKV, WebM, or AVI file up to ~100MB. It stays on your device — nothing is uploaded.",
            },
            {
              title: "Convert",
              text: "Press “Convert to MP4”. The tool tries an instant remux first, and re-encodes only if the codecs demand it.",
            },
            {
              title: "Preview and download",
              text: "Watch the converted MP4 right on the page, see how it was converted, then download it.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When converting <em>helps</em></>}
          sub="One format to play them all."
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
              t: "iPhone videos on Windows",
              d: "MOV files from iPhones confuse some Windows players and older TVs. MP4 just plays.",
            },
            {
              t: "MKV for sharing",
              d: "MKV is a great archive format but a poor sharing one. Convert to MP4 before sending to anyone.",
            },
            {
              t: "WebM for editors",
              d: "Many desktop editors and phones handle WebM poorly. An MP4 intermediate edits smoothly everywhere.",
            },
            {
              t: "Uploads that demand MP4",
              d: "Plenty of sites, forms, and course platforms only accept MP4. Convert once, upload anywhere.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Converter <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["video-trimmer", "mp4-to-mp3-converter", "video-to-gif-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
