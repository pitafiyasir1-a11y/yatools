import InvoiceGeneratorClient from "./ToolClient";
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

const tool = toolBySlug("invoice-generator")!;

export const metadata = pageMeta({
  title: "Invoice Generator Free No Sign Up - Make Invoices in Any Currency",
  description:
    "Invoice generator free, no sign-up: add line items and tax, pick any currency (USD, PKR, INR, EUR, GBP and more), and download a professional invoice as PDF. 100% in-browser.",
  path: "/tools/invoice-generator",
  keywords: [
    "invoice generator free no sign up",
    "invoice generator free",
    "free invoice maker",
    "make invoice online free",
    "invoice generator pkr",
    "invoice template free",
  ],
});

const faqs = [
  {
    q: "Is this invoice generator really free with no sign-up?",
    a: "Yes. No account, no trial, no watermark. Fill in your details, pick a currency, and download the invoice as a PDF through your browser's print dialog.",
  },
  {
    q: "Which currencies can I use?",
    a: "USD, EUR, GBP, PKR, INR, AED, SAR, CAD, AUD, JPY, CNY and 30 more. Amounts are formatted in the currency you pick, so the same invoice works for a client in Lahore, London, or New York.",
  },
  {
    q: "How do I download the invoice as a PDF?",
    a: "Press “Download as PDF”. Your browser's print dialog opens — choose “Save as PDF” as the destination. Only the invoice itself prints, not the rest of the page.",
  },
  {
    q: "Does it calculate tax?",
    a: "Yes. Enter a tax percentage and it is applied to the subtotal automatically. Leave it at 0 if your work is not taxed — freelancers in many countries charge no tax on services.",
  },
  {
    q: "How many line items can I add?",
    a: "Up to 8. Each item has a description, quantity, and rate; the amount is qty × rate and the totals update live as you type.",
  },
  {
    q: "Is my business and client data private?",
    a: "Yes. The generator runs entirely in your browser. Business names, client emails, and amounts are never uploaded, stored, or sent anywhere.",
  },
];

export default function InvoiceGeneratorPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Invoice Generator", path: "/tools/invoice-generator" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Invoice Generator" }]} />
        <ToolHero
          slug={tool.slug}
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free <em>Invoice Generator</em> — Any Currency
            </>
          }
          tagline="Create a professional invoice in minutes: your details, your client, line items, tax, and any currency — then download it as a PDF."
        />

        <InvoiceGeneratorClient />
        <PrivacyNote>
          Everything runs 100% in your browser — business and client details are never uploaded,
          stored, or sent anywhere.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="About this tool" title={<>About the <em>invoice generator</em></>} />
        <div style={{ maxWidth: 780 }}>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75, marginBottom: 14 }}>
            Freelancers and small businesses lose time — and money — to messy invoices. This free
            invoice generator keeps it simple: who you are, who you&apos;re billing, what the work
            was, and what it costs. Totals update live as you type, tax is one field, and the
            currency dropdown covers USD, PKR, INR, EUR, GBP, AED, SAR and 30 more, so the same
            tool works whether your client pays in rupees, dollars, or dirhams.
          </p>
          <p style={{ color: "var(--text2)", fontSize: "0.95rem", lineHeight: 1.75 }}>
            The download uses your browser&apos;s print-to-PDF, so the invoice looks the same on
            every device and prints cleanly on A4 or Letter. A clear invoice gets paid faster: put
            the invoice number and due date on every one, and keep the notes line for payment
            terms — “Payment due within 14 days” beats chasing a client later.
          </p>
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>your invoice</em></>} />
        <Steps
          steps={[
            {
              title: "Fill in the details",
              text: "Your business, your client, invoice number and dates, then line items with quantity and rate.",
            },
            {
              title: "Pick a currency and tax",
              text: "Choose from 40+ currencies and set a tax percentage if one applies. Totals update live.",
            },
            {
              title: "Download as PDF",
              text: "Press “Download as PDF” and choose “Save as PDF” in the print dialog. Send it to your client.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Invoice <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["percentage-calculator", "text-to-pdf", "unit-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
