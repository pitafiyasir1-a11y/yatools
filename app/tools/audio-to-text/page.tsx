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
  const t = toolBySlug("audio-to-text");
  if (!t) throw new Error("Tool not found in registry: audio-to-text");
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
  title: "Audio to Text Converter - Transcribe Audio Free Online",
  description:
    "Transcribe audio to text free online — upload MP3, WAV, or M4A, paste a YouTube link, or dictate with your mic. Fast, private, no sign-up. Try it now!",
  path: "/tools/audio-to-text",
  keywords: [
    "audio to text",
    "transcribe audio",
    "speech to text",
    "MP3 to text",
    "audio transcription",
  ],
});

const STEPS = [
  {
    title: "Upload your audio",
    text: "Choose an MP3, WAV, M4A, OGG or FLAC file up to 25 MB — paste a YouTube link instead, or dictate with your microphone.",
  },
  {
    title: "Pick language & model",
    text: "Leave language on auto-detect, or set it yourself. Turbo is fastest, Accurate is more careful, English is tuned for English audio. You can also translate any transcript to English.",
  },
  {
    title: "Get your transcript",
    text: "Copy the text, download it as .txt, or grab the .srt file when you enable timestamps.",
  },
];

const LIMITS: [string, string][] = [
  ["Accepted files", "MP3, WAV, M4A, OGG, FLAC (audio/*)"],
  ["YouTube", "Paste a youtube.com or youtu.be link — the audio is fetched and transcribed"],
  ["Max file size", "25 MB per upload"],
  ["Models", "Turbo (fast) · Accurate (more careful) · English (tuned for English)"],
  ["Languages", "Auto-detect, English, Urdu, Arabic, Hindi, Spanish, French"],
  ["Timestamps", "Optional SRT subtitle file"],
  ["Translate", "Optional one-step translation of any transcript to English"],
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
    q: "What is the difference between Turbo, Accurate, and English?",
    a: "Turbo returns your transcript faster. Accurate spends more time for a more careful result, which helps with difficult or noisy audio. English is tuned specifically for English-language audio.",
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
    a: "Yes — switch to the YouTube link tab and paste the video URL. The video's audio is fetched and transcribed automatically. Only transcribe videos you have the right to use.",
  },
  {
    q: "Do you keep my audio?",
    a: "No. Files are processed in real time and never stored on our servers.",
  },
  {
    q: "Can I transcribe a YouTube video to text for free?",
    a: "Yes. Paste the YouTube link and the tool pulls the video's audio and transcribes it — handy for lectures, interviews, and podcasts published as video.",
  },
  {
    q: "What audio file formats can I transcribe?",
    a: "MP3, WAV, and M4A are all supported. If your recording is in another format, convert it first or use the microphone dictation mode to speak the content directly.",
  },

];

const RELATED_SLUGS: string[] = ["text-to-speech", "text-to-pdf", "image-to-text"];

export default function AudioToTextPage() {
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
          Free Audio to <em>Text</em> Online
        </h1>
        <p className="sec-sub mx-auto mt-4">A free audio to text converter: upload a recording, paste a YouTube link, or dictate live — get accurate transcripts in minutes.</p>
      </header>

      <section className="card p-5 sm:p-8 md:p-10" aria-label="Transcription tool">
        <ToolClient />
      </section>
      <p
        className="font-mono2 text-xs mt-3 text-center"
        style={{ color: "var(--muted)" }}
      >
        Files are transcribed in real time by YATools&apos; secure processing
        engine and never stored.
      </p>

            <section className="mt-14">
        <p className="sec-label">About this tool</p>
        <h2 className="sec-title">
          About the <em>Audio to Text</em>
        </h2>
        <div className="card p-6 mt-6">
          <p className="text-sm" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            An audio to text converter turns spoken words into written text you can edit, search, and share. Upload an MP3, WAV, or M4A recording and this free online transcription tool converts it to text automatically — or skip the file entirely and paste a YouTube link to transcribe a video's audio straight from the page. Students transcribe lectures, journalists turn interviews into quotable copy, podcasters generate show notes, and creators make captions from voice notes, all without installing software or creating an account.
          </p>
          <p className="text-sm mt-4" style={{ color: "var(--text2)", lineHeight: 1.8 }}>
            Choose between Turbo, Accurate, and English transcription modes depending on whether you need speed or precision, and if the cloud transcription service is ever temporarily unavailable, a built-in microphone dictation mode keeps you working right in the browser. Long files can take several minutes and very large uploads may time out — splitting a two-hour recording into parts is the reliable workaround. Your audio is processed for transcription and never kept or shared.
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
            Use the <em>Transcription API</em> in your own app
          </h2>
          <p className="sec-sub mt-2">
            The same engine behind this tool is available as a simple API —
            send audio, get text (and SRT) back.
          </p>
        </div>
        <a
          className="btn btn-primary shrink-0"
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
