import GrammarCheckerClient from "./ToolClient";
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

const tool = toolBySlug("grammar-checker")!;

export const metadata = pageMeta({
  title: "Grammar Checker Free, No Sign-Up - Check Grammar & Spelling Online",
  description:
    "Grammar checker free, no sign-up: paste your text and get grammar and spelling suggestions with one-click fixes. Free, no account. Checking uses LanguageTool's free public API.",
  path: "/tools/grammar-checker",
  keywords: [
    "grammar checker free no sign up",
    "grammar checker free online",
    "grammar checker free",
    "free grammar checker no sign up",
    "check grammar online free",
    "spelling checker free",
    "grammar check free",
  ],
});

const faqs = [
  {
    q: "Is this grammar checker really free?",
    a: "Yes. Checking uses LanguageTool's free public API — no account, no key, no payment. Paste up to 10,000 characters and get grammar and spelling suggestions with one-click fixes.",
  },
  {
    q: "Is my text private?",
    a: "Your text is sent to LanguageTool's free API for checking — that is how the checking works — and YATools does not store it. Don't paste passwords, private documents, or anything you wouldn't share with a third-party checker.",
  },
  {
    q: "Why is there a 10,000 character limit?",
    a: "The free LanguageTool API accepts up to 10,000 characters per check. For longer texts, split them into parts and check one part at a time.",
  },
  {
    q: "Are the suggestions always right?",
    a: "No — suggestions are advisory. LanguageTool catches most grammar and spelling mistakes, but it can misread names, technical terms, and deliberate style choices. Read each suggestion before applying it.",
  },
  {
    q: "Does it check spelling too?",
    a: "Yes. The checker flags spelling mistakes alongside grammar issues — both appear in the same list with suggested replacements you can apply with one click.",
  },
  {
    q: "What if the checker is busy or fails?",
    a: "The free API has fair-use rate limits and can be briefly busy at peak times. If a check fails, wait a moment and try again — your text stays in the box.",
  },
];

export default function GrammarCheckerPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Grammar Checker", path: "/tools/grammar-checker" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Grammar Checker" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free <em>Grammar Checker</em> Online
            </>
          }
          tagline="Paste your text and get grammar and spelling suggestions with one-click fixes — free, no sign-up."
        />

        <GrammarCheckerClient />
        <PrivacyNote>
          Checking uses LanguageTool&apos;s free public API: your text is sent to LanguageTool for
          checking and is not stored by YATools. Don&apos;t paste passwords or private documents.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>grammar checker</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            A grammar checker catches the mistakes your eyes skip: subject-verb agreement, wrong
            articles, doubled words, and typos that spellcheckers miss because the word itself is
            spelled correctly. Paste an essay, email, cover letter, or blog draft and this free tool
            lists each issue with the sentence shown, the mistake highlighted, and one-click
            replacements — or apply all fixes at once.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The checking itself is powered by LanguageTool&apos;s free public API, the same engine
            behind many well-known checkers. That keeps it free with no account, with honest limits:
            10,000 characters per check and fair-use rate limits. One habit that helps more than any
            tool: read your text aloud before sending it — your ears catch what your eyes miss.
          </p>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>clean text</em></>} />
        <Steps
          steps={[
            {
              title: "Paste your text",
              text: "Drop in an essay, email, or draft — up to 10,000 characters. Pick US or UK English.",
            },
            {
              title: "Check grammar",
              text: "Press “Check grammar”. Each issue shows with the mistake highlighted and suggested fixes.",
            },
            {
              title: "Apply fixes",
              text: "Click a suggestion to fix one issue, or “Apply all fixes” to take every first suggestion at once.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Grammar <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["word-counter", "case-converter", "text-to-pdf"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
