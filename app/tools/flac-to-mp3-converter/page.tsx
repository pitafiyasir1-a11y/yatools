import FlacToMp3ToolClient from "./ToolClient";
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
  slug: "flac-to-mp3-converter",
  name: "FLAC to MP3 Converter",
  tagline: "A free FLAC to MP3 converter: turn lossless FLAC into universal MP3 — pick 128, 192, or 320 kbps.",
  description:
    "FLAC to MP3 converter online free: convert FLAC to MP3 with the LAME encoder at 128–320 kbps. Runs 100% in your browser — no uploads, no sign-up.",
  category: "Audio & Speech",
  keyword: "flac to mp3 converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "wav-to-mp3-converter",
    "m4a-to-mp3-converter",
    "audio-to-text"
],
};

export const metadata = pageMeta({
  title: "FLAC to MP3 Converter - Lossless to MP3 Free Online",
  description:
    "FLAC to MP3 converter, free online: turn lossless FLAC into universal MP3 at your chosen bitrate. Runs in your browser, no uploads. Try it now — it’s free!",
  path: "/tools/flac-to-mp3-converter",
  keywords: [
    "FLAC to MP3",
    "FLAC to MP3 converter",
    "convert FLAC to MP3",
    "lossless to MP3",
    "FLAC converter",
  ],
});

const faqs = [
  {
    q: "Will converting FLAC to MP3 lose quality?",
    a: "Technically yes — MP3 is lossy, FLAC is lossless. But at 192–320 kbps the difference is inaudible to nearly everyone in blind listening tests. The smart move: keep your FLAC as the archive master and use the MP3 for phones, cars, and sharing.",
  },
  {
    q: "Should I delete my FLAC files after converting?",
    a: "No — keep them. FLAC is your bit-perfect original; you can always re-convert it later at any quality. Delete the FLAC and the best copy of that music is gone forever. Treat the MP3 as the portable copy, not the replacement.",
  },
  {
    q: "What bitrate should I choose?",
    a: "Since the source is lossless, 320 kbps gives you the closest-to-original MP3, and 192 kbps is the everyday sweet spot most listeners can't distinguish from the FLAC. 128 kbps is fine for voice recordings or when size matters most.",
  },
  {
    q: "How big can my FLAC file be?",
    a: "Up to about 50 MB. FLAC files are large by nature — a single lossless album track can be 20–30 MB — so convert tracks one at a time in a desktop browser for the smoothest experience.",
  },
  {
    q: "Is my music uploaded anywhere?",
    a: "No. Your FLAC is decoded losslessly and re-encoded with LAME entirely in your tab. Nothing ever leaves your device — no server, no account, no watermark on your MP3.",
  },
];

const steps = [
  {
    title: "Drop in a FLAC file",
    text: "Choose a .flac file up to ~50MB. It stays on your device — the page never uploads it anywhere.",
  },
  {
    title: "Pick a bitrate",
    text: "192 kbps for the everyday sweet spot, 320 for closest-to-original quality, 128 for smallest files. Then press “Convert to MP3”.",
  },
  {
    title: "Preview and download",
    text: "Listen to the MP3 right on the page, then download it. Keep your FLAC as the master; use the MP3 everywhere.",
  },
];

export default function FlacToMp3Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={softwareAppJsonLd(tool, "MultimediaApplication")} />
      <JsonLd data={howToJsonLd(tool, steps)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/flac-to-mp3-converter" },
          { name: "FLAC to MP3 Converter", path: "/tools/flac-to-mp3-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "FLAC to MP3 Converter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free FLAC to MP3 <em>Converter</em> Online
            </>
          }
          tagline="A free FLAC to MP3 converter: turn lossless FLAC into universal MP3 — pick 128, 192, or 320 kbps."
        />

        <FlacToMp3ToolClient />
        <PrivacyNote>
          Decoding and encoding run 100% in your browser. Your FLAC is never uploaded, stored, or seen by anyone.
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
              t: "FLAC in, MP3 out",
              d: "This page converts FLAC (.flac) files only — the lossless format audiophiles archive music in. Your browser decodes it bit-perfectly, then LAME encodes the MP3. Nothing about your file changes until you choose the bitrate.",
            },
            {
              t: "The LAME encoder",
              d: "MP3s here are encoded with LAME, the reference MP3 encoder trusted for over two decades. 192 kbps is the sweet spot most ears can't distinguish from FLAC; 320 kbps is the closest an MP3 gets to the original.",
            },
            {
              t: "~50 MB file cap",
              d: "FLAC files run large — one lossless track can be 20–30 MB — and everything happens in browser memory, so files are capped at about 50 MB. Convert tracks one at a time in a desktop browser.",
            },
            {
              t: "Private by design",
              d: "The ~150 KB encoder loads once per visit, and your music never leaves your device. No accounts, no uploads, no watermarks — and no record of what you converted.",
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
          sub="FLAC for the archive, MP3 for life."
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
              t: "FLAC for the car",
              d: "Car stereos and many portable players choke on FLAC. Convert your lossless tracks to MP3 and the whole library fits on a USB stick and plays on literally everything.",
            },
            {
              t: "Shareable music files",
              d: "A lossless track can be 30 MB — awkward to send. The same song as a 192 kbps MP3 is around 4 MB, small enough for any chat app, with no audible difference on earbuds.",
            },
            {
              t: "Phone-friendly library",
              d: "Keep the FLAC archive on your computer, and put MP3 copies on your phone. Same music, a fraction of the storage — a full playlist instead of a handful of tracks.",
            },
            {
              t: "DJ and party setups",
              d: "Club gear, older decks, and venue laptops all speak MP3. Convert your set from FLAC so nothing fails to load when you're up next.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>FLAC converter <em>questions</em></>} />
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
