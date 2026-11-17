import RegexTesterClient from "./ToolClient";
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

const tool = toolBySlug("regex-tester")!;

export const metadata = pageMeta({
  title: "Regex Tester Online Free - Test Regular Expressions Live",
  description:
    "Regex tester online free: test regular expressions against sample text with live match highlighting, match count, and capture-group display. 100% in-browser, private.",
  path: "/tools/regex-tester",
  keywords: [
    "regex tester online free",
    "regex tester online",
    "regular expression tester",
    "test regex online",
    "javascript regex tester",
    "regex tester free",
  ],
});

const faqs = [
  {
    q: "How do I test a regular expression?",
    a: "Type your pattern in the top box, pick flags (g for all matches, i to ignore case), and paste test text below. Matches highlight live as you type, with the count and capture groups listed underneath.",
  },
  {
    q: "Which regex flavor is this?",
    a: "JavaScript — the same engine your browser and Node.js use. Patterns that work here work in JavaScript code. Python, Java, and PCRE differ slightly (for example, JavaScript has no lookbehind in older engines, and named groups use (?<name>...)).",
  },
  {
    q: "What do the flags do?",
    a: "g finds every match instead of just the first; i ignores case; m makes ^ and $ match at line starts and ends; s lets . match newlines; u enables full Unicode mode; y (sticky) matches only from the last match position.",
  },
  {
    q: "Why does my pattern show “Invalid pattern”?",
    a: "The pattern has a syntax error — an unclosed bracket or parenthesis, a stray backslash, or a bad quantifier. The error message names the problem; fix that spot and the highlights return.",
  },
  {
    q: "How are capture groups shown?",
    a: "Parentheses in your pattern create groups. Each match lists its groups as $1, $2, and so on, in order. Named groups (?<name>...) appear in the same list by position.",
  },
  {
    q: "Is my pattern or test text uploaded?",
    a: "No. Testing runs entirely in your browser with the built-in JavaScript regex engine. Your patterns and test data never leave your device.",
  },
];

export default function RegexTesterPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Regex Tester", path: "/tools/regex-tester" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Regex Tester" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free <em>Regex Tester</em> Online
            </>
          }
          tagline="Test regular expressions live: matches highlight as you type, with counts and capture groups — free, no sign-up."
        />

        <RegexTesterClient />
        <PrivacyNote>
          Testing runs 100% in your browser with the built-in JavaScript regex engine — your
          patterns and test text are never uploaded, stored, or sent anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>regex tester</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            Regular expressions are powerful and unforgiving: one misplaced bracket and nothing
            matches. This free regex tester shows you exactly what your pattern does, live, as you
            type it — matches highlighted in the text, a count, and every capture group listed with
            its position. It starts with an email pattern loaded, so you can see the format before
            writing your own.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Common uses: validating emails and phone numbers, pulling dates or IDs out of logs,
            finding and replacing text in bulk, and checking form-validation patterns before they
            ship. Remember the flavor is JavaScript — the same engine Node.js uses — so a pattern
            that works here works in your frontend and backend JavaScript code.
          </p>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your match</em></>} />
        <Steps
          steps={[
            {
              title: "Type your pattern",
              text: "Enter the regex in the top box. Syntax errors are reported immediately with the reason.",
            },
            {
              title: "Pick flags",
              text: "g for all matches, i to ignore case, m for multiline — toggle the ones your pattern needs.",
            },
            {
              title: "Read the highlights",
              text: "Matches light up in the test text, with a count and every capture group listed below.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Regex <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["json-formatter", "base64-encoder-decoder", "url-encoder-decoder"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
