import EmiCalculatorClient from "./ToolClient";
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

const tool = toolBySlug("emi-calculator")!;

export const metadata = pageMeta({
  title: "EMI Calculator - Monthly Loan Payment in Any Currency",
  description:
    "EMI calculator: work out your monthly loan payment, total interest, and total payable from loan amount, interest rate, and tenure. Any currency — USD, PKR, INR, EUR, GBP and more. Free, in-browser.",
  path: "/tools/emi-calculator",
  keywords: [
    "emi calculator",
    "emi calculator online",
    "loan emi calculator",
    "emi calculator pkr",
    "home loan emi calculator",
    "car loan emi calculator",
  ],
});

const faqs = [
  {
    q: "What is EMI?",
    a: "EMI is the fixed monthly payment on a loan — Equated Monthly Instalment. It covers part of the principal plus that month's interest. You pay the same amount every month until the loan is done.",
  },
  {
    q: "How is EMI calculated?",
    a: "With the reducing-balance formula: EMI = P × r × (1+r)^n ÷ ((1+r)^n − 1), where P is the loan amount, r is the monthly interest rate, and n is the number of months. This calculator uses exactly that formula.",
  },
  {
    q: "Which currencies can I use?",
    a: "USD, PKR, INR, EUR, GBP, AED, SAR, CAD, AUD, JPY, CNY and 30 more. Pick your currency and every amount — EMI, interest, totals — is shown in it.",
  },
  {
    q: "Why is most of my early EMI interest?",
    a: "Interest is charged on the balance you still owe, which is highest at the start. As the balance shrinks, the interest share falls and the principal share grows. The year-by-year table shows this clearly.",
  },
  {
    q: "Does a longer tenure mean a lower EMI?",
    a: "Yes — but you pay much more interest overall. A 20-year loan has a smaller monthly EMI than a 10-year loan for the same amount, yet the total interest can nearly double. Compare both before choosing.",
  },
  {
    q: "Is this a bank quote?",
    a: "No. This is an estimate using the standard formula. Banks add processing fees, insurance, and their own rounding, and rates vary by borrower. Always confirm the final figures with your bank.",
  },
];

export default function EmiCalculatorPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "EMI Calculator", path: "/tools/emi-calculator" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "EMI Calculator" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free <em>EMI Calculator</em> — Any Currency
            </>
          }
          tagline="Work out your monthly loan payment, total interest, and year-by-year breakdown — in USD, PKR, INR, EUR, or 35+ other currencies."
        />

        <EmiCalculatorClient />
        <PrivacyNote>
          Everything runs 100% in your browser — your loan figures are never uploaded, stored, or
          sent anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>EMI calculator</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            Before you take a loan — home, car, or personal — you need one number: the monthly EMI.
            This free EMI calculator works it out from the loan amount, annual interest rate, and
            tenure, in any of 40+ currencies. It also shows the total interest you&apos;ll pay and a
            year-by-year breakdown, so you can see how much of each early payment is interest and
            how the balance actually falls.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The number that matters most is the total interest, not the EMI. Stretching a loan to
            20 years instead of 10 shrinks the monthly payment but can nearly double what you pay
            the bank. Try both tenures here before you sign — and remember this is an estimate:
            banks add fees and use their own rounding, so confirm the final figures with your
            lender.
          </p>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your EMI</em></>} />
        <Steps
          steps={[
            {
              title: "Enter the loan",
              text: "Loan amount, annual interest rate, and tenure in years or months — pick your currency first.",
            },
            {
              title: "Read your EMI",
              text: "See the monthly payment, total interest, and total payable — updated live as you type.",
            },
            {
              title: "Compare tenures",
              text: "Try 10 vs 20 years in the table and see how the total interest changes before you commit.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>EMI <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["percentage-calculator", "unit-converter", "bmi-calculator"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
