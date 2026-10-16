import AgeCalculatorClient from "./ToolClient";
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

const tool = toolBySlug("age-calculator")!;

export const metadata = pageMeta({
  title: "Age Calculator - Calculate Exact Age in Years, Months & Days Free",
  description:
    "Free age calculator: enter your birthdate for your exact age in years, months and days — plus total days lived, next birthday countdown & day of week born. No sign-up.",
  path: "/tools/age-calculator",
  keywords: [
    "age calculator",
    "calculate age",
    "how old am i",
    "birthday calculator",
    "age in days",
  ],
});

const faqs = [
  {
    q: "How is exact age calculated?",
    a: "The calculator compares your birthdate with today's date: full years first, then remaining months, then remaining days — borrowing days from the previous month when needed, exactly like counting on a calendar.",
  },
  {
    q: "Does it account for leap years?",
    a: "Yes. Total days are computed from the actual millisecond difference between the two dates, so leap years (including Feb 29 birthdays) are handled automatically.",
  },
  {
    q: "What does 'day of week born' mean?",
    a: "It's the weekday your birthdate fell on — e.g. if you were born on a Tuesday, it shows Tuesday. Fun for birthday trivia and throwback posts.",
  },
  {
    q: "How does the birthday countdown work?",
    a: "It finds your next birthday (this year if it hasn't happened yet, otherwise next year) and counts the days remaining. If today is your birthday, it celebrates with you.",
  },
  {
    q: "Is my birthdate private?",
    a: "Yes. The calculation runs entirely in your browser — your birthdate is never uploaded, stored, or sent anywhere.",
  },
];

export default function AgeCalculatorPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Age Calculator", path: "/tools/age-calculator" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Age Calculator" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free <em>Age</em> Calculator
            </>
          }
          tagline="Enter your birthdate for your exact age in years, months, and days — plus total time lived and your next birthday countdown."
        />

        <AgeCalculatorClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your birthdate is never uploaded, stored, or sent
          anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>age</em> calculator</>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            An age calculator answers the simple question “how old am I, exactly?” — not just in
            years but down to months and days. Enter your date of birth and instantly see your
            precise age, the total days, weeks, and hours you've lived, which weekday you were born
            on, and a live countdown to your next birthday.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            Beyond curiosity, exact age matters for forms, eligibility checks, insurance quotes, and
            school admissions that ask for age in years and months. The calculation handles leap
            years automatically, so Feb 29 birthdays come out right. Everything runs locally in
            your browser — your birthdate never leaves your device.
          </p>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your age</em></>} />
        <Steps
          steps={[
            {
              title: "Enter your birthdate",
              text: "Pick the date from the calendar picker. Nothing is uploaded — it stays on your device.",
            },
            {
              title: "See your exact age",
              text: "Years, months, and days computed calendar-accurately, plus total days, weeks, and hours lived.",
            },
            {
              title: "Check the extras",
              text: "Find which weekday you were born on and count down the days to your next birthday.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Age calculator <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["bmi-calculator", "percentage-calculator", "unit-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
