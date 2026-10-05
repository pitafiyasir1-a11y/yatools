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
  const t = toolBySlug("audio-to-text");
  if (!t) throw new Error("Tool not found in registry: audio-to-text");
  return t;
}
const tool = getTool();

export const metadata = pageMeta({
  title: "Audio to Text — Free Online | YATools",
  description:
    "Transcribe MP3, WAV, M4A and more into editable text online. Free AI audio-to-text with timestamps and SRT export — no sign-up.",
  path: "/tools/audio-to-text",
  keywords: [
    "audio to text online",
    "mp3 to text",
    "transcribe audio free",
    "voice note to text",
  ],
});

const STEPS = [
  {
    title: "Upload your audio",
    text: "Choose an MP3, WAV, M4A, OGG or FLAC file up to 25 MB — or dictate with your microphone instead.",
  },
  {
    title: "Pick language & model",
    text: "Leave language on auto-detect, or set it yourself. Turbo is fastest; Accurate is more careful.",
  },
  {
    title: "Get your transcript",
    text: "Copy the text, download it as .txt, or grab the .srt file when you enable timestamps.",
  },
];

const LIMITS: [string, string][] = [
  ["Accepted files", "MP3, WAV, M4A, OGG, FLAC (audio/*)"],
  ["Max file size", "25 MB per upload"],
  ["Models", "Turbo (fast) · Accurate (more careful)"],
  ["Languages", "Auto-detect, English, Urdu, Arabic, Hindi, Spanish, French"],
  ["Timestamps", "Optional SRT subtitle file"],
  [
    "Processing",
    "Synchronous — about a minute max. Very long audio can time out; split it into shorter clips",
  ],
];

const USE_CASES = [
  {
    title: "Lecture notes",
    text: "Turn recorded lectures into searchable text you can study from.",
  },
  {
    title: "Interviews",
    text: "Transcribe interviews for articles, research, or podcast show notes.",
  },
  {
    title: "Voice messages",
    text: "Convert long voice notes into text you can skim, quote, and save.",
  },
  {
    title: "Meeting records",
    text: "Keep written records of meetings without typing everything out.",
  },
  {
    title: "Video captions",
    text: "Generate an SRT file to caption your videos.",
  },
];

const FAQS = [
  {
    q: "Is audio transcription free?",
    a: "Yes. Upload a file and get your transcript without signing up or paying anything.",
  },
  {
    q: "Which languages are supported?",
    a: "Auto-detect plus English, Urdu, Arabic, Hindi, Spanish and French. Pick a language for better accuracy, or leave it on auto-detect.",
  },
  {
    q: "What is the difference between Turbo and Accurate?",
    a: "Turbo returns your transcript faster. Accurate spends more time for a more careful result, which helps with difficult or noisy audio.",
  },
  {
    q: "My file timed out — what now?",
    a: "Very long recordings can exceed the processing window. Split the audio into shorter clips and transcribe each one separately.",
  },
  {
    q: "Can I dictate with my microphone instead?",
    a: "Yes — switch to the dictation tab. It uses your browser's built-in speech recognition, so it works in Chrome and Edge (not Firefox), and nothing is uploaded.",
  },
  {
    q: "Can I transcribe a YouTube video?",
    a: "No — this tool works with audio files you upload directly, and can't fetch YouTube links. If your audio is inside a video you own, extract the audio track first with any free converter app, then upload the file.",
  },
  {
    q: "Do you keep my audio?",
    a: "No. Files are processed in real time and never stored on our servers.",
  },
];

export default function AudioToTextPage() {
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
          Audio to <em>Text</em>
        </h1>
        <p className="sec-sub mx-auto mt-4">{tool.tagline}</p>
      </header>

      <section className="neu-card p-5 sm:p-8 md:p-10" aria-label="Transcription tool">
        <ToolClient />
      </section>
      <p
        className="font-mono2 text-xs mt-3 text-center"
        style={{ color: "var(--muted)" }}
      >
        Files are transcribed in real time by the ahm7xmakki.com API and never
        stored.
      </p>

      <section className="mt-14">
        <p className="sec-label">Supported formats &amp; limits</p>
        <h2 className="sec-title">
          What it <em>handles</em>
        </h2>
        <div className="neu-card p-2 sm:p-4 mt-6 overflow-x-auto">
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
            <div key={s.title} className="neu-card p-6">
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
            <div key={u.title} className="neu-card p-6">
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
                className="neu-card neu-card-hover p-5 block"
              >
                <span className={`neu-badge neu-badge-${t.badgeColor}`}>
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

      <section className="neu-card p-6 md:p-8 mt-14 flex flex-col md:flex-row md:items-center gap-6 justify-between">
        <div>
          <p className="sec-label">For developers</p>
          <h2 className="sec-title">
            Use the <em>Transcription API</em> in your own app
          </h2>
          <p className="sec-sub mt-2">
            The same engine behind this tool is available as a simple API —
            send audio, get text (and SRT) back.
          </p>
        </div>
        <a
          className="neu-btn neu-btn-primary shrink-0"
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(
            "API access: Audio to Text"
          )}`}
        >
          Request API access
        </a>
      </section>
    </main>
  );
}
