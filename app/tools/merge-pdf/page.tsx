import MergePdfClient from "./ToolClient";
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

const tool: ToolDef = {
  slug: "merge-pdf",
  name: "Merge PDF",
  tagline: "Combine multiple PDFs into one, in your chosen order.",
  description:
    "Merge multiple PDF files into a single PDF document, in the order you choose. Files are combined right in your browser — nothing is uploaded.",
  category: "Screenshots & PDF",
  keyword: "merge pdf online free",
  badge: "Free",
  badgeColor: "green",
  api: null,
  related: ["split-pdf", "rotate-pdf", "text-to-pdf"],
};

export const metadata = pageMeta({
  title: "Merge PDF Online Free — Combine PDF Files",
  description:
    "Merge multiple PDFs into one document for free. Drag to reorder pages, combine files in your browser — no sign-up, no uploads, no watermarks.",
  path: "/tools/merge-pdf",
  keywords: [
    "merge pdf online free",
    "combine pdf files",
    "merge pdf files online",
    "join pdf documents free",
  ],
});

const faqs = [
  {
    q: "Is this PDF merger really free?",
    a: "Yes. There are no limits on the number of files, no sign-up, and no watermarks. Merging happens entirely in your browser, so it costs us nothing to run — which is why it can stay free.",
  },
  {
    q: "Is my PDF uploaded to a server?",
    a: "No. Your files never leave your device. The merge runs inside your browser tab using the pdf-lib library, and the combined file is downloaded straight to your computer. Safe for contracts, bank statements, and other sensitive documents.",
  },
  {
    q: "Can I change the order of the PDFs before merging?",
    a: "Yes — that is the whole point of the list. Drag files up and down (or use the arrow buttons) to set the exact order. The top file becomes the first pages of the merged PDF.",
  },
  {
    q: "What if one of my PDFs is password-protected?",
    a: "Password-protected PDFs can't be merged until the password is removed, because the browser can't read their pages. Open the file in your PDF reader with the password and re-save or print it to a new PDF without a password, then merge.",
  },
  {
    q: "How many PDFs can I merge at once?",
    a: "There is no fixed limit, but very large files use a lot of browser memory. If the merge stalls, try combining fewer files at a time and then merging those results.",
  },
  {
    q: "Does merging change my PDF quality?",
    a: "No. Pages are copied as-is — text, images, and formatting are preserved exactly. The merged file is simply all the original pages glued together in your order.",
  },
];

export default function MergePdfPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={webAppJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools/merge-pdf" },
          { name: "Merge PDF", path: "/tools/merge-pdf" },
        ])}
      />
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Merge PDF" }]} />
        <ToolHero
          badge={tool.badge}
          badgeColor={tool.badgeColor}
          title={
            <>
              Merge <em>PDF</em> files
            </>
          }
          tagline="Combine multiple PDFs into one document in the exact order you want — free, private, and done entirely in your browser."
        />

        <MergePdfClient />
        <PrivacyNote>
          Files are merged on your device with pdf-lib. Nothing is uploaded, stored, or seen by anyone but you.
        </PrivacyNote>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Formats & limits"
          title={<>What you can <em>merge</em></>}
          sub="Straightforward limits, stated plainly."
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
              t: "Input",
              d: ".pdf files, any size your browser can hold in memory. Very large files (hundreds of MB) may be slow or fail — merge those in smaller batches.",
            },
            {
              t: "Output",
              d: "One combined .pdf with all pages preserved exactly as they were — text, images, and layout untouched.",
            },
            {
              t: "Encrypted files",
              d: "Password-protected PDFs are rejected. Remove the password first (with the password you know), then merge.",
            },
            {
              t: "No limits",
              d: "No file-count cap, no account, no watermark. Just note that merging dozens of huge files can run your browser out of memory.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="How it works" title={<>Three steps to <em>one PDF</em></>} />
        <Steps
          steps={[
            {
              title: "Add your PDFs",
              text: "Click the button and pick two or more PDF files. They appear in a numbered list in the order you added them.",
            },
            {
              title: "Arrange the order",
              text: "Drag files up and down — or use the arrow buttons — until the list matches the order you want in the final document.",
            },
            {
              title: "Merge & download",
              text: "Hit the merge button. Your browser stitches the pages together and offers the combined PDF for download.",
            },
          ]}
        />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead
          label="Use cases"
          title={<>When merging <em>helps</em></>}
          sub="One document beats a zip of five."
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
              t: "Job applications",
              d: "Resume, cover letter, and certificates in one file — recruiters open a single attachment instead of three.",
            },
            {
              t: "Invoices & receipts",
              d: "Combine a month of receipts into one PDF for your accountant or tax filing. One upload, done.",
            },
            {
              t: "Study material",
              d: "Merge lecture slides, notes, and past papers into a single study pack you can search and scroll through.",
            },
            {
              t: "Legal & contracts",
              d: "Gather signed pages, annexures, and scans into one contract document — without sending sensitive files to a random website.",
            },
          ].map((c) => (
            <div key={c.t} className="card" style={{ padding: 20 }}>
              <h3 style={{ fontWeight: 800, fontSize: "1rem", marginBottom: 8 }}>{c.t}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.65 }}>{c.d}</p>
            </div>
          ))}
        </div>

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="FAQ" title={<>Merge PDF <em>questions</em></>} />
        <FaqList faqs={faqs} />

        <hr className="sec-rule" style={{ margin: "44px 0" }} />
        <SectionHead label="Keep exploring" title={<>Related <em>tools</em></>} />
        <RelatedTools slugs={["text-to-pdf", "image-compressor", "word-counter"]} />

        <div style={{ marginTop: 48 }}>
          <ApiCta />
        </div>
      </div>
    </>
  );
}
