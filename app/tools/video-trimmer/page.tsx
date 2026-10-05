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

import VideoTrimmerClient from "./ToolClient";

const tool: ToolDef = {
  slug: "video-trimmer",
  name: "Video Trimmer",
  tagline: "A free video trimmer online: cut out exactly the part you want — frame-accurate MP4 export, no upload.",
  description:
    "Trim video online free: cut MP4, WebM, or MOV clips in your browser with frame-accurate precision. Export as MP4 (H.264 + AAC). No uploads, fully private.",
  category: "Everyday Utilities",
  keyword: "video trimmer online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "video-converter",
    "mp4-to-mp3-converter",
    "video-to-gif-converter"
],
};

export const metadata = pageMeta({
  title: "Video Trimmer Online - Cut Video Clips Free Online",
  description:
    "Video trimmer online, free: cut out exactly the part you want with frame-accurate MP4 export. Runs in your browser, no uploads. Try it now — it’s free!",
  path: "/tools/video-trimmer",
  keywords: [
    "video trimmer online",
    "trim video online",
    "cut video online",
    "mp4 trimmer",
    "video cutter online",
  ],
});

const faqs = [
  {
    q: "How do I trim a video?",
    a: "Upload your video, scrub the preview to find your cut points, and either type the start/end times in seconds or press “Use current ▶ start/end” at the playback position. Then press “Trim & export MP4”.",
  },
  {
    q: "Are the cuts frame-accurate?",
    a: "Yes. The clip is re-encoded (H.264 + AAC), so cuts land exactly where you set them — not just on the nearest keyframe like quick-cut tools.",
  },
  {
    q: "Will trimming reduce the quality?",
    a: "Re-encoding always costs a tiny amount of quality, but at the settings used here the difference is invisible for normal viewing. The output plays everywhere: phones, browsers, TVs, editors.",
  },
  {
    q: "Is there a length or size limit?",
    a: "Videos up to ~100 MB. Trimming a long video takes longer because it's re-encoded — a few minutes of footage is comfortable; an hour-long file will be slow on most devices.",
  },
  {
    q: "Can I trim the middle out (cut a section and join the rest)?",
    a: "This tool exports one continuous clip between your start and end. To remove a middle section, export the two halves separately — most free editors can join them in seconds.",
  },
  {
    q: "Is my video uploaded anywhere?",
    a: "No. Trimming runs locally with ffmpeg.wasm in your browser tab. Your video never touches a server.",
  },
];

export default function VideoTrimmerPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/video-trimmer" },
          { name: "Video Trimmer", path: "/tools/video-trimmer" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Video Trimmer" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Video <em>Trimmer</em> Online
            </>
          }
          tagline="A free video trimmer online: cut out exactly the part you want — frame-accurate MP4 export, no upload."
        />

        <VideoTrimmerClient />
        <PrivacyNote>
          Trimming runs 100% in your browser with ffmpeg.wasm. Your video is never uploaded, stored, or seen by anyone.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>trim</em></>}
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
              t: "Frame-accurate cuts",
              d: "Start/end in tenths of a second, re-encoded so cuts land exactly where you set them — no keyframe snapping.",
            },
            {
              t: "MP4 out, plays everywhere",
              d: "Exports H.264 + AAC with faststart, the most compatible combination there is: phones, browsers, TVs, editors.",
            },
            {
              t: "~100 MB file cap",
              d: "Re-encoding happens in browser memory. Short and medium clips are quick; very long videos take a while.",
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
        <SectionHead label="How it works" title={<>Three steps to <em>your clip</em></>} />
        <Steps
          steps={[
            {
              title: "Drop in a video",
              text: "Choose any video up to ~100MB. Scrub the preview to find where your clip starts and ends.",
            },
            {
              title: "Set cut points",
              text: "Type start/end times in seconds, or pause at the right frame and press “Use current ▶ start/end”.",
            },
            {
              title: "Export the MP4",
              text: "Press “Trim & export MP4”, preview the result, and download your clip.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When trimming <em>helps</em></>}
          sub="Keep the good part, lose the rest."
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
              t: "Cut the boring bits",
              d: "Long intros, dead air at the start, rambling outros — trim a recording down to the part worth watching.",
            },
            {
              t: "Clips for social",
              d: "Pull a 30-second highlight from a longer video, sized right for sharing where short clips win.",
            },
            {
              t: "Trim screen recordings",
              d: "Recordings always include fumbling at the start and end. Cut them off and the result looks professional.",
            },
            {
              t: "Sample before converting",
              d: "Not sure a big file is worth converting? Trim a 10-second sample first and test it.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Trimmer <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["video-converter", "mp4-to-mp3-converter", "video-to-gif-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
