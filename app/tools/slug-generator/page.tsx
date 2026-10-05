import SlugClient from "./ToolClient";
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
  slug: "slug-generator",
  name: "URL Slug Generator",
  tagline: "A free slug generator: turn any headline into a clean, SEO-friendly URL slug — live as you type.",
  description:
    "Free URL slug generator: paste a title and get a clean hyphenated slug as you type — with underscore option and length limit, instant in your browser.",
  category: "Developer Tools",
  keyword: "url slug generator",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "url-encoder-decoder",
    "word-counter",
    "case-converter"
],
};

export const metadata = pageMeta({
  title: "Slug Generator - Turn Titles into URL Slugs Free Online",
  description:
    "Slug generator, free online: turn any headline into a clean, SEO-friendly slug in one click. Accent transliteration included. No watermarks, ever. Try it now!",
  path: "/tools/slug-generator",
  keywords: [
    "slug generator",
    "URL slug generator",
    "create slug",
    "text to slug",
    "SEO slug generator",
  ],
});

const faqs = [
  {
    q: "What is a URL slug?",
    a: "The readable tail of a URL — the my-blog-post part of example.com/blog/my-blog-post. Good slugs are short, lowercase, and hyphenated so both people and search engines can guess the page's topic from the link alone.",
  },
  {
    q: "Why hyphens instead of spaces or underscores?",
    a: "Spaces break URLs and must be encoded as %20. Google treats hyphens as word separators but joins underscore_words together, so hyphens are the SEO-safe default.",
  },
  {
    q: "How are accents and special characters handled?",
    a: "Accented letters are transliterated (é → e, ü → u) and everything that isn't a letter or number becomes the separator. The result is pure ASCII — safe in every browser and server.",
  },
  {
    q: "Should I limit the slug length?",
    a: "Short slugs rank and share better. Set a max length (around 50–60 characters) to cut long headlines down to their core keywords automatically.",
  },
  {
    q: "Is my headline uploaded anywhere?",
    a: "No. Slug generation is a small string function running in your browser. Your titles never leave your device.",
  },
  {
    q: "Can I generate slugs in bulk?",
    a: "This tool converts one headline at a time, live as you type. For hundreds of titles, generate each slug and paste it into your spreadsheet or CMS — it takes seconds per title.",
  },
  {
    q: "Do slugs affect Google rankings?",
    a: "A clean, keyword-rich slug is a small positive signal and, more importantly, improves click-through — people trust readable URLs. Content quality and links still matter far more.",
  },

];

const steps = [
  {
    title: "Paste your title",
    text: "Drop in a blog headline, product name, or any phrase. The slug updates live with every keystroke.",
  },
  {
    title: "Tune the options",
    text: "Choose hyphens or underscores as the separator, and set a max length to trim long titles automatically.",
  },
  {
    title: "Copy the slug",
    text: "One click copies the clean slug — paste it into your CMS, router, or link and you're done.",
  },
];

export default function SlugPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to generate a URL slug",
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
          { name: "Tools", path: "/tools/slug-generator" },
          { name: "URL Slug Generator", path: "/tools/slug-generator" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "URL Slug Generator" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Slug <em>Generator</em> Online
            </>
          }
          tagline="A free slug generator: turn any headline into a clean, SEO-friendly URL slug — live as you type."
        />

        <SlugClient />
        <PrivacyNote>
          Slug generation is a tiny string function in your browser. Your headlines are never uploaded or stored.
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
              t: "Live as-you-type",
              d: "No generate button needed — the slug updates on every keystroke, so you can tweak the title and watch the slug follow.",
            },
            {
              t: "Accent transliteration",
              d: "é becomes e, ü becomes u, and other accented characters are normalized to plain ASCII so the slug works everywhere.",
            },
            {
              t: "Two separators",
              d: "Hyphens are the SEO default; switch to underscores if your system requires them. Duplicates collapse automatically.",
            },
            {
              t: "Optional length cap",
              d: "Set a max length to auto-trim long headlines. Trimming cuts at the limit and strips any trailing separator.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>slugged</em></>} />
        <Steps steps={steps} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When a slug generator <em>helps</em></>}
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
              d: "Turn every article headline into a clean, keyword-rich permalink in seconds instead of hand-editing URLs.",
            },
            {
              t: "E-commerce products",
              d: "Product names with sizes, colors, and symbols become tidy slugs your store URLs can safely carry.",
            },
            {
              t: "Documentation pages",
              d: "Generate predictable anchor-style slugs for docs headings so links stay short and shareable.",
            },
            {
              t: "Bulk imports",
              d: "Migrating hundreds of pages? Generate each slug here and paste it into your CSV — consistent formatting, zero typos.",
            },
            {
              t: "Social sharing",
              d: "Short readable slugs look trustworthy when pasted into posts and chats — no %20-encoded messes.",
            },
            {
              t: "YouTube and podcast episodes",
              d: "Episode titles with episode numbers and guest names become tidy slugs for show-notes pages — easy to say on air and easy to remember.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Slug <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["url-encoder-decoder", "word-counter", "case-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
