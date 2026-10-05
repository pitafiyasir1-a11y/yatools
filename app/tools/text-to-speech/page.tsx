import Link from "next/link";
import {
  SITE,
  pageMeta,
  toolBySlug,
  webAppJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from "@/lib/site";
import ToolClient from "./ToolClient";

function getTool() {
  const t = toolBySlug("text-to-speech");
  if (!t) throw new Error("Tool not found in registry: text-to-speech");
  return t;
}
const tool = getTool();

export const metadata = pageMeta({
  title: "Text to Speech — Free Online | YATools",
  description:
    "Convert text into natural-sounding MP3 audio online. Free text-to-speech with multiple voices, pitch and speed control — no sign-up.",
  path: "/tools/text-to-speech",
  keywords: [
    "text to speech online",
    "tts free",
    "text to voice mp3",
    "urdu text to speech",
  ],
});

const STEPS = [
  {
    title: "Type or paste your text",
    text: "Up to 1,950 characters per request — a few paragraphs at a time.",
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
  ["Text length", "Up to 1,950 characters per request"],
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
    a: "Up to 1,950 characters per request. For longer scripts, split the text and generate it in parts.",
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
];

export default function TextToSpeechPage() {
  return (
    <main className="wrap pt-10 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd(tool)) }}
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
        <span className="eyebrow">
          <span className="dot" />
          Free tool
        </span>
        <h1 className="hero-title mt-4">
          Text to <em>Speech</em>
        </h1>
        <p className="sec-sub mx-auto mt-4">{tool.tagline}</p>
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
          {tool.related.map((slug) => {
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
