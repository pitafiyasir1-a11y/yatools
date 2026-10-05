import JsonFormatterClient from "./ToolClient";
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

const tool = toolBySlug("json-formatter")!;

export const metadata = pageMeta({
  title: "Free JSON Formatter, Validator & Minifier",
  description:
    "Format, validate, and minify JSON in your browser. Clear error messages with line numbers, one-click copy. Free, no sign-up, fully private.",
  path: "/tools/json-formatter",
  keywords: [
    "json formatter online",
    "json validator",
    "json minifier",
    "format json",
    "json syntax checker",
  ],
});

const faqs = [
  {
    q: "What does the JSON formatter do?",
    a: "It takes raw JSON — however messy — and reprints it with clean 2-space indentation so the structure is easy to read. Minify does the opposite: it strips all whitespace for the smallest possible payload. Validate just checks the syntax without changing anything.",
  },
  {
    q: "How do I find the error in my JSON?",
    a: "Paste it and hit Format or Validate. If parsing fails, the tool shows the exact line and column plus the offending line with a caret pointing at the problem. The most common culprits are trailing commas, single quotes instead of double quotes, and unquoted keys.",
  },
  {
    q: "Why does my JSON fail with “Unexpected token”?",
    a: "Strict JSON is pickier than JavaScript objects: keys and strings must use double quotes, trailing commas are forbidden, and comments are not allowed. Copy the reported line/column from the error box and fix that spot.",
  },
  {
    q: "Is there a size limit?",
    a: "No server-side limit — everything runs in your browser, so even multi-megabyte API responses format fine. Extremely large documents (tens of MB) may take a moment to render.",
  },
  {
    q: "Is my JSON data private?",
    a: "Yes. Parsing and formatting happen locally on your device; your JSON is never uploaded or logged. Safe for API keys, tokens, and production payloads — though as a rule, avoid pasting live secrets anywhere.",
  },
];

export default function JsonFormatterPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/json-formatter" },
          { name: "JSON Formatter", path: "/tools/json-formatter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "JSON Formatter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              JSON <em>Formatter</em>
            </>
          }
          tagline="Format, validate, and minify JSON instantly — with precise error messages that point at the exact line and column."
        />

        <JsonFormatterClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your JSON is never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>clean JSON</em></>} />
        <Steps
          steps={[
            {
              title: "Paste your JSON",
              text: "Drop in an API response, config file, or payload — formatted or minified, valid or broken.",
            },
            {
              title: "Pick an action",
              text: "Format for readable indentation, Minify for the smallest payload, or Validate to just check syntax.",
            },
            {
              title: "Fix or copy",
              text: "Errors show the exact line and column with a caret. Copy the fixed result straight into your code.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>Features <em>built in</em></>}
          sub="What the tool does for you, and the limits it respects."
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
              t: "Pretty-print & minify",
              d: "Format expands JSON to readable 2-space indentation; Minify compresses it to a single line. Both preserve key order and all values exactly.",
            },
            {
              t: "Errors with line numbers",
              d: "Instead of a cryptic message, you get the line, the column, and the offending line with a caret — so a missing comma takes seconds to find.",
            },
            {
              t: "Strict JSON rules",
              d: "Validation follows the JSON spec: double quotes only, no trailing commas, no comments, no NaN or Infinity. If it passes here, JSON.parse accepts it anywhere.",
            },
            {
              t: "Local & unlimited",
              d: "No uploads means no size caps and no waiting on a server. Large API dumps format instantly, and your data never leaves the tab.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Examples" title={<>Common <em>fixes</em></>} />
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
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>trailing-comma.json</span>
            </div>
            <pre>{`{ "name": "YATools",
  "free": true,   ← trailing comma
}

Error: line 2, column 17.
Remove the comma → valid.`}</pre>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>minify.json</span>
            </div>
            <pre>{`Before: 1,240 chars, indented
After minify: 812 chars, one line

Smaller payloads = faster API
calls and cheaper bandwidth.`}</pre>
          </div>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>JSON <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["n8n-workflow-search", "word-counter", "case-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
