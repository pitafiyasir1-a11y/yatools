import Link from "next/link";
import {
  pageMeta,
  breadcrumbJsonLd,
  faqJsonLd,
  toolBySlug,
  type ToolDef,
} from "@/lib/site";

export const metadata = pageMeta({
  title: "Convert WhatsApp Voice Notes to Text",
  description:
    "Turn long WhatsApp voice notes into readable, searchable text you can skim, quote, and save — in three simple steps.",
  path: "/use-cases/whatsapp-voice-note-to-text",
  keywords: [
    "whatsapp voice note to text",
    "convert voice message to text",
    "voice note transcription",
    "audio to text online",
  ],
});

const crumbs = [
  { name: "Home", path: "/" },
  {
    name: "Convert WhatsApp Voice Notes to Text",
    path: "/use-cases/whatsapp-voice-note-to-text",
  },
];

const faqs = [
  {
    q: "Which audio formats can I upload?",
    a: "MP3, WAV, M4A and other common formats work. WhatsApp voice notes sometimes export as .opus — if the tool rejects the file, convert it to MP3 first with any free audio converter and upload again.",
  },
  {
    q: "How long can the voice note be?",
    a: "Shorter clips transcribe faster and more reliably. Very long recordings can time out, so for anything over several minutes, split it into parts and transcribe each one. Daily fair-use limits apply — see the rate limits page.",
  },
  {
    q: "How accurate is the transcription?",
    a: "Accuracy depends on audio quality. Clear speech with little background noise gives the best results; heavy accents, overlapping voices, or traffic noise will produce more errors. Always skim the transcript before quoting it.",
  },
  {
    q: "Is my voice note stored anywhere?",
    a: "No. Your audio is sent for real-time transcription only and is not stored by us afterwards. See the privacy page for exactly what happens to uploads.",
  },
];

