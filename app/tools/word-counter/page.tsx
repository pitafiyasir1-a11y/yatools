import WordCounterClient from "./ToolClient";
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
  toolBySlug,
} from "@/lib/site";

const tool = toolBySlug("word-counter")!;

export const metadata = pageMeta({
  title: "Free Word Counter — Count Words & Characters",
  description:
    "Count words, characters, sentences, and paragraphs as you type, with live reading-time estimates. Free, private, runs 100% in your browser.",
  path: "/tools/word-counter",
  keywords: [
    "word counter online",
    "character counter",
    "count words in text",
    "reading time calculator",
    "sentence counter",
  ],
});

const faqs = [
  {
    q: "How does this word counter count words?",
    a: "Any run of characters separated by spaces, tabs, or line breaks counts as one word. Paste your text and every count — words, characters, sentences, paragraphs — updates instantly as you type.",
  },
  {
    q: "What counts as a sentence?",
    a: "Text is split at periods, exclamation marks, question marks, and ellipses. Abbreviations like “e.g.” can inflate the sentence count slightly, so treat it as an estimate rather than an exact figure.",
  },
  {
    q: "How is reading time calculated?",
    a: "Reading time assumes an average adult reading speed of 200 words per minute. Anything under a minute is shown in seconds; longer texts show minutes and seconds. Skimming or technical material will differ.",
  },
  {
    q: "Is there a character limit?",
    a: "No. The counter runs entirely in your browser, so you can paste a full thesis, novel chapter, or data dump — the counts update live no matter the size.",
  },
  {
    q: "Is my text private?",
    a: "Yes. Nothing is uploaded or stored — counting happens locally on your device. Safe for drafts, client work, and unpublished manuscripts.",
  },
];

export default function WordCounterPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/word-counter" },
          { name: "Word Counter", path: "/tools/word-counter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Word Counter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Word <em>Counter</em>
            </>
          }
          tagline="Count words, characters, sentences, and paragraphs as you type — with live reading-time estimates for writers, students, and creators."
        />

        <WordCounterClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your text is never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your count</em></>} />
        <Steps
          steps={[
            {
              title: "Paste or type",
              text: "Drop your essay, article, caption, or script into the box. No sign-up, no file upload — just text.",
            },
            {
              title: "Watch it count",
              text: "Words, characters (with and without spaces), sentences, paragraphs, and reading time update live with every keystroke.",
            },
            {
              title: "Hit your target",
              text: "Trim to a word limit, check a character cap for meta descriptions, or estimate how long your script takes to read aloud.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>What the <em>numbers mean</em></>}
          sub="Six live metrics, and how to use each one."
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
              t: "Words vs. characters",
              d: "Word counts decide essay limits and article pricing; character counts (with spaces) decide tweet, meta-description, and SMS limits. This tool shows both, plus a no-spaces count for strict limits.",
            },
            {
              t: "Reading time",
              d: "Based on 200 words per minute — the commonly cited average for adult readers. A 1,000-word article reads as about 5 minutes, which matches the “X min read” labels you see on blogs.",
            },
            {
              t: "Sentences & paragraphs",
              d: "Useful for readability checks: if your average sentence runs past 25 words, or paragraphs past 5 sentences, readers start skimming. Break them up.",
            },
            {
              t: "No limits, no tracking",
              d: "Because counting happens on your device, there is no character cap and no analytics on your content. Paste a 100,000-word manuscript if you like.",
            },
          ].map((c) => (
            <div key={c.t} className="neu-card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Examples" title={<>Typical <em>use cases</em></>} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>essay-check.txt</span>
            </div>
            <pre>{`University essay, limit: 1,500 words

Draft: 1,732 words → 232 over.
Cut the introduction and one
example → 1,489 words. Submitted.`}</pre>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>video-script.txt</span>
            </div>
            <pre>{`YouTube script: 1,200 words
÷ 200 wpm ≈ 6 min reading time.
Spoken pace is slower (~150 wpm),
so plan for ~8 minutes of video.`}</pre>
          </div>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Word counter <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["case-converter", "text-to-speech", "audio-to-text"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
