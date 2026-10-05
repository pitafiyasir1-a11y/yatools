import ToolClient from "./ToolClient";
import ConvPage, { convPageMeta, type ConvPageSpec } from "../_imgconv/ConvPage";
import { JsonLd } from "../tool-parts";
import { softwareAppJsonLd } from "../_conv-shared/seo";

const spec: ConvPageSpec = {
  tool: {
    slug: "pdf-to-png-converter",
    name: "PDF to PNG Converter",
    tagline: "A free PDF to PNG converter: export every PDF page as a sharp, high-quality PNG — no sign-up, no watermark.",
    description:
      "Free PDF to PNG converter: render each PDF page as a PNG image at up to 300 DPI. Everything happens in your browser — no uploads.",
    category: "Screenshots & PDF",
    keyword: "pdf to png converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["pdf-to-jpg", "pdf-to-word-converter", "png-to-jpg-converter"],
  },
  heroTitle: (
    <>
      Free PDF to <em>PNG Converter</em> Online
    </>
  ),
  tagline: "A free PDF to PNG converter: export every PDF page as a sharp, high-quality PNG — no sign-up, no watermark.",
  metaTitle: "PDF to PNG Converter - Export Pages to PNG Free Online",
  metaDescription:
    "PDF to PNG converter, free online: export every page of your PDF as a sharp, high-resolution PNG image in your browser. No sign-up needed. Try it now!",
  keywords: [
    "PDF to PNG",
    "PDF to PNG converter",
    "PDF to PNG images",
    "convert PDF to PNG",
    "PDF pages to PNG",

  ],
  formats: [
    {
      t: "PDF input",
      d: "Any standard .pdf — reports, slides, ebooks, scans. Password-protected or corrupted files will fail with a clear message, not a hang.",
    },
    {
      t: "PNG output, per page",
      d: "Each page becomes its own lossless PNG, named document-page-1.png, document-page-2.png, and so on. Download individually or all at once.",
    },
    {
      t: "Resolution you choose",
      d: "72 DPI for quick previews, 150 DPI for screens and slides, 300 DPI for print-quality output. Higher DPI means sharper images and bigger files.",
    },
    {
      t: "Limits",
      d: "Files up to 100 MB. Very long PDFs at 300 DPI can take a while and use significant memory — drop to 150 DPI if your tab struggles.",
    },
  ],
  steps: [
    {
      title: "Drop your PDF",
      text: "Drag the document in or click to browse. The tool counts its pages instantly — nothing is uploaded.",
    },
    {
      title: "Pick a resolution",
      text: "Choose 72, 150, or 300 DPI depending on whether the images are for screen, sharing, or print.",
    },
    {
      title: "Render & download",
      text: "Hit render, watch the progress, then download pages individually or all at once with one click.",
    },
  ],
  useCases: [
    {
      t: "Slides as images",
      d: "Turn a presentation PDF into PNGs for a blog post, a video thumbnail, or a carousel where each slide is an image.",
    },
    {
      t: "Sharing single pages",
      d: "Need to send just page 3 of a report in chat? Render the PDF and share that one PNG instead of the whole document.",
    },
    {
      t: "Thumbnails & previews",
      d: "Generate cover images for a document library or a download page — a 72 DPI render of page one is a perfect preview.",
    },
    {
      t: "Print-quality extraction",
      d: "At 300 DPI, diagrams and charts come out sharp enough to reuse in print layouts or high-res presentations.",
    },
    {
      t: "Archiving scans",
      d: "Split a scanned PDF into individual PNG pages for archiving systems that want one image per page.",
    },
  ],
  faqs: [
    {
      q: "Should I use PNG or JPG for PDF pages?",
      a: "PNG for text, diagrams, and slides — it's lossless, so small text stays crisp. JPG for photo-heavy pages where file size matters more. We offer both: this page does PNG, and our PDF to JPG tool does JPEG.",
    },
    {
      q: "What DPI should I choose?",
      a: "72 DPI for quick on-screen previews, 150 DPI for general sharing and slides (the best balance), 300 DPI when the images will be printed or zoomed into. An A4 page at 300 DPI is about 2480 × 3508 px.",
    },
    {
      q: "Can I convert only specific pages?",
      a: "This tool renders every page, then lets you download just the ones you want individually. If you need a page subset as a new PDF instead, use our split PDF tool first.",
    },
    {
      q: "Why did my PDF fail to load?",
      a: "The two common reasons: the PDF is password-protected (we can't and won't crack passwords), or the file is corrupted. Try opening it in your regular PDF reader — if it fails there too, the file itself is the problem.",
    },
    {
      q: "Will the PNGs contain selectable text?",
      a: "No — each page becomes a flat image, exactly like a screenshot. Text can't be selected or copied from the PNG. If you need the text, copy it from the original PDF.",
    },
    {
      q: "Is my document uploaded anywhere?",
      a: "No. The pdf.js engine renders every page inside your browser tab. Your document never leaves your device, which makes this safe for sensitive files.",
    },
  ],
  privacyNote:
    "PDF rendering runs 100% in your browser with the pdf.js engine. Your documents are never uploaded to any server.",
};

export const metadata = convPageMeta(spec);

export default function PdfToPngPage() {
  return (
    <>
      <JsonLd data={softwareAppJsonLd(spec.tool, "UtilitiesApplication")} />
      <ConvPage spec={spec}>
        <ToolClient />
      </ConvPage>
    </>
  );
}
