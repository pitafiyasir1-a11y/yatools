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

import AudioToMp3Client from "./ToolClient";

const tool: ToolDef = {
  slug: "audio-to-mp3",
  name: "Audio to MP3",
  tagline: "A free online audio to MP3 converter: turn WAV, FLAC, M4A, and OGG into MP3 — in your browser.",
  description:
    "Audio to MP3 converter online free: convert WAV, FLAC, M4A, and OGG to MP3 with the LAME encoder. Choose 96–320 kbps. Runs in your browser, fully private.",
  category: "Audio & Speech",
  keyword: "audio to mp3 converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "mp4-to-mp3-converter",
    "audio-to-text",
    "text-to-speech"
],
};

export const metadata = pageMeta({
  title: "Audio to MP3 Converter - Any Audio to MP3 Free Online",
  description:
    "Audio to MP3 converter, free online: turn WAV, FLAC, M4A, and OGG into universal MP3 in your browser. No uploads, no sign-up. No watermarks, ever. Try it now!",
  path: "/tools/audio-to-mp3",
  keywords: [
    "audio to mp3 converter online",
    "convert audio to mp3",
    "wav to mp3 online",
    "audio converter",
    "mp3 converter online",
  ],
});

const faqs = [
  {
    q: "Which audio formats can I convert to MP3?",
    a: "WAV, FLAC, M4A/AAC, OGG, and Opus — anything your browser can decode. The file is decoded with your browser's own audio engine, then re-encoded to MP3 with LAME, the gold-standard MP3 encoder.",
  },
  {
    q: "What bitrate should I choose?",
    a: "96 kbps for the smallest files (fine for speech), 192 kbps as the everyday sweet spot for music, 320 kbps for the best quality MP3 can offer. Converting a low-quality source to 320 kbps won't improve it — match the bitrate to your source.",
  },
  {
    q: "My M4A file won't convert in Firefox. Why?",
    a: "Honest browser quirk: Firefox can't decode M4A/AAC audio in its Web Audio engine, so there's nothing to convert. Open the tool in Chrome or Edge instead — they decode M4A fine. WAV, FLAC, and OGG work in all browsers.",
  },
  {
    q: "Will converting FLAC to MP3 lose quality?",
    a: "MP3 is a lossy format, so technically yes — but at 192–320 kbps the difference from the original is inaudible to nearly everyone. If you need bit-perfect archiving, keep the FLAC; for listening and sharing, MP3 is the practical choice.",
  },
  {
    q: "Is there a file size limit?",
    a: "Yes — files up to ~50 MB. Decoding and encoding happen in your browser's memory, so very long high-resolution files are best converted in a desktop browser.",
  },
  {
    q: "Is my audio uploaded anywhere?",
    a: "No. The LAME encoder (~150 KB) loads once into your tab, and your file is decoded and encoded locally. Nothing ever leaves your device.",
  },
];

export default function AudioToMp3Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/audio-to-mp3" },
          { name: "Audio to MP3", path: "/tools/audio-to-mp3" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Audio to MP3" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Audio to <em>MP3 Converter</em> Online
            </>
          }
          tagline="A free online audio to MP3 converter: turn WAV, FLAC, M4A, and OGG into MP3 — in your browser."
        />

        <AudioToMp3Client />
        <PrivacyNote>
          Decoding and encoding run 100% in your browser. Your audio is never uploaded, stored, or seen by anyone.
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
              t: "WAV, FLAC, M4A, OGG in",
              d: "Anything your browser can decode. Note: Firefox can't decode M4A/AAC — use Chrome or Edge for those.",
            },
            {
              t: "LAME MP3 out",
              d: "The reference MP3 encoder, at 96, 128, 192, or 320 kbps. Mono and stereo both handled correctly.",
            },
            {
              t: "~50 MB file cap",
              d: "Everything happens in browser memory. Long high-res files convert best in a desktop browser.",
            },
            {
              t: "Private by design",
              d: "The ~150 KB encoder loads once per visit. No accounts, no uploads, no watermarks.",
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
              title: "Drop in an audio file",
              text: "Choose a WAV, FLAC, M4A, or OGG file up to ~50MB. It stays on your device — nothing is uploaded.",
            },
            {
              title: "Pick a quality",
              text: "96 kbps for smallest files, 192 for everyday music, 320 for best quality. Press “Convert to MP3”.",
            },
            {
              title: "Preview and download",
              text: "Listen to the MP3 right on the page, then download it — plays on every device ever made.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When conversion <em>helps</em></>}
          sub="MP3: the format everything speaks."
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
              t: "Huge WAVs → small MP3s",
              d: "A 3-minute WAV is ~30 MB; as a 192 kbps MP3 it's ~4 MB. Same listening experience, one-seventh the size.",
            },
            {
              t: "FLAC for the car",
              d: "Car stereos and older players often choke on FLAC. MP3 plays on literally everything with wheels or speakers.",
            },
            {
              t: "Voice memos to share",
              d: "M4A voice memos don't open everywhere. Convert to MP3 and anyone can play the recording.",
            },
            {
              t: "Podcast-ready files",
              d: "Podcast hosts and directories expect MP3. Convert your edited WAV/FLAC master to a 128–192 kbps MP3 for upload.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Audio converter <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["mp4-to-mp3-converter", "audio-to-text", "text-to-speech"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
