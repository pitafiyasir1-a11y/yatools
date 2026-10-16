import BmiCalculatorClient from "./ToolClient";
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

const tool = toolBySlug("bmi-calculator")!;

export const metadata = pageMeta({
  title: "BMI Calculator - Check Your Body Mass Index Free Online",
  description:
    "Free BMI calculator: enter height and weight (metric or imperial) for your Body Mass Index instantly, with color-coded category — underweight, normal, overweight or obese. No sign-up.",
  path: "/tools/bmi-calculator",
  keywords: [
    "bmi calculator",
    "body mass index",
    "bmi chart",
    "calculate bmi",
    "ideal weight",
  ],
});

const faqs = [
  {
    q: "How is BMI calculated?",
    a: "BMI = weight (kg) ÷ height (m)². In imperial units it's 703 × weight (lbs) ÷ height (in)². Enter your numbers and the result appears instantly — no math needed.",
  },
  {
    q: "What is a healthy BMI?",
    a: "The World Health Organization defines 18.5–24.9 as the healthy range for adults. Below 18.5 is underweight, 25–29.9 is overweight, and 30+ is obese. These cutoffs apply to most adults regardless of age.",
  },
  {
    q: "Is BMI accurate for athletes or muscular people?",
    a: "Not always — BMI can't tell muscle from fat, so very muscular people can score as 'overweight' while being perfectly healthy. It's a screening tool, not a diagnosis. Body-fat percentage or waist measurements give a fuller picture.",
  },
  {
    q: "Does BMI work for children?",
    a: "Children's BMI is interpreted differently — against age- and sex-specific growth charts, not the adult cutoffs. This calculator uses adult categories; for kids, check with a pediatrician.",
  },
  {
    q: "Is my data private?",
    a: "Yes. The calculation runs entirely in your browser — your height and weight are never uploaded, stored, or sent anywhere.",
  },
];

export default function BmiCalculatorPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "BMI Calculator", path: "/tools/bmi-calculator" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "BMI Calculator" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free <em>BMI</em> Calculator
            </>
          }
          tagline="Enter height and weight for your Body Mass Index instantly — with a color-coded category and visual scale."
        />

        <BmiCalculatorClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your measurements are never uploaded, stored, or
          sent anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>BMI</em> calculator</>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            Body Mass Index (BMI) is the standard quick check relating weight to height: weight in
            kilograms divided by height in meters squared. It sorts adults into four WHO categories
            — underweight, normal, overweight, obese — used worldwide by doctors, insurers, and
            fitness programs as a first screening step.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            This free calculator works in metric (cm/kg) or imperial (ft/in/lbs), shows your number
            instantly with a color-coded category, and plots it on a visual scale so you can see
            exactly where you land. Remember it's a screening measure: muscle mass, bone density,
            and body composition aren't captured, so treat it as a starting point, not a verdict.
          </p>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your BMI</em></>} />
        <Steps
          steps={[
            {
              title: "Pick your units",
              text: "Metric (cm/kg) or imperial (ft/in/lbs) — switch anytime, the result converts instantly.",
            },
            {
              title: "Enter height & weight",
              text: "Type your numbers. The BMI, category, and scale position update live as you type.",
            },
            {
              title: "Read your result",
              text: "See your number color-coded by WHO category, plotted on the 15–40 scale bar.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>BMI <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["age-calculator", "percentage-calculator", "unit-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
