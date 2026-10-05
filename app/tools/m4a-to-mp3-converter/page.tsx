import M4aToMp3ToolClient from "./ToolClient";
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
  slug: "m4a-to-mp3-converter",
  name: "M4A to MP3 Converter",
  tagline: "A free M4A to MP3 converter: turn iPhone M4A audio into universal MP3 — in your browser, no upload.",
  description:
    "M4A to MP3 converter online free: convert M4A to MP3 with the LAME encoder at 128–320 kbps. Runs 100% in your browser — no uploads, no sign-up.",
  category: "Audio & Speech",
  keyword: "m4a to mp3 converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "wav-to-mp3-converter",
    "flac-to-mp3-converter",
    "audio-to-text"
],
};

export const metadata = pageMeta({
  title: "M4A to MP3 Converter - Convert M4A Audio Free Online",
  description:
    "M4A to MP3 converter, free online: turn iPhone M4A audio into universal MP3 with the LAME encoder. No uploads, no sign-up. No watermarks, ever. Try it now!",
  path: "/tools/m4a-to-mp3-converter",
  keywords: [
    "M4A to MP3",
    "M4A to MP3 converter",
    "convert M4A to MP3",
    "iPhone audio to MP3",
    "M4A converter",
  ],
});

const faqs = [
  {
    q: "Why won't my M4A convert in Firefox?",
    a: "Honest browser quirk: Firefox can't decode M4A/AAC audio in its Web Audio engine, so there is nothing to convert. Open this tool in Chrome, Edge, or Safari instead — they decode M4A fine. WAV, FLAC, and OGG work in every browser.",
  },
  {
    q: "Can I convert an iPhone voice memo?",
    a: "Yes — that's the most common use. iPhone Voice Memos save as M4A, which many Windows apps and older players can't open. Convert the memo to MP3 here and it will play anywhere. Just transfer the .m4a file to your browser first.",
  },
  {
    q: "What bitrate should I choose?",
    a: "128 kbps for the smallest files (great for voice), 192 kbps as the everyday sweet spot for music, 320 kbps for the best quality MP3 can offer. M4A voice memos are usually low-bitrate already — 128 or 192 kbps is plenty for them.",
  },
  {
    q: "How big can my M4A file be?",
    a: "Up to about 50 MB. Decoding and encoding happen in your browser's memory, so very long recordings are best converted in a desktop browser. Most voice memos are only a few megabytes.",
  },
  {
    q: "Is my audio uploaded anywhere?",
    a: "No. Your M4A is decoded and re-encoded locally in your tab. The file never leaves your device — no server receives it, no account is needed, and no watermark is added to your MP3.",
  },
];

const steps = [
  {
    title: "Drop in an M4A file",
    text: "Choose a .m4a file up to ~50MB — a voice memo, a recording, a song. It stays on your device; nothing is uploaded.",
  },
  {
    title: "Pick a bitrate",
    text: "128 kbps for voice and smallest files, 192 for music, 320 for best quality. Then press “Convert to MP3”.",
  },
  {
    title: "Preview and download",
    text: "Listen to the MP3 right on the page, then download it. It plays on every phone, computer, and car stereo.",
  },
];

export default function M4aToMp3Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd data={howToJsonLd(tool, steps)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/m4a-to-mp3-converter" },
          { name: "M4A to MP3 Converter", path: "/tools/m4a-to-mp3-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "M4A to MP3 Converter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free M4A to MP3 <em>Converter</em> Online
            </>
          }
          tagline="A free M4A to MP3 converter: turn iPhone M4A audio into universal MP3 — in your browser, no upload."
        />

        <M4aToMp3ToolClient />
        <PrivacyNote>
          Decoding and encoding run 100% in your browser. Your M4A is never uploaded, stored, or seen by anyone.
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
              t: "M4A in, MP3 out",
              d: "This page converts M4A (.m4a) files only — the format iPhone Voice Memos, music apps, and many recorders save in. If your browser can play it, this tool can convert it.",
            },
            {
              t: "The LAME encoder",
              d: "MP3s here are encoded with LAME, the reference MP3 encoder trusted by professionals for over two decades. 128 kbps for voice, 192 for everyday music, 320 for the best quality MP3 offers.",
            },
            {
              t: "Firefox can't decode M4A",
              d: "One honest caveat: Firefox can't decode M4A in-browser, so M4A conversion needs Chrome, Edge, or Safari. It's a browser limitation, not a bug in this tool.",
            },
            {
              t: "Private by design",
              d: "The ~150 KB encoder loads once per visit, and your audio never leaves your device. No accounts, no uploads, no watermarks — and a ~50 MB file cap since everything runs in browser memory.",
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
          sub="M4A is common; MP3 is universal."
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
              t: "iPhone voice memos for everyone",
              d: "Voice Memos save as M4A, which Windows Media Player and many older devices can't open. Convert to MP3 and the recording plays anywhere — perfect for sharing interviews and notes.",
            },
            {
              t: "Music that actually opens",
              d: "Some music apps and recorders export M4A by default. Convert to MP3 and the track plays on every phone, car stereo, and DJ setup without a codec surprise.",
            },
            {
              t: "Podcast-ready episodes",
              d: "Podcast directories expect MP3. If your recording app handed you an M4A, convert it here at 128–192 kbps and upload the file your host wants.",
            },
            {
              t: "Small files for messaging",
              d: "Long M4A recordings can be awkward to attach. An MP3 at 128 kbps keeps voice crystal-clear at a fraction of the size — easy to send over any chat app.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>M4A converter <em>questions</em></>} />
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
