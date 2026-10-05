import WavToMp3ToolClient from "./ToolClient";
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
  slug: "wav-to-mp3-converter",
  name: "WAV to MP3 Converter",
  tagline: "A free WAV to MP3 converter: turn WAV audio into universal MP3 with the LAME encoder — 128, 192, or 320 kbps.",
  description:
    "WAV to MP3 converter online free: convert WAV to MP3 with the LAME encoder at 128–320 kbps. Runs 100% in your browser — no uploads, no sign-up.",
  category: "Audio & Speech",
  keyword: "wav to mp3 converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "m4a-to-mp3-converter",
    "flac-to-mp3-converter",
    "audio-to-text"
],
};

export const metadata = pageMeta({
  title: "WAV to MP3 Converter - Convert WAV Audio Free Online",
  description:
    "WAV to MP3 converter, free online: convert WAV with the LAME encoder — pick 128, 192, or 320 kbps. Runs 100% in your browser, no uploads. Try it now — free!",
  path: "/tools/wav-to-mp3-converter",
  keywords: [
    "WAV to MP3",
    "WAV to MP3 converter",
    "convert WAV to MP3",
    "WAV to MP3 free",
    "audio converter",
  ],
});

const faqs = [
  {
    q: "Will converting WAV to MP3 lose quality?",
    a: "MP3 is a lossy format, so data is compressed — but at 192–320 kbps the difference from the original WAV is inaudible to nearly everyone. Rule of thumb: keep your WAV as the archive master, and share or listen to the MP3.",
  },
  {
    q: "What bitrate should I choose?",
    a: "128 kbps for the smallest files (fine for speech), 192 kbps as the everyday sweet spot for music, 320 kbps for the best quality MP3 can offer. One honest note: converting can't add quality that isn't in the source — match the setting to your needs.",
  },
  {
    q: "How big can my WAV file be?",
    a: "Up to about 50 MB. Decoding and encoding happen in your browser's memory, so very long high-resolution recordings are best converted in a desktop browser. A 3-minute CD-quality WAV is roughly 30 MB, so most songs fit comfortably.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. This WAV to MP3 converter runs entirely in your browser — on phones, tablets, and desktops. The LAME encoder (~150 KB) loads once per visit, and conversions after that are instant.",
  },
  {
    q: "Is my audio uploaded anywhere?",
    a: "No. Your WAV is decoded and re-encoded locally in your tab. The file never leaves your device — there is no server receiving it, no account, and no watermark added to your MP3.",
  },
];

const steps = [
  {
    title: "Drop in a WAV file",
    text: "Choose a .wav file up to ~50MB. It stays on your device — the page never uploads it anywhere.",
  },
  {
    title: "Pick a bitrate",
    text: "128 kbps for the smallest file, 192 for the music sweet spot, 320 for best quality. Then press “Convert to MP3”.",
  },
  {
    title: "Preview and download",
    text: "Listen to the MP3 right on the page to check it, then download it. It plays on every phone, computer, and car stereo.",
  },
];

export default function WavToMp3Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd data={howToJsonLd(tool, steps)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/wav-to-mp3-converter" },
          { name: "WAV to MP3 Converter", path: "/tools/wav-to-mp3-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "WAV to MP3 Converter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free WAV to MP3 <em>Converter</em> Online
            </>
          }
          tagline="A free WAV to MP3 converter: turn WAV audio into universal MP3 with the LAME encoder — 128, 192, or 320 kbps."
        />

        <WavToMp3ToolClient />
        <PrivacyNote>
          Decoding and encoding run 100% in your browser. Your WAV is never uploaded, stored, or seen by anyone.
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
              t: "WAV in, MP3 out",
              d: "This page converts WAV (.wav) files only — the uncompressed format behind CDs, studio recordings, and voice recorders. PCM at 16, 24, or 32 bit, mono or stereo: if your browser can play it, this tool can convert it.",
            },
            {
              t: "The LAME encoder",
              d: "MP3s here are encoded with LAME, the reference MP3 encoder trusted by professionals for over two decades. Three honest bitrates: 128 kbps for the smallest files, 192 for everyday music, 320 for the best quality MP3 offers.",
            },
            {
              t: "~50 MB file cap",
              d: "Decoding and encoding happen in your browser's memory, so files are capped at about 50 MB. A 3-minute CD-quality WAV is roughly 30 MB, so most songs and recordings fit comfortably.",
            },
            {
              t: "Private by design",
              d: "The ~150 KB encoder loads once per visit, and your audio never leaves your device — it never touches a server. No accounts, no uploads, no watermarks on your MP3.",
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
        <Steps steps={steps} />

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
              t: "Shrink huge recordings",
              d: "A 3-minute WAV is about 30 MB; the same audio as a 192 kbps MP3 is under 4.5 MB. Same listening experience, roughly one-seventh the size — easy to email, message, or upload.",
            },
            {
              t: "Share with everyone",
              d: "MP3 plays on every device ever made: phones, laptops, car stereos, smart speakers. A WAV exported from a recorder or music app doesn't always.",
            },
            {
              t: "Prep for podcasts and uploads",
              d: "Podcast hosts, video editors, and music distributors expect MP3. Export your WAV master, convert it here, and upload the smaller file.",
            },
            {
              t: "Voice recordings to go",
              d: "Recorders and phones often save voice as WAV. Convert to MP3 and the file is small enough to attach to any email or chat without a fight.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>WAV converter <em>questions</em></>} />
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
