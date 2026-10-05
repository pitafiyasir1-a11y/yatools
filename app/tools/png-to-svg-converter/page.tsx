import PngToSvgClient from "./ToolClient";
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
  slug: "png-to-svg-converter",
  name: "PNG to SVG Converter",
  tagline: "A free PNG to SVG converter: vectorize logos and icons into clean, scalable SVGs — best for simple graphics, not photos.",
  description:
    "Free online PNG to SVG converter: trace logos, icons and line art into scalable vectors in your browser. No upload, no sign-up. Not for photos.",
  category: "Everyday Utilities",
  keyword: "png to svg",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "svg-to-png-converter",
    "png-to-jpg-converter",
    "image-converter"
],
};

export const metadata = pageMeta({
  title: "PNG to SVG Converter - Vectorize Logos Free Online",
  description:
    "PNG to SVG converter, free online: vectorize logos and simple graphics into clean, scalable SVGs. Best for icons, not photos. No watermarks, ever. Try it now!",
  path: "/tools/png-to-svg-converter",
  keywords: [
    "PNG to SVG",
    "PNG to SVG converter",
    "convert PNG to SVG",
    "raster to vector",
    "PNG to SVG tracer",
  ],
});

const faqs = [
  {
    q: "What does 'tracing' a PNG actually do?",
    a: "It finds the edges between dark and light areas in your image and redraws them as smooth vector paths — the same technique as the classic Potrace algorithm. The result is a real SVG that scales to any size without getting blurry.",
  },
  {
    q: "Why shouldn't I use this on photos?",
    a: "Because it traces in a single flat color. A photo traced this way comes out looking like a posterized stencil — and the file gets huge, since every little shape becomes a path. Photos belong in PNG/JPG; tracing is for logos, icons, and line art with flat colors.",
  },
  {
    q: "Can it trace multi-color logos?",
    a: "Honestly, no — this tool traces one color. A red-and-blue logo will come out as a single-color silhouette. True multi-color vectorization needs a paid tool; for a one-color version (a stamp, a stencil, a laser-cut file), this is exactly right.",
  },
  {
    q: "Why is my SVG bigger than the PNG?",
    a: "PNGs store pixels efficiently; SVGs store shapes as text. A detailed trace with thousands of paths can easily outweigh the PNG. Simple, bold graphics trace small — complex ones don't, and that's normal.",
  },
  {
    q: "Is my image uploaded anywhere?",
    a: "No. The potrace tracing engine runs entirely in your browser. Your PNG is never uploaded, stored, or seen by anyone but you.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert a PNG to SVG",
  description: "Vectorize a PNG logo or icon into SVG with YATools' free tracer.",
  step: [
    {
      "@type": "HowToStep",
      name: "Upload your PNG",
      text: "Drop a PNG logo, icon or line-art file (up to 25 MB) onto the tool. It stays in your browser — nothing is uploaded.",
    },
    {
      "@type": "HowToStep",
      name: "Tune the trace",
      text: "Leave the threshold on auto, adjust the speck filter to clean noise, and pick your trace color and background.",
    },
    {
      "@type": "HowToStep",
      name: "Trace and download",
      text: "Hit Trace to SVG, preview the vector result, then download the .svg file — it scales to any size without blurring.",
    },
  ],
};

export default function PngToSvgPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={howToJsonLd} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/png-to-svg-converter" },
          { name: "PNG to SVG Converter", path: "/tools/png-to-svg-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "PNG to SVG Converter" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free PNG to <em>SVG Converter</em> Online
            </>
          }
          tagline="A free PNG to SVG converter: vectorize logos and icons into clean, scalable SVGs — best for simple graphics, not photos."
        />

        <PngToSvgClient />
        <PrivacyNote>
          Tracing runs 100% in your browser with the potrace engine. Your image is never uploaded, stored, or seen by anyone but you.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>trace</em></>}
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
              d: "PNG files up to 25 MB. Oversized images are downscaled to a 3000px longest edge before tracing — vectors scale up perfectly anyway.",
            },
            {
              t: "Output",
              d: "A real, editable SVG file: one flat trace color on a transparent (or white) background, with smooth bezier curves.",
            },
            {
              t: "Single color, honestly",
              d: "This is single-color tracing. Bold logos, stamps, icons and QR-style graphics trace beautifully; gradients and photos don't.",
            },
            {
              t: "Tunable",
              d: "Auto or manual black/white threshold, a speck filter for noise, and your choice of trace color and background.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to a <em>vector</em></>} />
        <Steps
          steps={[
            {
              title: "Drop in your PNG",
              text: "Choose a PNG logo, icon or line-art file up to 25 MB. It never leaves your browser.",
            },
            {
              title: "Tune the trace",
              text: "Keep the auto threshold (or go manual), set the speck filter, and pick a trace color and background.",
            },
            {
              title: "Trace & download",
              text: "Preview the vector, then download the .svg — sharp at favicon size and billboard size alike.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When a vector <em>wins</em></>}
          sub="Pixels blur. Vectors don't."
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
              t: "Logo files for print",
              d: "A client sent their logo as a PNG? Trace it to SVG and hand the printer a file that works at business-card and banner size.",
            },
            {
              t: "Crisp website icons",
              d: "Favicons and UI icons as SVG stay razor-sharp on retina screens and weigh almost nothing.",
            },
            {
              t: "Cutting & engraving",
              d: "Laser cutters, vinyl cutters and CNC machines want vector paths. A traced single-color SVG is exactly the right starting file.",
            },
            {
              t: "Stamps & stencils",
              d: "One-color traced graphics are perfect for rubber stamps, screen printing and spray-paint stencils.",
            },
            {
              t: "Editable artwork",
              d: "Open the SVG in Figma, Illustrator or Inkscape and tweak the paths — try doing that with a PNG.",
            },
            {
              t: "Private by default",
              d: "Unreleased brand work traced locally never touches a server — no uploading client logos to a stranger's converter.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>PNG to SVG <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["svg-to-png-converter", "png-to-jpg-converter", "image-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
