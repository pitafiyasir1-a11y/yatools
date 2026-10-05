import LoremClient from "./ToolClient";
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
  type ToolDef,
} from "@/lib/site";
import { softwareAppJsonLd } from "../_conv-shared/seo";

const tool: ToolDef = {
  slug: "lorem-ipsum-generator",
  name: "Lorem Ipsum Generator",
  tagline: "A free Lorem Ipsum generator: placeholder text by paragraphs, sentences, or words — one click.",
  description:
    "Free lorem ipsum generator online: generate placeholder text by paragraphs, sentences, or words with one-click copy — instant, no sign-up.",
  category: "Developer Tools",
  keyword: "lorem ipsum generator",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "word-counter",
    "case-converter",
    "text-to-pdf"
],
};

export const metadata = pageMeta({
  title: "Lorem Ipsum Generator - Placeholder Text Free Online",
  description:
    "Lorem Ipsum generator, free online: placeholder text by paragraphs, sentences, or words with one click. No sign-up, no limits. Try it now — it’s free!",
  path: "/tools/lorem-ipsum-generator",
  keywords: [
    "Lorem Ipsum generator",
    "Lorem Ipsum text",
    "placeholder text",
    "dummy text generator",
    "Lorem Ipsum paragraphs",
  ],
});

const faqs = [
  {
    q: "What is lorem ipsum?",
    a: "Scrambled Latin text used as placeholder in design and publishing. It looks like real copy — so clients judge the layout, not the words — without distracting anyone with readable content.",
  },
  {
    q: "How much text can I generate?",
    a: "Up to 100 paragraphs, sentences, or words per click. That's plenty for mockups; generate a few times if you're laying out a long document.",
  },
  {
    q: "Does it always start with “Lorem ipsum…”?",
    a: "By default, yes — the classic opening line. Untick the checkbox if you want purely random paragraphs without the famous first sentence.",
  },
  {
    q: "Is this text safe to use in commercial designs?",
    a: "Yes. Lorem ipsum is centuries-old scrambled Latin from Cicero's writings — no one owns it, and it's been the industry standard placeholder for decades.",
  },
  {
    q: "Is anything tracked or uploaded?",
    a: "No. Generation picks from a text bank stored in the page itself and runs in your browser. Nothing you generate leaves your device.",
  },
  {
    q: "What is the difference between lorem ipsum and readable dummy text?",
    a: "Lorem ipsum's fake Latin means nobody tries to read it, so layout reviews stay focused on design. Readable placeholder like your text here distracts reviewers into critiquing words you have not written yet.",
  },
  {
    q: "Can I get lorem ipsum in other languages or variants?",
    a: "The classic generator uses the traditional Latin-based text. Themed variants exist elsewhere, but standard lorem ipsum is the safest choice — every client recognizes it instantly as placeholder.",
  },

];

const steps = [
  {
    title: "Choose a unit",
    text: "Pick paragraphs for layout mockups, sentences for short blocks, or words when you need an exact length.",
  },
  {
    title: "Set the count",
    text: "Enter how many you need (up to 100) and decide whether the first paragraph should open with the classic “Lorem ipsum…” line.",
  },
  {
    title: "Generate and copy",
    text: "Hit Generate, preview the text with its word and character counts, then copy it straight into your design.",
  },
];

export default function LoremPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to generate lorem ipsum text",
          step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.text,
          })),
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/lorem-ipsum-generator" },
          { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum-generator" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Lorem Ipsum Generator" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Lorem Ipsum <em>Generator</em> Online
            </>
          }
          tagline="A free Lorem Ipsum generator: placeholder text by paragraphs, sentences, or words — one click."
        />

        <LoremClient />
        <PrivacyNote>
          Text is generated from a built-in word bank entirely in your browser. Nothing is uploaded or tracked.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What this tool <em>handles</em></>}
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
              t: "Three units",
              d: "Generate by paragraphs (layout mockups), sentences (short text blocks), or words (exact lengths for tight spaces).",
            },
            {
              t: "1–100 at a time",
              d: "Any count from 1 to 100 per generation. Need more? Generate twice and combine — it takes seconds.",
            },
            {
              t: "Classic opener option",
              d: "The famous “Lorem ipsum dolor sit amet…” opening is on by default, with a checkbox to turn it off for purely random text.",
            },
            {
              t: "Live word count",
              d: "Every generation shows its word and character count, so you know immediately whether it fits your layout.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>placeholder</em></>} />
        <Steps steps={steps} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When placeholder text <em>helps</em></>}
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
              t: "Website mockups",
              d: "Fill hero sections and article cards before the real copy is written, so the design can be reviewed on real-looking text.",
            },
            {
              t: "Font testing",
              d: "See how a typeface handles long paragraphs, italics contexts, and punctuation without writing content first.",
            },
            {
              t: "Print layouts",
              d: "Test brochures, magazines, and book pages with realistic text flow before the copy deadline hits.",
            },
            {
              t: "CMS templates",
              d: "Fill blog and product templates with dummy content to check spacing, truncation, and responsive breakpoints.",
            },
            {
              t: "Presentations",
              d: "Mock up slide decks with believable text blocks so stakeholders focus on structure instead of unfinished copy.",
            },
            {
              t: "Wireframe annotations",
              d: "Pair placeholder paragraphs with wireframe boxes to communicate text volume and hierarchy before a single word of copy exists.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Lorem ipsum <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["word-counter", "case-converter", "text-to-pdf"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
