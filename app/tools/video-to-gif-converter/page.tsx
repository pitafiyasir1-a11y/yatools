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

import VideoToGifClient from "./ToolClient";

const tool: ToolDef = {
  slug: "video-to-gif-converter",
  name: "Video to GIF",
  tagline: "A free video to GIF converter: turn any clip into a looping GIF — set frame rate, size, and trim.",
  description:
    "Video to GIF converter online free: make GIFs from MP4, WebM, or MOV in your browser. Choose start time, length, fps, and size. No uploads, fully private.",
  category: "Everyday Utilities",
  keyword: "video to gif converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "gif-to-mp4-converter",
    "mp4-to-mp3-converter",
    "video-trimmer"
],
};

export const metadata = pageMeta({
  title: "Video to GIF Converter - Turn Clips into GIFs Free Online",
  description:
    "Video to GIF converter, free online: turn any clip into a looping GIF with frame-rate, size, and trim controls. No watermark. No account needed. Try it now!",
  path: "/tools/video-to-gif-converter",
  keywords: [
    "video to GIF",
    "video to GIF converter",
    "MP4 to GIF",
    "create GIF from video",
    "video to GIF maker",
  ],
});

const faqs = [
  {
    q: "How do I make a GIF from a video?",
    a: "Upload your video, scrub the preview to find the moment, set the start time and length (up to 10 seconds), choose smoothness and width, and press “Make GIF”. The GIF is rendered in your browser with a two-pass palette for clean colors.",
  },
  {
    q: "Why are GIFs capped at 10 seconds?",
    a: "GIF is an old, inefficient format — every frame is a full image. A 10-second GIF at decent quality is already several megabytes. Longer clips would produce enormous files that are painful to share. For longer moments, trim the video itself instead.",
  },
  {
    q: "How do I get the best-looking GIF?",
    a: "Pick a short moment (2–4 seconds), 15 fps for smoothness, and 480px width for sharpness. The tool uses a two-pass palette (palettegen + paletteuse), which looks far better than naive conversion — no dithering mush.",
  },
  {
    q: "Can I add text or captions to the GIF?",
    a: "Not in this tool — it converts a clean clip. If you need captions, add them in any free video editor first, then convert the captioned clip here.",
  },
  {
    q: "Do GIFs loop automatically?",
    a: "Yes — GIFs loop by nature wherever they're displayed: chats, social posts, and docs all replay them automatically.",
  },
  {
    q: "Is my video uploaded anywhere?",
    a: "No. The conversion runs locally with ffmpeg.wasm in your browser tab. Your video never touches a server.",
  },
];

export default function VideoToGifPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/video-to-gif-converter" },
          { name: "Video to GIF", path: "/tools/video-to-gif-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Video to GIF" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Video to <em>GIF Converter</em> Online
            </>
          }
          tagline="A free video to GIF converter: turn any clip into a looping GIF — set frame rate, size, and trim."
        />

        <VideoToGifClient />
        <PrivacyNote>
          Conversion runs 100% in your browser with ffmpeg.wasm. Your video is never uploaded, stored, or seen by anyone.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>make</em></>}
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
              t: "Up to 10 seconds",
              d: "GIFs are capped at 10 seconds per clip — longer ones become enormous files. Pick the best moment, not the whole video.",
            },
            {
              t: "Quality controls",
              d: "10 or 15 fps, 320 or 480px wide. Two-pass palette conversion for clean colors instead of naive dithering.",
            },
            {
              t: "Any video in",
              d: "MP4, WebM, MOV, MKV up to ~100MB. Scrub the preview to find your moment, then set start and length in seconds.",
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
        <SectionHead label="How it works" title={<>Three steps to <em>your GIF</em></>} />
        <Steps
          steps={[
            {
              title: "Drop in a video",
              text: "Choose any video up to ~100MB. Scrub the preview to find the exact moment you want.",
            },
            {
              title: "Set the clip",
              text: "Enter the start time and length (max 10s), then pick smoothness (fps) and width for quality vs. file size.",
            },
            {
              title: "Make and download",
              text: "Press “Make GIF”, preview the loop, and download it — ready for chats, posts, and docs.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When a GIF <em>helps</em></>}
          sub="Some moments deserve to loop."
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
              t: "Reactions for chats",
              d: "That perfect 3-second reaction from a video beats any emoji pack — and it's yours, not a stock GIF.",
            },
            {
              t: "Bug reports & tutorials",
              d: "Show a UI glitch or a quick how-to as a looping GIF in issues, docs, and chat — no video player needed.",
            },
            {
              t: "Social posts",
              d: "Short looping clips catch the eye in feeds far better than a static thumbnail. Keep them under 5 seconds for punch.",
            },
            {
              t: "Memes & highlights",
              d: "Sports highlights, funny moments, quotable scenes — clip the best seconds and share them everywhere GIFs work.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>GIF maker <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["gif-to-mp4-converter", "mp4-to-mp3-converter", "video-trimmer"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
