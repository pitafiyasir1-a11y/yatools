import UnitConverterClient from "./ToolClient";
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

const tool = toolBySlug("unit-converter")!;

export const metadata = pageMeta({
  title: "Free Unit Converter — Length, Weight & Data Units",
  description:
    "Instant unit converter: length, weight, temperature, and 1024-based data sizes. Type a value, see every conversion at once. Free and private.",
  path: "/tools/unit-converter",
  keywords: [
    "unit converter online",
    "length converter mm cm km",
    "celsius fahrenheit kelvin converter",
    "weight converter kg to lb",
    "gb to mb converter",
  ],
});

const faqs = [
  {
    q: "Which unit categories are supported?",
    a: "Four: Length (mm, cm, m, km, inches, feet, yards, miles), Weight (mg, g, kg, oz, lb), Temperature (°C, °F, K), and Data (B, KB, MB, GB, TB). Type one value and pick the input unit — every other unit in that category converts instantly.",
  },
  {
    q: "Are temperature conversions accurate?",
    a: "Yes. Temperature uses the proper formulas — °F = °C × 9/5 + 32 and K = °C + 273.15 — not simple multipliers like the other categories. If your input lands below absolute zero (−273.15 °C), the tool flags it as impossible.",
  },
  {
    q: "Is 1 KB 1000 or 1024 bytes here?",
    a: "1024 — the convention operating systems use when reporting file and disk sizes. So 1 GB = 1024 MB here. Storage manufacturers sometimes advertise 1 GB as 1,000 MB, which is why a “1 TB” drive shows up smaller in your OS.",
  },
  {
    q: "Can I switch the input unit without retyping?",
    a: "Yes. Every result card is a button — tap the unit you want and it becomes the new input, keeping the same numeric value.",
  },
  {
    q: "Is my data private?",
    a: "Completely. Conversions run in your browser with plain JavaScript — nothing is typed into a server, stored, or tracked.",
  },
];

export default function UnitConverterPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/unit-converter" },
          { name: "Unit Converter", path: "/tools/unit-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Unit Converter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Unit <em>Converter</em>
            </>
          }
          tagline="Length, weight, temperature, and data sizes — type a number once and see every conversion in the category, instantly."
        />

        <UnitConverterClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your numbers are never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>any conversion</em></>} />
        <Steps
          steps={[
            {
              title: "Pick a category",
              text: "Length, Weight, Temperature, or Data — tap the tab for the kind of conversion you need.",
            },
            {
              title: "Enter a value and unit",
              text: "Type the number and choose what it's in — say, 5 miles, 72 °F, or 2.5 GB. Results update as you type.",
            },
            {
              title: "Read every result",
              text: "The whole category converts at once — no second step. Tap any card to flip that unit into the input.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>Conversions <em>done right</em></>}
          sub="The details other converters get wrong."
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
              t: "Temperature needs formulas",
              d: "Length and weight convert with a single multiplication factor. Temperature doesn't: converting °F to °C needs an offset as well as a scale ((°F − 32) × 5/9). This tool uses the real formulas, and warns you about values below absolute zero.",
            },
            {
              t: "1024 vs 1000 for data",
              d: "We use 1024-based units (1 KB = 1024 B) because that's what your OS reports. If a “1 TB” drive shows 931 GB on your computer, that's the same bytes measured two ways — 1,000,000,000,000 ÷ 1024⁴ ≈ 931 GB.",
            },
            {
              t: "Pounds, ounces, and stones",
              d: "Weight uses the international avoirdupois definitions: 1 lb = 453.59237 g and 1 oz = 28.349523125 g exactly. If you need stones (1 st = 14 lb), convert lb first and divide by 14.",
            },
            {
              t: "Precision without noise",
              d: "Results are rounded to 10 significant digits, so you see 2.54 cm for an inch — not 2.5399999999. Good enough for real work, clean enough to copy-paste.",
            },
          ].map((c) => (
            <div key={c.t} className="neu-card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Examples" title={<>Typical <em>use cases</em></>} />
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
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>recipe.txt</span>
            </div>
            <pre>{`US recipe: bake at 350 °F.
Enter 350, unit °F → 176.7 °C.
Your oven dial says 180 °C.
Close enough — dinner is saved.`}</pre>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>video-upload.txt</span>
            </div>
            <pre>{`Raw footage: 47.3 GB.
Enter 47.3, unit GB → 48,435 MB.
Upload quota is 50 GB? You're
2.7 GB under. Go live.`}</pre>
          </div>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Unit converter <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["word-counter", "case-converter", "json-formatter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
