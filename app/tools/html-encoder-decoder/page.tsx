import HtmlClient from "./ToolClient";
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
  slug: "html-encoder-decoder",
  name: "HTML Encoder & Decoder",
  tagline: "A free online HTML encoder and decoder: turn HTML into entities and back — instant, private.",
  description:
    "Free HTML entity encoder and decoder online: escape < > & \" ' for safe display or decode named and numeric entities — instant in your browser.",
  category: "Developer Tools",
  keyword: "html encode decode online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "markdown-to-html-converter",
    "html-to-markdown-converter",
    "base64-encoder-decoder"
],
};

export const metadata = pageMeta({
  title: "HTML Encoder Decoder - Encode HTML Entities Free Online",
  description:
    "HTML encoder and decoder, free online: convert HTML to entities and entities back to readable text, instantly. No sign-up. No watermarks, ever. Try it now!",
  path: "/tools/html-encoder-decoder",
  keywords: [
    "html encode decode online",
    "html encoder decoder",
    "html entity encoder",
    "encode html online",
    "html entities converter",
  ],
});

const faqs = [
  {
    q: "What are HTML entities?",
    a: "Entities are text codes that stand in for special characters in HTML: &lt; for <, &gt; for >, &amp; for &, &quot; for quotes. Browsers render them as the character, but the HTML parser doesn't treat them as markup.",
  },
  {
    q: "Why do I need to encode HTML?",
    a: "To display code or user input safely on a page. If you paste <script> into a page without encoding, the browser tries to run it. Encoding turns it into harmless visible text — the basis of preventing XSS attacks.",
  },
  {
    q: "What's the difference between named and numeric entities?",
    a: "Named entities use words: &copy; for ©. Numeric entities use the character's code point: &#169; or &#xA9;. Both render the same. This tool decodes both forms and encodes with the most common named entities.",
  },
  {
    q: "When do I need the decoder?",
    a: "When you scrape or copy content from a page and it arrives full of &amp; &nbsp; &quot; codes — decode them to get clean, readable text for your editor or database.",
  },
  {
    q: "Is anything I paste uploaded?",
    a: "No. Encoding and decoding happen with plain JavaScript string replacement inside your browser. Your HTML never leaves your device.",
  },
  {
    q: "What characters get encoded?",
    a: "The five structural ones: & < > \" and '. These are the characters that can break markup or enable script injection, so escaping them is the safe default.",
  },
];

const steps = [
  {
    title: "Choose encode or decode",
    text: "Pick Encode to escape HTML into entities, or Decode to turn &lt; &amp; &quot; style codes back into plain characters.",
  },
  {
    title: "Paste your text",
    text: "Drop in HTML markup, a code snippet, or entity-filled text. The result converts live as you type.",
  },
  {
    title: "Copy the result",
    text: "One click copies the output — paste it straight into your editor, CMS, or database field.",
  },
];

export default function HtmlEncoderPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to encode and decode HTML entities",
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
          { name: "Tools", path: "/tools/html-encoder-decoder" },
          { name: "HTML Encoder & Decoder", path: "/tools/html-encoder-decoder" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "HTML Encoder & Decoder" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free HTML <em>Encoder &amp; Decoder</em> Online
            </>
          }
          tagline="A free online HTML encoder and decoder: turn HTML into entities and back — instant, private."
        />

        <HtmlClient />
        <PrivacyNote>
          Conversion is plain string replacement inside your browser. Your HTML is never uploaded or stored.
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
              t: "Safe encoding",
              d: "Encodes the five characters that matter for safety: & < > \" and '. Everything else — including Unicode text — passes through untouched.",
            },
            {
              t: "Named + numeric decode",
              d: "Decodes named entities like &copy; and &nbsp;, decimal codes like &#169;, and hex codes like &#xA9;. Unknown entities are left as-is.",
            },
            {
              t: "Live conversion",
              d: "No buttons to press. The output updates with every keystroke, so you can experiment and learn what each character becomes.",
            },
            {
              t: "Any length",
              d: "Paste a snippet or a whole document — there's no practical input size limit for text conversion.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>escaped</em></>} />
        <Steps steps={steps} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When entity encoding <em>helps</em></>}
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
              t: "Display code on a page",
              d: "Writing a tutorial with <div> examples? Encode the snippet so browsers show it as text instead of rendering it.",
            },
            {
              t: "Prevent XSS",
              d: "Encoding user input before inserting it into a page is the first line of defense against cross-site scripting.",
            },
            {
              t: "Clean scraped text",
              d: "Copied content full of &amp; and &nbsp; codes? Decode it to get plain text for your notes or database.",
            },
            {
              t: "Email templates",
              d: "Email HTML is picky about special characters in subject lines and preheaders. Encode them to avoid mangled output.",
            },
            {
              t: "CMS migrations",
              d: "Moving content between systems often double-encodes entities. Decode to normalize everything back to plain characters.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>HTML entity <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["markdown-to-html-converter", "html-to-markdown-converter", "base64-encoder-decoder"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
