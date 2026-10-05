import HeicToPngClient from "./ToolClient";
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
  slug: "heic-to-png-converter",
  name: "HEIC to PNG Converter",
  tagline: "A free HEIC to PNG converter: open iPhone HEIC photos anywhere as lossless PNGs — no upload.",
  description:
    "Free online HEIC to PNG converter: turn iPhone .heic photos into lossless, universally-compatible PNGs in your browser. No upload, no sign-up.",
  category: "Everyday Utilities",
  keyword: "heic to png",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "heic-to-jpg-converter",
    "png-to-jpg-converter",
    "image-converter"
],
};

export const metadata = pageMeta({
  title: "HEIC to PNG Converter - iPhone HEIC to PNG Free Online",
  description:
    "HEIC to PNG converter, free online: open iPhone HEIC photos anywhere as lossless PNGs. Runs entirely in your browser, no uploads. Try it now — it’s free!",
  path: "/tools/heic-to-png-converter",
  keywords: [
    "HEIC to PNG",
    "HEIC to PNG converter",
    "convert HEIC to PNG",
    "iPhone HEIC to PNG",
    "HEIC to PNG free",
  ],
});

const faqs = [
  {
    q: "What is a HEIC file?",
    a: "HEIC is the photo format iPhones have used by default since iOS 11. It's brilliantly efficient — about twice the quality per megabyte of JPEG — but Windows PCs, older Androids, and many websites still can't open it. PNG opens everywhere.",
  },
  {
    q: "Why is the PNG so much bigger than my HEIC?",
    a: "That's expected, not a bug. HEIC is one of the most efficient formats ever made, while PNG stores every pixel losslessly with no compression tricks. A 2 MB HEIC routinely becomes an 8–12 MB PNG. You're trading size for universal compatibility.",
  },
  {
    q: "My file won't convert — it says the HEIC variant isn't supported. What now?",
    a: "Some HEIC files use features the in-browser decoder can't handle (certain HDR variants, or files from non-Apple cameras). The fix: open the photo in your phone's Photos app and export/share it, then convert that exported file instead.",
  },
  {
    q: "Does the PNG keep the full quality?",
    a: "Yes — PNG is lossless, so every pixel that was decoded from the HEIC is preserved exactly. There's no quality slider because there's nothing to lose.",
  },
  {
    q: "Is my photo uploaded anywhere?",
    a: "No. The heic2any decoding engine runs entirely in your browser. Your photos are never uploaded, stored, or seen by anyone but you.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert HEIC to PNG",
  description: "Turn an iPhone HEIC photo into a lossless PNG with YATools' free converter.",
  step: [
    {
      "@type": "HowToStep",
      name: "Upload your HEIC photo",
      text: "Drop a .heic or .heif file onto the tool. It stays in your browser — nothing is uploaded.",
    },
    {
      "@type": "HowToStep",
      name: "Convert to PNG",
      text: "Hit Convert to PNG. PNG is lossless, so there's no quality setting to tune — every pixel is kept.",
    },
    {
      "@type": "HowToStep",
      name: "Download your PNG",
      text: "Download the PNG, which now opens on any device, app, or website — no more 'unsupported format' errors.",
    },
  ],
};

export default function HeicToPngPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={howToJsonLd} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/heic-to-png-converter" },
          { name: "HEIC to PNG Converter", path: "/tools/heic-to-png-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "HEIC to PNG Converter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free HEIC to <em>PNG Converter</em> Online
            </>
          }
          tagline="A free HEIC to PNG converter: open iPhone HEIC photos anywhere as lossless PNGs — no upload."
        />

        <HeicToPngClient />
        <PrivacyNote>
          Decoding runs 100% in your browser with the heic2any engine. Your photos are never uploaded, stored, or seen by anyone but you.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>convert</em></>}
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
              t: "Inputs",
              d: ".heic and .heif files up to 100 MB — straight from your iPhone, iPad, or Mac. Read from your device; nothing is uploaded first.",
            },
            {
              t: "Output",
              d: "Lossless PNG at full original resolution, transparency preserved. Opens on every device, app, and website on Earth.",
            },
            {
              t: "Honest sizes",
              d: "Expect the PNG to be 3–5× bigger than the HEIC. That's the real cost of lossless universal compatibility — not a bug.",
            },
            {
              t: "Honest limits",
              d: "A few exotic HEIC variants can't be decoded in any browser. If yours fails, export it from your phone's Photos app and retry.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>universal</em> photo</>} />
        <Steps
          steps={[
            {
              title: "Drop in your HEIC",
              text: "Choose a .heic or .heif photo up to 100 MB. It never leaves your browser — decoding happens on your device.",
            },
            {
              title: "Convert to PNG",
              text: "Hit Convert to PNG. Lossless means no quality slider — every pixel is preserved exactly, transparency included.",
            },
            {
              title: "Download & use anywhere",
              text: "Download the PNG and open it on Windows, Android, or any website that ever said 'unsupported format'.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When PNG is the <em>right call</em></>}
          sub="HEIC is efficient. PNG is universal."
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
              t: "Upload to stubborn websites",
              d: "Job portals, government forms and CMSs that reject HEIC accept PNG every time. Convert once, upload anywhere.",
            },
            {
              t: "Share with non-iPhone users",
              d: "Your Windows-using friend can't open that HEIC you sent. A PNG just works — no 'what app do I need?' messages.",
            },
            {
              t: "Editing in any app",
              d: "Photoshop, Figma, Canva, old Lightroom — PNG drops straight into every editor ever made, layers and transparency intact.",
            },
            {
              t: "Archival copies",
              d: "PNG is lossless and will be readable forever. For the handful of photos that really matter, a PNG copy is cheap insurance.",
            },
            {
              t: "Screenshots & graphics",
              d: "HEIC screenshots of app UI or text stay razor-sharp as PNG — ideal for documentation, bug reports and tutorials.",
            },
            {
              t: "Private by default",
              d: "Family photos converted locally never touch a server — no uploading personal pictures to a stranger's converter.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>HEIC to PNG <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["heic-to-jpg-converter", "png-to-jpg-converter", "image-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
