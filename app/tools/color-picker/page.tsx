import ColorPickerClient from "./ToolClient";
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

const tool = toolBySlug("color-picker")!;

export const metadata = pageMeta({
  title: "Color Picker & Converter — HEX, RGB, HSL",
  description:
    "Pick any color and copy its HEX, RGB, and HSL values instantly. Curated palettes, tints & shades. Free, runs entirely in your browser.",
  path: "/tools/color-picker",
  keywords: [
    "color picker hex",
    "hex to rgb",
    "rgb to hsl",
    "color palette generator",
    "html color codes",
  ],
});

const faqs = [
  {
    q: "How do I copy a color code?",
    a: "Pick a color with the visual picker or type a hex code, then hit Copy next to the HEX, RGB, or HSL value. The exact string (e.g. rgb(224, 38, 60)) lands on your clipboard, ready to paste into CSS.",
  },
  {
    q: "What hex formats are accepted?",
    a: "Both 6-digit (#e0263c) and 3-digit shorthand (#e24, which expands to #ee2244), with or without the leading #. Anything else shows a friendly error instead of guessing.",
  },
  {
    q: "How are tints and shades generated?",
    a: "Tints mix your color toward white and shades toward black in four even steps (20%, 40%, 60%, 80%). Click any swatch to make it the active color and build a full scale from it.",
  },
  {
    q: "What does the “readable text” hint mean?",
    a: "It computes the color's relative luminance and tells you whether near-black or white text stays legible on top of it — the same contrast logic behind WCAG accessibility guidelines. Aim for strong contrast for body text.",
  },
  {
    q: "Is my color history stored anywhere?",
    a: "No. The picker runs entirely in your browser with no uploads, no cookies, and no history tracking. Your brand colors stay yours.",
  },
];

export default function ColorPickerPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/color-picker" },
          { name: "Color Picker", path: "/tools/color-picker" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Color Picker" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Color <em>Picker</em>
            </>
          }
          tagline="Pick any color, copy its HEX, RGB, and HSL codes instantly — plus tints, shades, and curated palettes."
        />

        <ColorPickerClient />
        <PrivacyNote>
          Everything runs 100% in your browser — colors you pick are never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>the right color</em></>} />
        <Steps
          steps={[
            {
              title: "Pick or type",
              text: "Use the visual color picker for exploration, or type an exact hex code when you already know it.",
            },
            {
              title: "Copy the code",
              text: "Grab the HEX, RGB, or HSL value with one click — formatted and ready to paste into CSS or design tools.",
            },
            {
              title: "Build a scale",
              text: "Click any tint or shade to make it active, or start from a curated palette to get a harmonious set in seconds.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>Color formats <em>explained</em></>}
          sub="Three ways to write the same color — and when each one wins."
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
              t: "HEX — #E0263C",
              d: "The web's shorthand: 6 hex digits for red, green, blue. Compact and universal in CSS. 3-digit shorthand (#E24) expands by doubling each digit.",
            },
            {
              t: "RGB — rgb(224, 38, 60)",
              d: "Red, green, blue as 0–255 numbers. Easiest to tweak programmatically and the format canvas, WebGL, and most APIs expect.",
            },
            {
              t: "HSL — hsl(353, 74%, 51%)",
              d: "Hue, saturation, lightness — the human-friendly one. Nudge the hue to find neighbors, drop saturation for muted tones, raise lightness for pastels.",
            },
            {
              t: "Contrast matters",
              d: "A beautiful color that nobody can read is a bug. The readable-text hint uses relative luminance — keep body text at strong contrast, especially on colored buttons.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Examples" title={<>From brand color to <em>full scale</em></>} />
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
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>brand.css</span>
            </div>
            <pre>{`:root {
  --brand: #e0263c;          /* HEX */
  --brand-rgb: 224, 38, 60;  /* RGB */
  --brand-hsl: 353 74% 51%;  /* HSL */
}`}</pre>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>hover-state.txt</span>
            </div>
            <pre>{`Button: #e0263c (base)
Hover:  mix 20% toward black
        → #b31e30 (a “shade”)

Generate the shade above with
one click — no guessing.`}</pre>
          </div>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Color <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["ai-image-generator", "qr-code", "website-screenshot"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
