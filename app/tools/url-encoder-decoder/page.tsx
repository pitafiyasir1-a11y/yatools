import UrlClient from "./ToolClient";
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
  slug: "url-encoder-decoder",
  name: "URL Encoder & Decoder",
  tagline: "A free URL encoder and decoder: percent-encode URLs or decode them back — two modes, instant.",
  description:
    "Free URL encoder and decoder online: percent-encode URLs and query parameters or decode them back — with full-URL and component modes, instant in your browser.",
  category: "Developer Tools",
  keyword: "url encode decode online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "base64-encoder-decoder",
    "html-encoder-decoder",
    "json-formatter"
],
};

export const metadata = pageMeta({
  title: "URL Encoder Decoder - Percent-Encode URLs Free Online",
  description:
    "URL encoder and decoder, free online: percent-encode URLs and query strings or decode them back, in two instant modes. No sign-up. Try it now — it’s free!",
  path: "/tools/url-encoder-decoder",
  keywords: [
    "URL encoder",
    "URL decoder",
    "URL encoder decoder",
    "percent encoding",
    "URL encode online",
  ],
});

const faqs = [
  {
    q: "What's the difference between component and full URL mode?",
    a: "Component mode (encodeURIComponent) escapes almost everything except letters, digits and - _ . ! ~ * ' ( ) — use it for query values like search terms. Full URL mode (encodeURI) leaves :// ? & = / # intact and only encodes truly unsafe characters — use it when pasting a complete link.",
  },
  {
    q: "Why do spaces show up as %20?",
    a: "URLs can only contain a limited set of characters, so unsafe ones are replaced with a % followed by their hex code. A space is %20, an ampersand is %26, and a question mark is %3F. This is called percent-encoding.",
  },
  {
    q: "When do I need to decode a URL?",
    a: "When you're debugging redirect chains, tracking links, or API callbacks and the link arrives as one long %3A%2F%2F mess. Decode it to see the real parameters, or to check whether a link is hiding a suspicious destination.",
  },
  {
    q: "Is my URL uploaded anywhere?",
    a: "No. Encoding and decoding run entirely in your browser with the built-in encodeURI / decodeURI functions. The links you paste never leave your device.",
  },
  {
    q: "What if decoding shows garbage characters?",
    a: "The text was probably encoded with a different character set than UTF-8, or it was double-encoded (%2520 instead of %20). Try decoding twice — double-encoded strings are common in redirect URLs.",
  },
];

const steps = [
  {
    title: "Choose encode or decode",
    text: "Pick Encode to turn plain text into %20-style encoding, or Decode to turn an encoded string back into readable text.",
  },
  {
    title: "Pick the right mode",
    text: "Use component mode for query values and path segments, full URL mode when you paste a complete link you want to keep structurally valid.",
  },
  {
    title: "Copy the result",
    text: "Conversion happens live as you type. Hit Copy result and paste it into your code, browser, or API request.",
  },
];

export default function UrlEncoderPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to encode and decode a URL",
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
          { name: "Tools", path: "/tools/url-encoder-decoder" },
          { name: "URL Encoder & Decoder", path: "/tools/url-encoder-decoder" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "URL Encoder & Decoder" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free URL <em>Encoder &amp; Decoder</em> Online
            </>
          }
          tagline="A free URL encoder and decoder: percent-encode URLs or decode them back — two modes, instant."
        />

        <UrlClient />
        <PrivacyNote>
          Encoding runs on the built-in JavaScript URI functions inside your browser. Your links are never sent to a server.
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
              t: "Two encoding modes",
              d: "Component mode encodes a single value (like a search query); full URL mode encodes a whole link while keeping its ://, ?, & and = structure valid.",
            },
            {
              t: "Unicode safe",
              d: "Non-ASCII characters — Urdu, Arabic, emoji — are encoded as UTF-8 percent sequences, exactly like modern browsers do.",
            },
            {
              t: "Live conversion",
              d: "No submit button. The result updates on every keystroke, so you can watch exactly how each character gets encoded.",
            },
            {
              t: "No length cap",
              d: "Paste long tracking URLs or giant query strings — the tool handles multi-kilobyte inputs without breaking a sweat.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>encoded</em></>} />
        <Steps steps={steps} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When URL encoding <em>helps</em></>}
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
              t: "Build query strings",
              d: "Search terms with spaces and & characters break links if left raw. Encode the value first, then drop it into ?q=.",
            },
            {
              t: "Fix broken shared links",
              d: "A link pasted from chat may contain raw spaces or brackets. Encode it properly and it becomes clickable everywhere.",
            },
            {
              t: "Debug redirects",
              d: "OAuth and payment callbacks carry encoded URLs inside URLs. Decode the outer layer to see where the inner link actually points.",
            },
            {
              t: "Read tracking links",
              d: "Marketing emails wrap destinations in encoded tracking URLs. Decode to verify the real destination before clicking.",
            },
            {
              t: "API parameters",
              d: "REST APIs often require encoded parameters in the URL path. Generate them here instead of guessing the escape rules.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>URL encoding <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["base64-encoder-decoder", "html-encoder-decoder", "json-formatter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
