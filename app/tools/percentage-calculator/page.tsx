import PercentageCalculatorClient from "./ToolClient";
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

const tool = toolBySlug("percentage-calculator")!;

export const metadata = pageMeta({
  title: "Percentage Calculator - X% of Y, Percent Change Free Online",
  description:
    "Free percentage calculator: find X% of Y, what percent one number is of another, and percent increase or decrease. Instant answers, no sign-up, works in your browser.",
  path: "/tools/percentage-calculator",
  keywords: [
    "percentage calculator",
    "percent of",
    "percent increase calculator",
    "percent decrease",
    "what percent",
  ],
});

const faqs = [
  {
    q: "How do I calculate X percent of Y?",
    a: "Divide the percentage by 100, then multiply by Y. Example: 20% of 150 = (20 ÷ 100) × 150 = 30. Use the first mode on this calculator and it does the math instantly.",
  },
  {
    q: "How do I find what percent X is of Y?",
    a: "Divide X by Y and multiply by 100. Example: 30 is what percent of 150? (30 ÷ 150) × 100 = 20%. The second mode here handles it.",
  },
  {
    q: "How is percent increase or decrease calculated?",
    a: "Subtract the original from the new value, divide by the original, and multiply by 100. Going from 120 to 150 is ((150 − 120) ÷ 120) × 100 = 25% increase. A negative result means a decrease.",
  },
  {
    q: "What's the difference between percent and percentage points?",
    a: "A classic mix-up: if a rate rises from 10% to 15%, that's a 5 percentage-point rise but a 50% increase (5 ÷ 10 × 100). This calculator shows percent change, which is the relative figure.",
  },
  {
    q: "Is my data private?",
    a: "Yes. All calculations run entirely in your browser — your numbers are never uploaded, stored, or sent anywhere.",
  },
];

export default function PercentageCalculatorPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Percentage Calculator", path: "/tools/percentage-calculator" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Percentage Calculator" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free <em>Percentage</em> Calculator
            </>
          }
          tagline="Three calculators in one: X% of Y, X is what percent of Y, and percent increase or decrease — instant answers."
        />

        <PercentageCalculatorClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your numbers are never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>percentage</em> calculator</>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            Percentages show up everywhere — discounts, tips, taxes, grades, salary raises, and
            business growth. This free calculator bundles the three questions people actually ask:
            what is X% of Y (discounts and tips), X is what percent of Y (grades and shares), and
            the percent change between two numbers (growth, inflation, price drops).
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Switch modes with one tap; answers update live as you type. The increase/decrease mode
            color-codes results — green for growth, red for drops — so the direction is obvious at
            a glance. Like every YATools utility, it runs entirely in your browser with nothing
            uploaded.
          </p>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your answer</em></>} />
        <Steps
          steps={[
            {
              title: "Pick a mode",
              text: "X% of Y, X is what % of Y, or percent increase/decrease — one tap to switch.",
            },
            {
              title: "Enter two numbers",
              text: "Type both values. The answer computes live — no button to press.",
            },
            {
              title: "Read the answer",
              text: "See the result with a plain-English explanation, e.g. “120 → 150 is a 25% increase”.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Percentage <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["unit-converter", "age-calculator", "bmi-calculator"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
