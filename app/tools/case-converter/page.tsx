import CaseConverterClient from "./ToolClient";
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

const tool = toolBySlug("case-converter")!;

function softwareAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Case Converter — YATools",
    url: `${SITE.url}/tools/case-converter`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Convert text between cases free online — UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more. Instant, private. Try it free now!",
  };
}

export const metadata = pageMeta({
  title: "Free Case Converter - Uppercase, Lowercase & More Online",
  description:
    "Convert text between cases free online — UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more. Instant, private. Try it free now!",
  path: "/tools/case-converter",
  keywords: [
    "case converter",
    "text case converter",
    "change case",
    "uppercase converter",
    "lowercase converter",
  ],
});

const faqs = [
  {
    q: "Which cases are supported?",
    a: "Nine: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and aLtErNaTiNg. Pick a chip and the result updates live as you type.",
  },
  {
    q: "How does Title Case handle small words?",
    a: "This converter capitalizes the first letter of every word (AP-style exceptions like “and”/“the” are not applied). For headlines that need strict style-guide casing, review the result once — it takes seconds.",
  },
  {
    q: "What's the difference between camelCase and PascalCase?",
    a: "Both smash words together with each word capitalized, except the first: camelCase starts lowercase (used for JavaScript variables and functions), PascalCase starts uppercase (used for classes and components).",
  },
  {
    q: "When would I use snake_case or kebab-case?",
    a: "snake_case is the convention for Python variables, database columns, and file names. kebab-case is standard for URLs, CSS classes, and HTML attributes. Converting by hand is error-prone — paste and convert instead.",
  },
  {
    q: "Is my text private?",
    a: "Yes. Conversion runs entirely in your browser — nothing is uploaded or stored, so proprietary code and unpublished drafts stay on your device.",
  },
  {
    q: "How do I convert text to uppercase online?",
    a: "Paste your text, hit the UPPERCASE button, and copy the result — the whole block converts instantly with no sign-up.",
  },
  {
    q: "Can I convert variable names to snake_case or kebab-case?",
    a: "Yes. Paste identifiers like myVariableName and convert to snake_case for Python or kebab-case for CSS classes and URLs — the converter handles the word boundaries for you.",
  },

];

export default function CaseConverterPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/case-converter" },
          { name: "Case Converter", path: "/tools/case-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Case Converter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Case <em>Converter</em> Online
            </>
          }
          tagline="A free case converter: switch text between UPPERCASE, lowercase, Title Case, camelCase, and more — instantly, privately."
        />

        <CaseConverterClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your text is never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>
        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>Case Converter</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A case converter switches your text between naming and formatting styles in one click. Paste any text into this free online tool and convert it to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, or CONSTANT_CASE. Writers fix shouty headlines, developers rename variables to match a codebase convention, SEO editors normalize title tags, and data cleaners standardize spreadsheet columns — all without retyping a word.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Title Case follows proper headline rules, keeping small words like and and the lowercase unless they lead the title. The programming cases each have a home: camelCase for JavaScript variables, PascalCase for class names, snake_case for Python and databases, kebab-case for URLs and CSS classes. Conversion is instant and runs entirely in your browser, so drafts, code, and client copy never leave your device.
          </p>
        </div>


        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>perfect casing</em></>} />
        <Steps
          steps={[
            {
              title: "Paste your text",
              text: "A headline, a variable name, a paragraph — any text works. No sign-up, no upload.",
            },
            {
              title: "Pick a case",
              text: "Tap one of the nine case chips. The output updates live as you type or edit.",
            },
            {
              title: "Copy the result",
              text: "One click copies the converted text to your clipboard, ready to paste into code, docs, or designs.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Good to know"
          title={<>When to use <em>each case</em></>}
          sub="The right casing in the right place — a quick cheat sheet."
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
              t: "Code & identifiers",
              d: "camelCase for JavaScript variables, PascalCase for classes and React components, snake_case for Python and database fields, kebab-case for CSS classes and URL slugs.",
            },
            {
              t: "Writing & headlines",
              d: "Title Case for headings and titles, Sentence case for body copy and UI labels, UPPERCASE sparingly — for warnings or short labels, never paragraphs.",
            },
            {
              t: "Data cleanup",
              d: "Normalizing messy spreadsheet exports? Convert a whole column to consistent casing in seconds instead of retyping — then verify edge cases like acronyms.",
            },
            {
              t: "Watch the edge cases",
              d: "Acronyms (NASA → Nasa in Title Case) and apostrophes need a glance after conversion. The tool is deterministic, so one review pass catches everything.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Examples" title={<>Before → <em>after</em></>} />
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
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>dev-rename.txt</span>
            </div>
            <pre>{`user profile data  →  userProfileData
  (camelCase for a JS variable)

user profile data  →  user_profile_data
  (snake_case for a DB column)`}</pre>
          </div>
          <div className="code-window">
            <div className="code-bar">
              <span className="code-dot" style={{ background: "#ff5f57" }} />
              <span className="code-dot" style={{ background: "#febc2e" }} />
              <span className="code-dot" style={{ background: "#28c840" }} />
              <span style={{ marginLeft: 8, color: "#8a887f", fontSize: "0.72rem" }}>headline.txt</span>
            </div>
            <pre>{`the quick brown fox  →  The Quick Brown Fox
  (Title Case for a headline)

THE QUICK BROWN FOX  →  The quick brown fox
  (Sentence case for body copy)`}</pre>
          </div>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Case converter <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["word-counter", "text-to-pdf", "json-formatter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
