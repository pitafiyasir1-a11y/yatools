import HtmlToMdClient from "./ToolClient";
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
  slug: "html-to-markdown-converter",
  name: "HTML to Markdown Converter",
  tagline: "A free HTML to Markdown converter: turn messy HTML into clean, readable Markdown — fully private.",
  description:
    "Free HTML to Markdown converter online: live conversion of headings, links, lists, code, and formatting — runs in your browser, no sign-up.",
  category: "Developer Tools",
  keyword: "html to markdown converter",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "markdown-to-html-converter",
    "json-formatter",
    "base64-encoder-decoder"
],
};

export const metadata = pageMeta({
  title: "HTML to Markdown Converter - HTML to MD Free Online",
  description:
    "HTML to Markdown converter, free online: turn messy HTML into clean, readable Markdown in seconds. No sign-up, fully private. No watermarks, ever. Try it now!",
  path: "/tools/html-to-markdown-converter",
  keywords: [
    "HTML to Markdown",
    "HTML to Markdown converter",
    "HTML to MD",
    "convert HTML to Markdown",
    "reverse Markdown",
  ],
});

const faqs = [
  {
    q: "What HTML elements are converted?",
    a: "Headings (h1–h6), paragraphs, bold, italic, links, images, bullet and numbered lists (including nesting), inline code, code blocks, blockquotes, and horizontal rules. Scripts, styles, and page chrome are dropped.",
  },
  {
    q: "Will the Markdown look exactly like the page?",
    a: "It keeps the content and structure — headings, links, lists, emphasis — but not pixel-perfect styling. Markdown is about readable plain text, so colors, fonts, and layouts are intentionally left out.",
  },
  {
    q: "Can I paste a whole copied webpage?",
    a: "Yes. Paste copied page source or markup and the converter strips navigation, scripts, and styles, keeping the article-like content as Markdown.",
  },
  {
    q: "Is my HTML uploaded anywhere?",
    a: "No. Conversion uses the browser's own DOM parser and a small script — your HTML is parsed locally and never leaves your device.",
  },
  {
    q: "Does it handle nested lists?",
    a: "Yes — nested lists are indented properly with two spaces per level, so the Markdown renders the same hierarchy.",
  },
  {
    q: "What happens to tables in the HTML?",
    a: "Simple tables with headers and rows convert to Markdown table syntax. Complex tables with merged cells have no clean Markdown equivalent — those come out simplified, and you can tidy them by hand.",
  },
  {
    q: "Can I convert HTML copied from Google Docs or Word?",
    a: "Yes — this is one of the best uses. Word and Docs export notoriously bloated HTML; the converter strips the font tags, spans, and inline styles, leaving clean Markdown structure.",
  },

];

const steps = [
  {
    title: "Paste your HTML",
    text: "Drop in markup from a page, an email, or your editor. A sample is pre-loaded so you can see it work instantly.",
  },
  {
    title: "Watch it convert",
    text: "The Markdown appears live as you paste — headings become #, links become [text](url), lists become - items.",
  },
  {
    title: "Copy the Markdown",
    text: "Hit Copy Markdown and paste it into your notes, docs, README, or any Markdown-friendly editor.",
  },
];

export default function HtmlToMarkdownPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to convert HTML to Markdown",
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
          { name: "Tools", path: "/tools/html-to-markdown-converter" },
          { name: "HTML to Markdown Converter", path: "/tools/html-to-markdown-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "HTML to Markdown Converter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free HTML to <em>Markdown Converter</em> Online
            </>
          }
          tagline="A free HTML to Markdown converter: turn messy HTML into clean, readable Markdown — fully private."
        />

        <HtmlToMdClient />
        <PrivacyNote>
          Your HTML is parsed with the browser's own DOM engine and converted locally. Nothing is uploaded or stored.
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
              t: "Full structure conversion",
              d: "Headings, links, images, lists (nested too), bold, italic, code blocks, blockquotes, and horizontal rules all become proper Markdown.",
            },
            {
              t: "Junk is stripped",
              d: "Scripts, styles, and page chrome are dropped automatically — you get the content, not the machinery around it.",
            },
            {
              t: "Live conversion",
              d: "Paste once and the Markdown appears instantly. Edit the HTML and the output follows with zero clicks.",
            },
            {
              t: "Styling is not kept",
              d: "Markdown has no fonts or colors by design. Expect clean readable text, not a pixel copy of the original page.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>Markdown</em></>} />
        <Steps steps={steps} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When HTML-to-Markdown <em>helps</em></>}
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
              t: "Save web articles",
              d: "Turn a page's HTML into clean Markdown for your notes app — readable forever, without the ads and menus.",
            },
            {
              t: "Migrate a CMS",
              d: "Moving from an HTML-based site to a static generator? Convert article markup to Markdown in bulk.",
            },
            {
              t: "Clean email HTML",
              d: "Newsletter HTML is bloated with tables and inline styles. Convert the text content to Markdown for archiving.",
            },
            {
              t: "Write documentation",
              d: "Prototype docs in a visual editor, then convert to Markdown for GitHub, GitBook, or your docs site.",
            },
            {
              t: "Feed AI tools",
              d: "LLMs read Markdown far better than raw HTML. Convert a page before pasting it into a chat for cleaner summaries.",
            },
            {
              t: "Newsletter archives",
              d: "Email HTML is the messiest HTML there is. Convert campaign code into readable Markdown to archive what you actually sent — without the table soup.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>HTML-to-Markdown <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["markdown-to-html-converter", "json-formatter", "base64-encoder-decoder"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
