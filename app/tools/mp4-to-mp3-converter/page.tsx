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

import Mp4ToMp3Client from "./ToolClient";

const tool: ToolDef = {
  slug: "mp4-to-mp3-converter",
  name: "MP4 to MP3",
  tagline: "A free MP4 to MP3 converter: pull the audio out of any video as an MP3 — 128, 192, or 320 kbps.",
  description:
    "Convert MP4 to MP3 online free: extract audio from video in your browser with ffmpeg. Choose 128–320 kbps quality. No uploads, fully private.",
  category: "Everyday Utilities",
  keyword: "mp4 to mp3 converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "video-to-gif-converter",
    "audio-to-text",
    "video-converter"
],
};

export const metadata = pageMeta({
  title: "MP4 to MP3 Converter - Extract Video Audio Free Online",
  description:
    "MP4 to MP3 converter, free online: extract audio from any video at 128, 192, or 320 kbps in your browser. No uploads, no sign-up. Try it now — it’s free!",
  path: "/tools/mp4-to-mp3-converter",
  keywords: [
    "MP4 to MP3",
    "MP4 to MP3 converter",
    "video to audio",
    "extract audio from MP4",
    "MP4 to MP3 free",
  ],
});

const faqs = [
  {
    q: "How do I extract audio from a video?",
    a: "Drop in your video, pick a quality (128, 192, or 320 kbps), and press “Extract MP3”. The audio track is pulled out with ffmpeg running in your browser — then preview it and download the MP3.",
  },
  {
    q: "What quality should I choose?",
    a: "128 kbps is plenty for speech — lectures, interviews, podcasts. 192 kbps is the sweet spot for music. 320 kbps is near-CD quality for archiving, with a bigger file. You can't gain quality beyond the video's original audio, though.",
  },
  {
    q: "Is there a file size limit?",
    a: "Yes — videos up to ~100 MB. The conversion happens in your browser's memory, so very large files can slow down or strain low-end phones. Trim long videos first if needed.",
  },
  {
    q: "My video has no sound / the extraction failed. Why?",
    a: "Some videos (screen recordings, animations) have no audio track — there's nothing to extract. If the format is unusual, convert the video to MP4 first with our Video Converter and try again.",
  },
  {
    q: "Is my video uploaded anywhere?",
    a: "No. The video is processed locally by ffmpeg.wasm inside your browser tab. It never touches a server — that's why the tool is free and private.",
  },
  {
    q: "Why MP3 and not another format?",
    a: "MP3 plays on literally everything — phones, cars, old stereos, every app. If you need lossless quality for editing, extract at 320 kbps; for archiving masters, keep the original video file too.",
  },
];

export default function Mp4ToMp3Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/mp4-to-mp3-converter" },
          { name: "MP4 to MP3", path: "/tools/mp4-to-mp3-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "MP4 to MP3" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free MP4 to <em>MP3 Converter</em> Online
            </>
          }
          tagline="A free MP4 to MP3 converter: pull the audio out of any video as an MP3 — 128, 192, or 320 kbps."
        />

        <Mp4ToMp3Client />
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
              t: "Any video in",
              d: "MP4, WebM, MOV, MKV — if your browser can read the container, the audio track can be extracted.",
            },
            {
              t: "MP3 out, 3 qualities",
              d: "128 kbps for speech, 192 kbps for music, 320 kbps for best quality. Encoded with LAME inside ffmpeg.",
            },
            {
              t: "~100 MB file cap",
              d: "Processing happens in browser memory, so very large videos can strain phones. Trim first if your file is huge.",
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
        <SectionHead label="How it works" title={<>Three steps to <em>your MP3</em></>} />
        <Steps
          steps={[
            {
              title: "Drop in a video",
              text: "Choose any video file up to ~100MB. It stays on your device — nothing is uploaded.",
            },
            {
              title: "Pick a quality",
              text: "128 kbps for speech, 192 for music, 320 for the best quality. Press “Extract MP3”.",
            },
            {
              title: "Preview and download",
              text: "Listen to the result right on the page, then download the MP3 with one click.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When extraction <em>helps</em></>}
          sub="Keep the sound, skip the video."
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
              t: "Lectures on the go",
              d: "Turn recorded classes or webinars into MP3s you can listen to like a podcast — far smaller files than video.",
            },
            {
              t: "Music from clips",
              d: "Save the audio of a performance or music video for offline listening where you only need the sound.",
            },
            {
              t: "Voice notes & interviews",
              d: "A video interview's audio is easier to transcribe, share, or archive than the full video file.",
            },
            {
              t: "Ringtones & samples",
              d: "Grab a sound bite from any video, then trim it down to a ringtone or sample with an audio editor.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>MP3 extraction <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["video-to-gif-converter", "audio-to-text", "video-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