const related: ToolDef[] = ["audio-to-text", "word-counter"]
  .map(toolBySlug)
  .filter((t): t is ToolDef => Boolean(t));

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function Crumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        className="font-mono2 m-0 flex flex-wrap items-center gap-2 p-0 text-xs"
        style={{ listStyle: "none" }}
      >
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" style={{ color: "var(--muted)" }}>
                /
              </span>
            )}
            {i === items.length - 1 ? (
              <span aria-current="page" style={{ color: "var(--text)" }}>
                {item.name}
              </span>
            ) : (
              <Link
                href={item.path}
                className="no-underline hover:underline"
                style={{ color: "var(--muted)" }}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="neu-card px-5 sm:px-7 [&_summary::-webkit-details-marker]:hidden">
      {items.map((item, i) => (
        <details key={i} className="faq-item" open={i === 0}>
          <summary className="faq-q" style={{ listStyle: "none" }}>
            <span>{item.q}</span>
            <span
              aria-hidden="true"
              className="font-mono2 text-xl leading-none font-bold"
              style={{ color: "var(--red)", flexShrink: 0 }}
            >
              +
            </span>
          </summary>
          <p className="faq-a">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

function RelatedTools({ tools }: { tools: ToolDef[] }) {
  return (
    <div className="tool-grid">
      {tools.map((t) => (
        <Link
          key={t.slug}
          href={`/tools/${t.slug}`}
          className="neu-card neu-card-hover flex flex-col gap-3 p-5 no-underline"
        >
          <div className="flex items-center justify-between">
            <span className={`neu-badge neu-badge-${t.badgeColor}`}>
              {t.badge}
            </span>
            <span
              aria-hidden="true"
              className="text-lg font-bold"
              style={{ color: "var(--red)" }}
            >
              &rarr;
            </span>
          </div>
          <div>
            <h3
              className="mb-1 text-lg font-extrabold"
              style={{ color: "var(--text)" }}
            >
              {t.name}
            </h3>
            <p
              className="m-0 text-sm leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              {t.tagline}
            </p>
          </div>
          <div className="mt-auto pt-2">
            <span
              className="font-mono2 text-xs"
              style={{ color: "var(--muted)" }}
            >
              {t.api ?? "100% in-browser"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(faqs)} />
      <div className="wrap py-10 md:py-14">
        <Crumbs items={crumbs} />
        <div className="max-w-3xl">
          <p className="eyebrow mt-6">
            <span className="dot" /> Use case · Everyday productivity
          </p>
          <h1 className="hero-title mt-4">
            Convert WhatsApp <em>voice notes</em> to text
          </h1>
          <p className="sec-sub mt-4 text-lg">
            A two-minute voice note is fine. A nine-minute one is a commitment.
            Here is how to turn rambling audio into text you can skim in
            seconds.
          </p>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <p>
            You can&apos;t skim audio. You can&apos;t search it, quote it in a
            document, or read it in a meeting. And yet half of modern
            communication arrives as voice notes — recorded while walking, with
            traffic in the background, wandering across three topics before
            reaching the point. Converting a voice note to text turns all of
            that into something you can read in thirty seconds, copy the
            important line from, and file away.
          </p>

          <h2>When text beats audio</h2>
          <ul>
            <li>
              <strong>You can&apos;t listen right now</strong> — in class, at
              work, or on a bus without earphones.
            </li>
            <li>
              <strong>You need the exact wording</strong> — an address, a price,
              instructions you&apos;ll need again tomorrow.
            </li>
            <li>
              <strong>You want a record</strong> — decisions made over voice
              notes have a habit of being forgotten by everyone involved.
            </li>
            <li>
              <strong>Accessibility</strong> — text works for people who are
              hard of hearing or simply process reading faster than listening.
            </li>
          </ul>

          <h2>How to do it in 3 steps</h2>
          <h3>1. Save the voice note as an audio file</h3>
          <p>
            In WhatsApp, long-press the voice note, tap share, and save it to
            your files or drive. You need the actual audio file — a chat export
            or a screen recording won&apos;t transcribe cleanly.
          </p>
          <h3>2. Upload it to the Audio to Text tool</h3>
          <p>
            Open the <Link href="/tools/audio-to-text">Audio to Text</Link>{" "}
            tool, drop in the file, and get your transcript. If you plan to
            reuse the audio as a captioned clip later, choose the SRT output —
            it includes timestamps, ready for video editors.
          </p>
          <h3>3. Skim, copy, save</h3>
          <p>
            Read the transcript, copy the lines that matter, and paste them
            where you&apos;ll find them again — your notes app, a task, a
            document. If you only need a quote, paste the transcript into the{" "}
            <Link href="/tools/word-counter">Word Counter</Link> to trim it to
            length before sharing.
          </p>

          <h2>Tips for cleaner transcripts</h2>
          <ul>
            <li>
              <strong>Keep clips focused.</strong> One topic per transcription
              is easier to skim later — and long files take longer and can hit
              processing limits. Split marathon voice notes into parts.
            </li>
            <li>
              <strong>Check the first 30 seconds.</strong> If the opening is
              garbled, the rest probably is too — the recording quality is the
              bottleneck, not the tool.
            </li>
            <li>
              <strong>Use SRT for captions.</strong> Turning a voice note into
              a captioned video for status or reels takes minutes when the
              timestamps are already done for you.
            </li>
            <li>
              <strong>Fix names and numbers by hand.</strong> Transcription
              handles normal speech well but mangles proper nouns, phone
              numbers, and mixed-language sentences — always verify those.
            </li>
          </ul>

          <div className="notice mt-8">
            <strong>Privacy note:</strong> your audio is processed in real time
            and not stored by us afterwards. Don&apos;t upload anything you
            wouldn&apos;t be comfortable sending over the internet in the first
            place.
          </div>

          <h2>Frequently asked questions</h2>
        </div>

        <div className="max-w-3xl mt-2">
          <FaqList items={faqs} />
        </div>

        <div className="max-w-3xl mt-10">
          <div className="neu-card p-6 md:p-8">
            <h2 className="sec-title">Transcribe your first voice note</h2>
            <p className="sec-sub mb-6">
              Upload the audio file, get editable text back. Free, no sign-up.
            </p>
            <Link
              href="/tools/audio-to-text"
              className="neu-btn neu-btn-primary"
            >
              Open Audio to Text
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mt-12">
          <p className="sec-label">Try these tools</p>
          <RelatedTools tools={related} />
        </div>
      </div>
    </>
  );
}
