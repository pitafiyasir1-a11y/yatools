import ExcelToJpgClient from "./ToolClient";
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
  slug: "excel-to-jpg-converter",
  name: "Excel to JPG Converter",
  tagline: "A free Excel to JPG converter: turn spreadsheet sheets into shareable JPG images — right in your browser.",
  description:
    "Convert Excel to JPG online for free: capture .xlsx/.xls/.csv sheets as crisp images in your browser. Quality control, no sign-up.",
  category: "Screenshots & PDF",
  keyword: "excel to jpg converter online",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: [
    "excel-to-pdf-converter",
    "word-to-jpg-converter",
    "pdf-to-jpg"
],
};

export const metadata = pageMeta({
  title: "Excel to JPG Converter - Convert Sheets to JPG Free Online",
  description:
    "Excel to JPG converter, free online: turn spreadsheet sheets into shareable JPG images right in your browser. No sign-up needed. Try it now — it’s free!",
  path: "/tools/excel-to-jpg-converter",
  keywords: [
    "Excel to JPG",
    "Excel to JPG converter",
    "spreadsheet to JPG",
    "convert Excel to JPG",
    "XLSX to JPG",
  ],
});

const faqs = [
  {
    q: "How does the conversion work?",
    a: "Your spreadsheet is read in your browser with the SheetJS library, each sheet is laid out as a clean table, and you capture it as a JPG image with html2canvas. You control the quality and download sheets one by one or all at once.",
  },
  {
    q: "Which file types are supported?",
    a: ".xlsx and .xls Excel files plus .csv files. Every sheet in the workbook can be converted to its own image.",
  },
  {
    q: "What quality will the images be?",
    a: "Sheets are captured at double resolution so small numbers stay readable. Pick Medium for small files, High (recommended) for sharing, or Maximum for the sharpest result.",
  },
  {
    q: "Can the numbers be edited in the JPG?",
    a: "No — a JPG is a picture of the table, not a spreadsheet. Values can't be selected, copied, or recalculated. If you need the data editable, keep the original file.",
  },
  {
    q: "Is my spreadsheet uploaded anywhere?",
    a: "Never. Reading and image capture happen entirely on your device. Your file is discarded the moment you leave the page.",
  },
];

const howTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to convert Excel to JPG online",
  description:
    "Read a spreadsheet in your browser and save each sheet as a crisp JPG image.",
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
      name: "Pick a sheet and quality",
      text: "Switch between sheet tabs, choose a JPG quality level, then capture the sheet — or all sheets at once.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Download the images",
      text: "Each sheet appears as a thumbnail with its own download button; save them as JPG files.",
    },
  ],
};

export default function ExcelToJpgPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd data={softwareAppJsonLd(tool, "UtilitiesApplication")} />
      <JsonLd data={howTo} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/excel-to-jpg-converter" },
          { name: "Excel to JPG Converter", path: "/tools/excel-to-jpg-converter" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Excel to JPG Converter" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Free Excel to <em>JPG Converter</em> Online
            </>
          }
          tagline="A free Excel to JPG converter: turn spreadsheet sheets into shareable JPG images — right in your browser."
        />

        <ExcelToJpgClient />
        <PrivacyNote>
          Your spreadsheet is read and captured 100% in your browser with SheetJS and
          html2canvas. Nothing is ever uploaded.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What this converter <em>produces</em></>}
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
              t: "Output: JPG per sheet",
              d: "Each sheet becomes its own .jpg at double resolution. Filenames keep your file's name plus the sheet name.",
            },
            {
              t: "You control the quality",
              d: "Three JPEG quality levels. High is the sweet spot for sharing; Maximum if the image will be printed or zoomed.",
            },
            {
              t: "Pictures, not spreadsheets",
              d: "The output is an image — values can't be copied back into cells or recalculated. Keep the original for editing.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>images</em></>} />
        <Steps
          steps={[
            {
              title: "Drop your spreadsheet",
              text: "Drag the file onto the upload area or click to choose it. It's read in your browser — never uploaded.",
            },
            {
              title: "Choose sheet & quality",
              text: "Switch between sheet tabs, pick a JPG quality level, then capture one sheet or all of them.",
            },
            {
              title: "Download images",
              text: "Every sheet appears as a thumbnail — download the ones you need as JPG files.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When sheet images <em>help</em></>}
          sub="Sometimes a picture of the numbers is exactly the format you need."
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
              t: "Share data on chat",
              d: "Messaging apps don't take .xlsx files gracefully. Convert the sheet and send it like any photo.",
            },
            {
              t: "Embed tables in slides",
              d: "Drop a sheet image into PowerPoint or Canva — it keeps its formatting and never reflows mid-presentation.",
            },
            {
              t: "Post price lists online",
              d: "Marketplaces and forums usually only allow image uploads. A sheet JPG is the universal workaround.",
            },
            {
              t: "Show proof, not the file",
              d: "Need to prove a balance or a score without handing over the editable workbook? An image shows it read-only.",
            },
            {
              t: "Quick visual archives",
              d: "Snapshot daily reports and dashboards as dated images — lightweight, viewable anywhere, no Excel needed.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Excel to JPG <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["excel-to-pdf-converter", "word-to-jpg-converter", "pdf-to-jpg"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
