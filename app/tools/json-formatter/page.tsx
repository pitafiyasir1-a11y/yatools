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
  SITE,
} from "@/lib/site";

const tool = toolBySlug("json-formatter")!;

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "JSON Formatter — YATools",
    url: `${SITE.url}/tools/json-formatter`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Format, validate, and minify JSON free online — paste messy JSON, get clean indented output with precise error messages. No sign-up, fully private. Try now!",
  };
}

export const metadata = pageMeta({
  title: "JSON Formatter - Validate & Beautify JSON Free Online",
  description:
    "Format, validate, and minify JSON free online — paste messy JSON, get clean indented output with precise error messages. No sign-up, fully private. Try now!",
  path: "/tools/json-formatter",
  keywords: [
    "JSON formatter",
    "JSON beautifier",
    "format JSON",
    "JSON validator",
    "JSON minifier",
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
  {
    q: "Is there a free JSON formatter with no sign-up?",
    a: "Yes. Paste your JSON and get formatted, validated output instantly — no account, no upload, and your data never leaves your browser.",
  },

];

export default function JsonFormatterPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
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
              Free JSON <em>Formatter</em> Online
            </>
          }
          tagline="A free JSON formatter: format, validate, and minify JSON instantly — with precise error messages and zero sign-up."
        />

        <JsonFormatterClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your JSON is never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>JSON Formatter</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A JSON formatter takes the unreadable one-line blob your API returned and turns it into clean, indented, human-readable JSON. Paste any JSON into this free online tool and it validates the structure, pretty-prints it with proper indentation, or minifies it down for production payloads. Developers debugging APIs, configuring n8n workflows, and editing config files use it daily — and when your JSON is broken, the error messages point at the exact line and character instead of a cryptic failure.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Common culprits like trailing commas, unquoted keys, and mismatched brackets get flagged with plain-language explanations, which makes this as much a learning tool as a utility. Everything runs in your browser, so API keys, tokens, and production payloads you paste are never sent to a server. Switch between formatted and minified views with one click, copy the result straight to your clipboard, and get back to building.
          </p>
        </div>


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
        <RelatedTools slugs={["base64-encoder-decoder", "url-encoder-decoder", "n8n-workflow-search"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
