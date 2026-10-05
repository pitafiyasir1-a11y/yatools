import TimestampClient from "./ToolClient";
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
  slug: "unix-timestamp-converter",
  name: "Unix Timestamp Converter",
  tagline: "A free Unix timestamp converter: turn epoch timestamps into dates — and dates back into timestamps.",
  description:
    "Free Unix timestamp converter: epoch to human date and back, with a live current-timestamp ticker, automatic second/millisecond detection, and UTC + local time.",
  category: "Developer Tools",
  keyword: "unix timestamp converter",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "json-formatter",
    "url-encoder-decoder",
    "base64-encoder-decoder"
],
};

export const metadata = pageMeta({
  title: "Unix Timestamp Converter - Epoch to Date Free Online",
  description:
    "Unix timestamp converter, free online: turn epoch time into readable dates and dates back into timestamps. No sign-up needed. No watermarks, ever. Try it now!",
  path: "/tools/unix-timestamp-converter",
  keywords: [
    "Unix timestamp converter",
    "epoch time converter",
    "timestamp to date",
    "convert timestamp",
    "Unix time converter",
  ],
});

const faqs = [
  {
    q: "What is a Unix timestamp?",
    a: "The number of seconds since January 1, 1970, 00:00:00 UTC — called the Unix epoch. It's how computers store dates compactly: one integer, no timezones, no formatting ambiguity.",
  },
  {
    q: "How do I know if my timestamp is seconds or milliseconds?",
    a: "You usually don't have to: this tool detects it automatically. A 10-digit number is seconds (good until year 2286); a 13-digit number is milliseconds. JavaScript's Date.now() returns milliseconds, most APIs and databases use seconds.",
  },
  {
    q: "Why does the same timestamp show two different times?",
    a: "The timestamp is one absolute moment in time. Your local timezone and UTC just label that moment differently — 5 hours apart in Pakistan (PKT). Both answers on this page are the same instant.",
  },
  {
    q: "Can I convert future or past dates?",
    a: "Yes — any date JavaScript can represent, roughly 1970 back to the year 275,760 in the future. Negative timestamps (before 1970) work too.",
  },
  {
    q: "Is anything sent to a server?",
    a: "No. Timestamps are converted with the browser's built-in Date object. The live ticker just reads your device clock — nothing leaves your machine.",
  },
];

const steps = [
  {
    title: "Grab the current timestamp",
    text: "The live ticker at the top shows right now in seconds and milliseconds — hit the copy button to grab it.",
  },
  {
    title: "Convert either direction",
    text: "Paste a timestamp to read it as a date (local time, UTC and a relative “3 days ago” label), or pick a date to get its timestamp.",
  },
  {
    title: "Use it in your code",
    text: "Drop the timestamp into your API request, database query, or log search — no timezone math required on your end.",
  },
];

export default function TimestampPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to convert a Unix timestamp",
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
          { name: "Tools", path: "/tools/unix-timestamp-converter" },
          { name: "Unix Timestamp Converter", path: "/tools/unix-timestamp-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Unix Timestamp Converter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Unix <em>Timestamp Converter</em> Online
            </>
          }
          tagline="A free Unix timestamp converter: turn epoch timestamps into dates — and dates back into timestamps."
        />

        <TimestampClient />
        <PrivacyNote>
          Conversion uses your browser's Date object and your device clock. No timestamps are uploaded or logged.
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
              t: "Auto second/ms detection",
              d: "Paste 1791369600 or 1791369600000 — the tool figures out which unit you meant from the digit count. No toggle to get wrong.",
            },
            {
              t: "Local + UTC + relative",
              d: "Every timestamp shows your local time, the UTC equivalent, and a human label like “2 hours ago” or “3 days from now”.",
            },
            {
              t: "Live now ticker",
              d: "The top card ticks every second with the current epoch in both units, so you can grab “right now” without opening a terminal.",
            },
            {
              t: "Date → timestamp",
              d: "Pick any date and time with the calendar control to get its epoch value in seconds and milliseconds instantly.",
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
          title={<>When timestamp conversion <em>helps</em></>}
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
              t: "Read log timestamps",
              d: "Server logs store events as epoch integers. Paste one to see exactly when it happened in your timezone.",
            },
            {
              t: "Debug API responses",
              d: "JSON payloads often carry created_at as a timestamp. Convert it in one paste instead of writing a throwaway script.",
            },
            {
              t: "Schedule cron jobs",
              d: "Pick a future date and get its epoch value for schedulers, TTL fields, and cache-expiry settings.",
            },
            {
              t: "Check token expiry",
              d: "JWT exp claims are epoch seconds. Convert yours to see when your token actually expires — and how long you have left.",
            },
            {
              t: "Database queries",
              d: "Querying a created_at column by epoch? Get the exact value for your date range without mental timezone math.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Timestamp <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["json-formatter", "url-encoder-decoder", "base64-encoder-decoder"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
