import FancyTextGeneratorClient from "./ToolClient";
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

const tool = toolBySlug("fancy-text-generator")!;

export const metadata = pageMeta({
  title: "Fancy Text Generator - Stylish Fonts for Instagram & TikTok Free",
  description:
    "Generate fancy text in 12 stylish Unicode fonts — bold, italic, script, monospace and more. Copy-paste ready for Instagram bios, TikTok names & WhatsApp. Free, no sign-up.",
  path: "/tools/fancy-text-generator",
  keywords: [
    "fancy text generator",
    "stylish text",
    "cool fonts",
    "instagram fonts",
    "tiktok fonts",
    "fancy letters",
  ],
});

const faqs = [
  {
    q: "How do I use fancy text on Instagram?",
    a: "Type your text in the generator, tap Copy on any style you like, then paste it into your Instagram bio, name field, caption, or story text. The styles are real Unicode characters, so they work everywhere — no app needed.",
  },
  {
    q: "Will fancy text work on TikTok and WhatsApp?",
    a: "Yes. Because these are standard Unicode characters (not images or custom fonts), they display on TikTok bios and video captions, WhatsApp names and status, Twitter, Facebook — anywhere you can paste text.",
  },
  {
    q: "Why do some styles look different on my phone?",
    a: "Unicode rendering depends on your device's font support. Most modern phones show all 12 styles correctly. Very old devices may show boxes for rarer characters like Fraktur or double-struck — bold and italic always work.",
  },
  {
    q: "Is there a character limit?",
    a: "The input is capped at 120 characters, which is plenty for bios and display names. Instagram bios allow 150 characters, so styled text fits comfortably.",
  },
  {
    q: "Is my text private?",
    a: "Yes. Conversion happens entirely in your browser with a simple character map — nothing is uploaded, stored, or sent anywhere.",
  },
];

export default function FancyTextGeneratorPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Fancy Text Generator", path: "/tools/fancy-text-generator" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Fancy Text Generator" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Fancy <em>Text</em> Generator
            </>
          }
          tagline="Type once, get your text in 12 stylish Unicode fonts — bold, italic, script, monospace. Copy-paste ready for bios and captions."
        />

        <FancyTextGeneratorClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your text is never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>fancy text</em> generator</>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A fancy text generator converts plain letters into stylish Unicode characters — 𝐛𝐨𝐥𝐝,{" "}
            <i>italic</i>, 𝒔𝒄𝒓𝒊𝒑𝒕, 𝕕𝕠𝕦𝕓𝕝𝕖-𝕤𝕥𝕣𝕦𝕔𝕜 — that work anywhere text works. Unlike
            image-based text stylers, these are real characters from the Unicode standard, so they
            paste directly into Instagram bios, TikTok display names, WhatsApp status, Twitter
            handles, and YouTube comments with no app or font install.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            This free generator offers 12 styles with a one-tap copy button on each. Type your
            name, a quote, or a short phrase and preview every style instantly. Because conversion
            is a simple character map running in your browser, it works offline-capable, has no
            character fees, and never sends your text to a server.
          </p>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>stylish text</em></>} />
        <Steps
          steps={[
            {
              title: "Type your text",
              text: "Enter a name, word, or short phrase — up to 120 characters. Previews update instantly.",
            },
            {
              title: "Pick a style",
              text: "Browse 12 Unicode styles: bold, italic, script, fraktur, monospace, circled, and more.",
            },
            {
              title: "Copy & paste",
              text: "Tap Copy on your favorite style, then paste it into your bio, caption, or message.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Fancy text <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["word-counter", "case-converter", "qr-code-generator"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
