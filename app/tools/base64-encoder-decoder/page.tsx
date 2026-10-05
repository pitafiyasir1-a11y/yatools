import Base64Client from "./ToolClient";
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
  slug: "base64-encoder-decoder",
  name: "Base64 Encoder & Decoder",
  tagline: "A free Base64 encoder and decoder: encode text to Base64, decode it back, or turn files into data URIs.",
  description:
    "Free Base64 encoder and decoder online: convert text to Base64, decode Base64 to text, or encode files as data URIs — instant and private in your browser.",
  category: "Developer Tools",
  keyword: "base64 encode decode online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "url-encoder-decoder",
    "json-formatter",
    "n8n-workflow-search"
],
};

export const metadata = pageMeta({
  title: "Base64 Encoder & Decoder - Convert Text Free Online",
  description:
    "Base64 encoder and decoder, free online: turn text into Base64, decode it back, or convert files to data URIs. No sign-up, private. Try it now — it’s free!",
  path: "/tools/base64-encoder-decoder",
  keywords: [
    "Base64 encoder",
    "Base64 decoder",
    "Base64 converter",
    "encode Base64",
    "decode Base64",
  ],
});

const faqs = [
  {
    q: "What is Base64 encoding used for?",
    a: "Base64 turns binary data into plain ASCII text so it can travel safely through text-only systems — embedding images in HTML/CSS as data URIs, putting files in JSON payloads, or sending attachments in email (MIME).",
  },
  {
    q: "Does this handle emoji and non-English text?",
    a: "Yes. Text is encoded as UTF-8 before conversion, so Urdu, Arabic, emoji and every Unicode character round-trips correctly. Many older tools only handle ASCII — this one doesn't have that problem.",
  },
  {
    q: "Is my text or file uploaded anywhere?",
    a: "No. Encoding and decoding happen entirely in your browser. Nothing you paste or upload leaves your device — safe for API keys, tokens and sensitive strings.",
  },
  {
    q: "Why does decoding fail with an error?",
    a: "The input probably isn't valid Base64: look for stray spaces, missing padding (=) at the end, or characters outside A–Z, a–z, 0–9, +, / and =. Remove them and try again.",
  },
  {
    q: "How do I use the data URI the file mode gives me?",
    a: "You can paste it straight into an <img> tag's src attribute or a CSS background:url(). It works offline because the file's bytes are embedded in the string — but the page gets heavier, so it's best for small images and icons.",
  },
  {
    q: "Is there a file size limit?",
    a: "Yes — 5 MB. Encoding happens in memory in your browser, and very large files would freeze the tab. For bigger files, use a desktop tool.",
  },
];

const steps = [
  {
    title: "Pick a direction",
    text: "Choose Text → Base64 to encode, Base64 → Text to decode, or File → Base64 to turn an upload into a data URI.",
  },
  {
    title: "Paste or pick",
    text: "Type or paste your text, or choose a file. Text modes convert live as you type; files encode the moment you select them.",
  },
  {
    title: "Copy the result",
    text: "The output panel shows the result with a character count. Hit Copy result and paste it wherever you need it.",
  },
];

export default function Base64Page() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to encode and decode Base64",
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
          { name: "Tools", path: "/tools/base64-encoder-decoder" },
          { name: "Base64 Encoder & Decoder", path: "/tools/base64-encoder-decoder" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Base64 Encoder & Decoder" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Base64 <em>Encoder &amp; Decoder</em> Online
            </>
          }
          tagline="A free Base64 encoder and decoder: encode text to Base64, decode it back, or turn files into data URIs."
        />

        <Base64Client />
        <PrivacyNote>
          All conversion runs in your browser's memory. Pasted text and files are never uploaded or stored anywhere.
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
              t: "Full Unicode support",
              d: "Text is encoded as UTF-8 first, so emoji, Urdu, Arabic and any Unicode text round-trips without corruption.",
            },
            {
              t: "Standard Base64",
              d: "Uses the standard Base64 alphabet (A–Z, a–z, 0–9, +, / with = padding). URL-safe Base64 (- and _) is decoded only if it also parses — standard output is always produced.",
            },
            {
              t: "File → data URI",
              d: "Turns a file into a data:image/...;base64,... style URI you can paste into HTML or CSS. Handy for small icons and images.",
            },
            {
              t: "5 MB file cap",
              d: "Uploads are capped at 5 MB so the tab stays responsive. There's no practical size limit for pasted text.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>converted</em></>} />
        <Steps steps={steps} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When Base64 <em>helps</em></>}
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
              t: "Debug API tokens",
              d: "JWT payloads and OAuth tokens are Base64-encoded. Paste the middle segment to read its claims in plain text.",
            },
            {
              t: "Embed images in CSS",
              d: "Turn a small icon into a data URI and inline it in your stylesheet — one less HTTP request, no broken image paths.",
            },
            {
              t: "Email attachments",
              d: "MIME email encodes attachments as Base64. Decode a chunk to inspect it, or encode text for a raw email test.",
            },
            {
              t: "Test webhooks",
              d: "Many APIs want binary data as Base64 strings in JSON. Encode your payload here before pasting it into the request body.",
            },
            {
              t: "Inspect encoded URLs",
              d: "Some services hide parameters in Base64 query strings. Decode them to see what's actually being passed.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Base64 <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["url-encoder-decoder", "json-formatter", "n8n-workflow-search"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
