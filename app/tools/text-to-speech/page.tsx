import Link from "next/link";
import {
  SITE,
  pageMeta,
  toolBySlug,
  webAppJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  type ToolDef,
} from "@/lib/site";
import ToolClient from "./ToolClient";
import { ToolIcon } from "@/components/tool-icons";

function getTool() {
  const t = toolBySlug("text-to-speech");
  if (!t) throw new Error("Tool not found in registry: text-to-speech");
  return t;
}
const tool = getTool();

function softwareAppJsonLd(t: ToolDef) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${t.name} — ${SITE.name}`,
    url: `${SITE.url}/tools/${t.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: t.description,
  };
}

export const metadata = pageMeta({
  title: "Text to Speech - Convert Text to Audio Free Online",
  description:
    "Convert text to speech free online — paste up to 12,000 characters, pick a natural voice, and download the MP3. Offline browser fallback included. Try now!",
  path: "/tools/text-to-speech",
  keywords: [
    "text to speech",
    "TTS tool",
    "text to audio",
    "speech generator",
    "voice synthesizer",
  ],
});

const STEPS = [
  {
    title: "Type or paste your text",
    text: "Up to 12,000 characters — long text is split into chunks automatically and merged into a single MP3.",
  },
  {
    title: "Choose a voice",
    text: "Browse voices grouped by language and pick the one that fits.",
  },
  {
    title: "Tune & generate",
    text: "Adjust pitch and speed, hit Generate, then play or download the MP3.",
  },
];

const LIMITS: [string, string][] = [
  ["Text length", "Up to 12,000 characters — auto-split into ~900-char chunks, merged into one MP3"],
  ["Daily limit", "30 generations per day; long text uses one per ~900-character chunk"],
  ["Output", "MP3 audio"],
  ["Pitch & rate", "−100 to +100 each"],
  ["Voices", "Multiple voices, grouped by language"],
  [
    "Browser voice (offline fallback)",
    "If generation fails, your browser can read the text aloud instead (no download in that mode)",
  ],
  [
    "Usage terms",
    "Free for personal, non-commercial use",
  ],
];

const USE_CASES = [
  {
    title: "Video narration",
    text: "Generate voiceovers for reels, shorts, and explainers without a microphone.",
  },
  {
    title: "Urdu voiceovers",
    text: "Create Urdu narration for content aimed at Pakistani audiences.",
  },
  {
    title: "Accessibility",
    text: "Turn articles and notes into audio for listening on the go.",
  },
  {
    title: "Language practice",
    text: "Hear how sentences sound in another language while you study.",
  },
  {
    title: "Prototyping",
    text: "Add placeholder narration to demos and presentations in seconds.",
  },
];

const FAQS = [
  {
    q: "Is text-to-speech free?",
    a: "Yes. Type your text, pick a voice, and download the MP3 without signing up or paying anything.",
  },
  {
    q: "How much text can I convert at once?",
    a: "Up to 12,000 characters in one go. The tool splits long text at sentence boundaries into ~900-character chunks, generates them all in parallel, and merges them into a single MP3 download.",
  },
  {
    q: "What is browser voice (offline fallback)?",
    a: "If the voice API can't generate your audio, the tool falls back to your browser's built-in speech. It reads the text aloud right on the page — but there is no MP3 download in that mode.",
  },
  {
    q: "Can I use the MP3 in my videos?",
    a: "Yes — the audio downloads to your device and you can use it in your own videos and projects.",
  },
  {
    q: "Do you store my text?",
    a: "No. Text is processed in real time and never stored on our servers.",
  },
  {
    q: "Is there a free text to speech tool with no strict character limit?",
    a: "This one converts up to 12,000 characters per run — long articles, full scripts, and study guides — by automatically chunking the text and joining the audio.",
  },
  {
    q: "Can I download the generated audio as an MP3?",
    a: "Yes. After conversion you can download the full narration as an MP3, ready to drop into a video editor, podcast workflow, or music player.",
  },
  {
    q: "Does text to speech work offline?",
    a: "If the online voice service is unavailable, the tool falls back to your browser's built-in voices, which work offline on most devices — the voice selection is smaller but it keeps you going.",
  },

];

const RELATED_SLUGS: string[] = ["audio-to-text", "text-to-pdf", "word-counter"];

