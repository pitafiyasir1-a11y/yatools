import AudioCutterClient from "./ToolClient";
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
} from "@/lib/site";

const tool = toolBySlug("audio-cutter")!;

export const metadata = pageMeta({
  title: "Audio Cutter Online Free - Cut MP3 & Audio Files Free",
  description:
    "Audio cutter online free: upload an MP3, WAV, M4A or FLAC file, pick start and end points, and export the trimmed clip as MP3. Runs in your browser, no sign-up.",
  path: "/tools/audio-cutter",
  keywords: [
    "audio cutter online free",
    "audio cutter online",
    "cut mp3 online free",
    "mp3 cutter online",
    "trim audio online",
    "audio trimmer free",
  ],
});

const faqs = [
  {
    q: "How do I cut an audio file?",
    a: "Upload your audio, listen to find your cut points, and either type the start/end times in seconds or press “Use current ▶ start/end” at the playback position. Then press “Cut & export MP3”.",
  },
  {
    q: "What formats can I cut?",
    a: "MP3, WAV, M4A, FLAC, OGG, Opus, and AAC — up to about 100 MB. The output is always MP3 at 192 kbps, which plays on every phone, browser, and editor.",
  },
  {
    q: "Will cutting reduce the quality?",
    a: "The clip is re-encoded to MP3 at 192 kbps, which sounds the same as the original for normal listening. The output plays everywhere: phones, browsers, and editors.",
  },
  {
    q: "Can I cut the middle out?",
    a: "This tool exports one continuous clip between your start and end. To remove a middle section, export the two halves separately — most free editors can join them in seconds.",
  },
  {
    q: "Is there a length or size limit?",
    a: "Files up to ~100 MB. Cutting happens in browser memory, so short and medium clips are quick; very long recordings take a while.",
  },
  {
    q: "Is my audio uploaded anywhere?",
    a: "No. Cutting runs locally with ffmpeg.wasm in your browser tab. Your audio never touches a server.",
  },
];

export default function AudioCutterPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Audio Cutter", path: "/tools/audio-cutter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Audio Cutter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free <em>Audio Cutter</em> Online
            </>
          }
          tagline="Cut MP3 and audio files in your browser: pick the part you want and export it as a new MP3 — no upload, no sign-up."
        />

        <AudioCutterClient />
        <PrivacyNote>
          Cutting runs 100% in your browser with ffmpeg.wasm. Your audio is never uploaded, stored,
          or seen by anyone.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your clip</em></>} />
        <Steps
          steps={[
            {
              title: "Drop in an audio file",
              text: "Choose any audio file up to ~100MB. Listen to find where your clip starts and ends.",
            },
            {
              title: "Set cut points",
              text: "Type start/end times in seconds, or pause at the right moment and press “Use current ▶ start/end”.",
            },
            {
              title: "Export the MP3",
              text: "Press “Cut & export MP3”, preview the result, and download your clip.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Audio cutter <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["audio-to-mp3", "video-trimmer", "mp4-to-mp3-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
