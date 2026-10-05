import ExcelToPdfClient from "./ToolClient";
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
  type ToolDef,
} from "@/lib/site";
import { softwareAppJsonLd } from "../_conv-shared/seo";

const tool: ToolDef = {
  slug: "excel-to-pdf-converter",
  name: "Excel to PDF Converter",
  tagline: "A free Excel to PDF converter: turn spreadsheet sheets into clean, printable PDFs — right in your browser.",
  description:
    "Convert Excel to PDF online for free: read .xlsx/.xls/.csv in your browser and save sheets as PDF via print. Private, fast, no sign-up.",
  category: "Screenshots & PDF",
  keyword: "excel to pdf converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "word-to-pdf-converter",
    "pdf-to-word-converter",
    "excel-to-jpg-converter"
],
};

export const metadata = pageMeta({
  title: "Excel to PDF Converter - XLSX Sheets to PDF Free Online",
  description:
    "Excel to PDF converter, free online: turn spreadsheet sheets into clean, printable PDFs right in your browser. No uploads, no sign-up needed. Try now!",
  path: "/tools/excel-to-pdf-converter",
  keywords: [
    "Excel to PDF",
    "Excel to PDF converter",
    "spreadsheet to PDF",
    "convert Excel to PDF",
    "XLSX to PDF",
  ],
});

const faqs = [
  {
    q: "How does the conversion work?",
    a: "Your spreadsheet is read in your browser with the SheetJS library, each sheet is shown as a clean table, and the conversion uses your browser's built-in print engine — you choose “Save as PDF” in the print dialog. Nothing is uploaded.",
  },
  {
    q: "Which file types are supported?",
    a: ".xlsx and .xls Excel files plus .csv files. Each sheet gets its own tab so you can convert them one at a time.",
  },
  {
    q: "Will formulas, charts, and formatting carry over?",
    a: "Cell values carry over; formulas are replaced by their calculated values, and charts, images, and fancy formatting won't transfer. The output is a clean data table — ideal for records, reports, and lists.",
  },
  {
    q: "What about very large sheets?",
    a: "Sheets are capped at the first 400 rows and 26 columns for a clean, readable PDF. Your original file is untouched — only the converted view is limited.",
  },
  {
    q: "Is my spreadsheet uploaded anywhere?",
    a: "Never. Reading and printing happen entirely on your device. Close the tab and nothing remains on any server.",
  },
];

const howTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert Excel to PDF online",
  description:
    "Read a spreadsheet in your browser and save its sheets as clean PDFs using the print engine.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload your spreadsheet",
      text: "Drop your .xlsx, .xls, or .csv onto the upload area or click to choose it. It's read locally.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Pick a sheet",
      text: "Switch between sheets with the tab buttons and check the table preview looks right.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Save as PDF",
      text: "Click “Print / Save as PDF” and choose “Save as PDF” in the print dialog.",
    },
  ],
};

export default function ExcelToPdfPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd data={howTo} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/excel-to-pdf-converter" },
          { name: "Excel to PDF Converter", path: "/tools/excel-to-pdf-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Excel to PDF Converter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Excel to <em>PDF Converter</em> Online
            </>
          }
          tagline="A free Excel to PDF converter: turn spreadsheet sheets into clean, printable PDFs — right in your browser."
        />

        <ExcelToPdfClient />
        <PrivacyNote>
          Your spreadsheet is read 100% in your browser with SheetJS and converted by your
          browser's print engine. Nothing is ever uploaded.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What this converter <em>handles</em></>}
          sub="Plain facts, no fine print."
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
              t: "Input: xlsx, xls, csv",
              d: "Excel workbooks and plain CSV files. Password-protected workbooks can't be opened.",
            },
            {
              t: "Output: PDF via print",
              d: "Your browser's own “Save as PDF” produces the file — crisp tables, page breaks handled automatically.",
            },
            {
              t: "Values, not formulas",
              d: "Cells show their calculated values. Charts, images, and complex formatting stay behind in the original file.",
            },
            {
              t: "Sane size cap",
              d: "First 400 rows × 26 columns per sheet — enough for real reports while keeping the PDF clean and fast.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>PDF</em></>} />
        <Steps
          steps={[
            {
              title: "Drop your spreadsheet",
              text: "Drag the file onto the upload area or click to choose it. It's read in your browser — never uploaded.",
            },
            {
              title: "Pick a sheet",
              text: "Every sheet appears as a tab. Switch between them and check the table preview before converting.",
            },
            {
              title: "Save as PDF",
              text: "Hit “Print / Save as PDF” and pick “Save as PDF” in the dialog. Repeat for other sheets if needed.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When this converter <em>helps</em></>}
          sub="Spreadsheets are for editing; PDFs are for sharing."
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
              t: "Share reports read-only",
              d: "Send the monthly sales report as a PDF so nobody accidentally edits a formula before the meeting.",
            },
            {
              t: "Submit expense sheets",
              d: "Finance portals and auditors prefer PDFs. Convert your expense tracker and submit a clean copy.",
            },
            {
              t: "Print price lists",
              d: "A PDF price list prints identically at any copy shop; a live spreadsheet never does.",
            },
            {
              t: "Archive records",
              d: "Freeze attendance logs, inventory counts, and ledgers as PDFs that look the same ten years from now.",
            },
            {
              t: "No Excel installed",
              d: "Someone sent an .xlsx and you have no office suite? Convert the sheet and read it as a PDF.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Excel to PDF <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["word-to-pdf-converter", "pdf-to-word-converter", "excel-to-jpg-converter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