export default function TextToSpeechPage() {
  return (
    <main className="wrap pt-10 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd(tool)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd(tool)) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Tools", path: "/tools" },
              { name: tool.name, path: `/tools/${tool.slug}` },
            ])
          ),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="font-mono2 text-xs mb-8 flex items-center gap-2"
        style={{ color: "var(--muted)" }}
      >
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:underline">Tools</Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{tool.name}</span>
      </nav>

      <header className="text-center max-w-2xl mx-auto mb-10">
        <span aria-hidden="true" className="tool-icon tool-icon-lg" style={{ margin: "0 auto 16px" }}>
          <ToolIcon slug={tool.slug} />
        </span>
                <span className="eyebrow">
          <span className="dot" />
          Free tool
        </span>
        <h1 className="hero-title mt-4">
          Free Text to <em>Speech</em> Online
        </h1>
        <p className="sec-sub mx-auto mt-4">A free text to speech tool: paste up to 12,000 characters, pick a voice, listen instantly, and download the MP3 — no sign-up.</p>
      </header>

      <section className="card p-5 sm:p-8 md:p-10" aria-label="Text to speech tool">
        <ToolClient />
      </section>
      <p
        className="font-mono2 text-xs mt-3 text-center"
        style={{ color: "var(--muted)" }}
      >
        Audio is generated in real time by the ahm7xmakki.com API and never
        stored.
      </p>

            <section className="mt-14">
        <p className="sec-label">About this tool</p>
        <h2 className="sec-title">
          About the <em>Text to Speech</em>
        </h2>
        <div className="card p-6 mt-6">
          <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            A text to speech tool reads your words aloud with natural-sounding voices — and this free online TTS converter handles up to 12,000 characters in one go by automatically splitting long text into chunks and stitching the audio back together. Paste an article, a script, or study notes, choose a voice, and listen instantly in the browser or download the result as an MP3 for later. Creators voice their videos, language learners hear correct pronunciation, busy readers turn long articles into audio, and accessibility users get any text read aloud.
          </p>
          <p className="text-sm mt-4" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            If the cloud voice service is ever unreachable, an offline browser-voice fallback speaks your text using the voices built into your device, so the tool keeps working with no connection to the voice API. Short texts convert in seconds; a full 12,000-character document takes longer as each chunk is synthesized in turn. Your text is sent only to generate the audio and is never stored, and you can freely use the MP3s in your own videos and projects.
          </p>
        </div>
      </section>

<section className="mt-14">
        <p className="sec-label">Supported formats &amp; limits</p>
        <h2 className="sec-title">
          What it <em>handles</em>
        </h2>
        <div className="card p-2 sm:p-4 mt-6 overflow-x-auto">
          <table className="param-table">
            <thead>
              <tr>
                <th>Detail</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {LIMITS.map(([k, v]) => (
                <tr key={k}>
                  <td>
                    <strong>{k}</strong>
                  </td>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">How it works</p>
        <h2 className="sec-title">
          Three steps to <em>done</em>
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-6">
              <div className="font-display text-4xl" style={{ color: "var(--red)" }}>
                {i + 1}
              </div>
              <h3 className="font-bold mt-2">{s.title}</h3>
              <p className="text-sm mt-1" style={{ color: "var(--text2)" }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">Use cases</p>
        <h2 className="sec-title">
          Made for <em>real work</em>
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {USE_CASES.map((u) => (
            <div key={u.title} className="card p-6">
              <h3 className="font-bold">{u.title}</h3>
              <p className="text-sm mt-1" style={{ color: "var(--text2)" }}>
                {u.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">FAQ</p>
        <h2 className="sec-title">
          Questions, <em>answered</em>
        </h2>
        <div className="mt-4">
          {FAQS.map((f) => (
            <div key={f.q} className="faq-item">
              <h3 className="faq-q" style={{ cursor: "default" }}>
                {f.q}
              </h3>
              <p className="faq-a">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="sec-label">Related tools</p>
        <h2 className="sec-title">
          Keep <em>going</em>
        </h2>
        <div className="tool-grid mt-6">
          {RELATED_SLUGS.map((slug) => {
            const t = toolBySlug(slug);
            if (!t) return null;
            return (
              <Link
                key={slug}
                href={`/tools/${slug}`}
                className="card card-hover p-5 block"
              >
                <span className={`badge badge-${t.badgeColor}`}>
                  {t.badge}
                </span>
                <h3 className="font-display text-2xl mt-3">{t.name}</h3>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  {t.tagline}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="card p-6 md:p-8 mt-14 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div>
          <p className="sec-label">For developers</p>
          <h2 className="sec-title">
            Use the <em>Speech API</em> in your own app
          </h2>
          <p className="sec-sub mt-2">
            The same engine behind this tool is available as a simple API —
            send text, get MP3 back.
          </p>
        </div>
        <a
          className="btn btn-primary shrink-0"
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(
            "API access: Text to Speech"
          )}`}
        >
          Request API access
        </a>
      </section>
    </main>
  );
}
