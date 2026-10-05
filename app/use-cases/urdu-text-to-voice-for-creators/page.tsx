import Link from "next/link";
import {
  pageMeta,
  breadcrumbJsonLd,
  faqJsonLd,
  toolBySlug,
  type ToolDef,
} from "@/lib/site";

export const metadata = pageMeta({
  title: "Urdu Text to Voice for Content Creators",
  description:
    "How Pakistani creators generate Urdu voiceovers for videos without recording a single line — workflow, tips, and honest notes on quality.",
  path: "/use-cases/urdu-text-to-voice-for-creators",
  keywords: [
    "urdu text to voice",
    "urdu voiceover generator",
    "urdu text to speech for youtube",
    "ai urdu voice",
  ],
});

const crumbs = [
  { name: "Home", path: "/" },
  {
    name: "Urdu Text to Voice for Content Creators",
    path: "/use-cases/urdu-text-to-voice-for-creators",
  },
];

const faqs = [
  {
    q: "Is Urdu actually supported?",
    a: "Yes. The Text to Speech tool includes Urdu voices — paste your Urdu script, pick a voice, and generate the audio.",
  },
  {
    q: "Is it free?",
    a: "Yes, free to use with fair-use daily limits so the service stays available for everyone. If you produce videos daily, generate voiceovers in batches rather than all at once.",
  },
  {
    q: "Can I use the voiceovers in my monetized videos?",
    a: "The audio is generated from your own script for your own videos — that is exactly what the tool is for. You own your script; just don't present the AI voice as a real person's recording.",
  },
  {
    q: "Why does a line sometimes sound robotic or mispronounced?",
    a: "Voice quality varies between voices and phrasing, and AI voices sometimes stumble on names, English loanwords, or unusual spellings. Always preview, tweak the spelling or punctuation, and regenerate the line.",
  },
];

const related: ToolDef[] = ["text-to-speech", "urdu-handwriting"]
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
            <span className="dot" /> Use case · Creators
          </p>
          <h1 className="hero-title mt-4">
            Urdu text to voice for <em>content creators</em>
          </h1>
          <p className="sec-sub mt-4 text-lg">
            Faceless channels, poetry pages, kids&apos; stories, news explainers
            — here is how to generate Urdu voiceovers without recording a
            single line.
          </p>
        </div>

        <div className="prose-neu max-w-3xl mt-10">
          <p>
            Urdu content is booming, and not every creator wants — or is able —
            to record their own voice. Maybe you don&apos;t have a quiet room.
            Maybe your mic is your phone. Maybe you&apos;re just not confident
            on the mic yet. Text to speech removes that entire barrier: you
            write the script, the tool speaks it, and you spend your energy on
            the visuals and the story instead of the fifteenth retake.
          </p>

          <h2>The workflow</h2>
          <h3>1. Write a script that sounds spoken</h3>
          <p>
            Write short, simple sentences — the way people actually talk. Read
            each paragraph aloud once before generating: if you stumble reading
            it, the AI voice will stumble too. Rewrite until it flows.
          </p>
          <h3>2. Generate the voiceover</h3>
          <p>
            Paste your script into the{" "}
            <Link href="/tools/text-to-speech">Text to Speech</Link> tool,
            choose an Urdu voice, and generate. Listen to the preview before
            downloading — this is the step that separates decent voiceovers
            from embarrassing ones.
          </p>
          <h3>3. Edit it into your video</h3>
          <p>
            Drop the audio into CapCut, Premiere, or any editor. Add pauses
            where the voice rushes by splitting the clip, keep background music
            low under narration, and match visuals to the words being spoken —
            viewers forgive a lot when the timing feels intentional.
          </p>

          <h2>Tips from creators who do this daily</h2>
          <ul>
            <li>
              <strong>Chunk long scripts.</strong> Generate a few paragraphs at
              a time rather than one giant paste — shorter generations are more
              reliable, and fixing one bad line is cheaper than redoing ten
              minutes.
            </li>
            <li>
              <strong>Pick the voice that fits the content.</strong> A calm,
              steady voice suits storytelling and Islamic reminders; something
              brighter fits tech explainers and kids&apos; content.
            </li>
            <li>
              <strong>Punctuate for pauses.</strong> Commas, full stops, and
              line breaks control pacing — a script with no punctuation sounds
              like it&apos;s being read by someone late for a bus.
            </li>
            <li>
              <strong>Spell words the way they sound.</strong> Write
              &ldquo;یوٹیوب&rdquo; instead of &ldquo;YouTube&rdquo; and the
              pronunciation improves immediately. This trick fixes most
              mispronounced loanwords.
            </li>
            <li>
              <strong>Pair it with good titles.</strong> Handwritten-style
              title cards stand out in thumbnails — the{" "}
              <Link href="/tools/urdu-handwriting">Urdu Handwriting</Link> tool
              can generate them in seconds.
            </li>
          </ul>

          <div className="notice notice-warn mt-8">
            <strong>An honest note on quality:</strong> AI voices are good but
            they are not human. They occasionally mispronounce names, flatten
            emotional lines, and sound slightly robotic on long passages.
            Always preview every generation, and regenerate any line that
            sounds off — your viewers will notice what you didn&apos;t.
          </div>

          <h2>Frequently asked questions</h2>
        </div>

        <div className="max-w-3xl mt-2">
          <FaqList items={faqs} />
        </div>

        <div className="max-w-3xl mt-10">
          <div className="neu-card p-6 md:p-8">
            <h2 className="sec-title">Generate your first voiceover</h2>
            <p className="sec-sub mb-6">
              Paste your Urdu script, pick a voice, preview, download. Free, no
              sign-up.
            </p>
            <Link
              href="/tools/text-to-speech"
              className="neu-btn neu-btn-primary"
            >
              Open Text to Speech
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
