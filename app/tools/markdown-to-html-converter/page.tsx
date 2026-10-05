import MarkdownClient from "./ToolClient";
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
  slug: "markdown-to-html-converter",
  name: "Markdown to HTML Converter",
  tagline: "A free Markdown to HTML converter: write Markdown, get clean HTML with a live preview — one-click copy.",
  description:
    "Free Markdown to HTML converter online: live preview plus one-click HTML copy — headings, lists, links, code blocks, and blockquotes, all in your browser.",
  category: "Developer Tools",
  keyword: "markdown to html converter",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "html-to-markdown-converter",
    "json-formatter",
    "base64-encoder-decoder"
],
};

export const metadata = pageMeta({
  title: "Markdown to HTML Converter - Write MD, Get HTML Free Online",
  description:
    "Markdown to HTML converter, free online: write Markdown, get clean HTML with a live preview and one-click copy. No sign-up needed. Try it now — it’s free!",
  path: "/tools/markdown-to-html-converter",
  keywords: [
    "Markdown to HTML",
    "Markdown to HTML converter",
    "MD to HTML",
    "convert Markdown to HTML",
    "Markdown editor",
  ],
});

const faqs = [
  {
    q: "Which Markdown features are supported?",
    a: "Headings (h1–h6), bold, italic, strikethrough, inline code, fenced code blocks, links, images, bullet and numbered lists, blockquotes, and horizontal rules. That's the everyday Markdown you actually use.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. The parser is a small script built into the page — no libraries to download, no sign-up, no backend. It works offline once the page has loaded.",
  },
  {
    q: "Can I copy the HTML for my blog or CMS?",
    a: "Yes — that's the point. Write in Markdown, hit Copy HTML, and paste the result into WordPress, a static site, or anywhere that accepts raw HTML. Switch to the HTML source tab to review it first.",
  },
  {
    q: "Is my text uploaded anywhere?",
    a: "No. Parsing happens with JavaScript inside your browser. Your writing never leaves your device, which makes this safe for drafts and private notes.",
  },
  {
    q: "Why doesn't my table render?",
    a: "Tables aren't part of this lightweight parser — it focuses on the core Markdown syntax. For tables, write the HTML by hand or use a full editor.",
  },
  {
    q: "Can I convert a whole Markdown document at once?",
    a: "Yes. Paste the entire document — a full README, article, or chapter. There is no length limit; the parser handles thousands of lines as easily as a paragraph.",
  },
  {
    q: "Does it add syntax highlighting to code blocks?",
    a: "No. Code blocks are output as plain pre/code HTML without highlighting classes. If you want colored code, run the HTML through a highlighter like highlight.js or Prism afterwards.",
  },

];

const steps = [
  {
    title: "Write Markdown",
    text: "Type or paste Markdown in the left panel — the editor starts with a sample so you can see the syntax immediately.",
  },
  {
    title: "Watch the preview",
    text: "The right panel renders your HTML live. Flip to the HTML source tab to inspect or review the generated markup.",
  },
  {
    title: "Copy the HTML",
    text: "Hit Copy HTML and paste it into your CMS, blog, email template, or documentation page.",
  },
];

export default function MarkdownToHtmlPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to convert Markdown to HTML",
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
          { name: "Tools", path: "/tools/markdown-to-html-converter" },
          { name: "Markdown to HTML Converter", path: "/tools/markdown-to-html-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Markdown to HTML Converter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Markdown to <em>HTML Converter</em> Online
            </>
          }
          tagline="A free Markdown to HTML converter: write Markdown, get clean HTML with a live preview — one-click copy."
        />

        <MarkdownClient />
        <PrivacyNote>
          A small built-in parser converts your text inside the browser. Nothing is uploaded, stored, or analyzed.
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
              t: "Core Markdown syntax",
              d: "Headings, bold, italic, strikethrough, links, images, bullet and numbered lists, inline code, code blocks, blockquotes, and horizontal rules.",
            },
            {
              t: "No dependencies",
              d: "The parser is hand-written for this page — no npm packages, no CDN scripts, nothing to load except the page itself. Fast and offline-capable.",
            },
            {
              t: "Live preview + source",
              d: "Toggle between a rendered preview and the raw HTML source. Review the markup, then copy it with one click.",
            },
            {
              t: "Tables not included",
              d: "Table syntax isn't supported by this lightweight parser — it focuses on the 90% of Markdown people write daily.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>HTML</em></>} />
        <Steps steps={steps} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When Markdown-to-HTML <em>helps</em></>}
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
              t: "Blog publishing",
              d: "Draft posts in Markdown, then paste the generated HTML into WordPress or any CMS that accepts raw markup.",
            },
            {
              t: "README files",
              d: "Preview how your GitHub README will look and grab the HTML version for wikis that don't render Markdown.",
            },
            {
              t: "Email newsletters",
              d: "Write the newsletter in easy Markdown, convert, and drop the HTML into your email tool's code block.",
            },
            {
              t: "Learn Markdown",
              d: "The live preview is the fastest way to learn the syntax — type, see the result, and the rules stick.",
            },
            {
              t: "Documentation",
              d: "Author docs in Markdown and export clean HTML snippets for help centers and knowledge bases.",
            },
            {
              t: "Forums and wikis",
              d: "Many forums, internal wikis, and ticketing systems accept raw HTML but not Markdown. Write comfortably in Markdown here, then paste the generated markup where it is needed.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Markdown <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["html-to-markdown-converter", "json-formatter", "base64-encoder-decoder"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
