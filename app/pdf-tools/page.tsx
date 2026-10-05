import { pageMeta } from "@/lib/site";
import HubPage, { type HubConfig } from "../hubs/HubPage";

export const metadata = pageMeta({
  title: "Free PDF Tools Online — Merge, Split, Compress & Convert",
  description:
    "Use our free PDF tools online: merge, split, compress, rotate and convert PDFs right in your browser. No sign-up, no watermarks — get started free now.",
  path: "/pdf-tools",
  keywords: [
    "free pdf tools online",
    "pdf tools online free",
    "merge pdf online free",
    "pdf converter free",
    "compress pdf online",
  ],
});

const config: HubConfig = {
  path: "/pdf-tools",
  hubName: "PDF Tools",
  title: "Free PDF Tools Online",
  description:
    "Free online PDF tools: merge, split, compress, rotate, and convert PDFs right in your browser — no sign-up, no watermarks.",
  intro: [
    "Free PDF tools online are the fastest way to handle everyday document jobs without installing software or paying for a subscription. This collection covers the essentials: merge PDF files into one document, split a PDF into separate pages, compress a PDF to shrink its size, rotate pages that came out sideways, and convert between PDF, JPG, PNG, Word, and Excel.",
    "Privacy matters with documents, so every PDF tool here runs entirely in your browser — your files are never uploaded to a server. That makes them safe for contracts, bank statements, resumes, and homework. Because the work happens on your own device, there are also no queues, no file-size caps from a remote service, and no watermarks stamped on your output.",
    "Most tools follow the same simple flow: add your files, adjust the options, and download the result. The PDF converters turn pages into images (PDF to JPG or PNG) or build PDFs from images and text, while the Word and Excel converters handle office documents through your browser so the content never leaves your hands.",
  ],
  slugs: [
    "merge-pdf",
    "split-pdf",
    "compress-pdf",
    "rotate-pdf",
    "pdf-to-jpg",
    "pdf-to-png-converter",
    "image-to-pdf",
    "text-to-pdf",
    "wikipedia-to-pdf",
    "pdf-to-word-converter",
    "word-to-pdf-converter",
    "word-to-jpg-converter",
    "excel-to-pdf-converter",
    "excel-to-jpg-converter",
  ],
  chooseTitle: "How to choose the right PDF tool",
  chooseIntro:
    "Match the tool to the job — using the wrong converter is the most common reason files come out mangled.",
  choose: [
    {
      title: "Merging vs. combining pages",
      body: "Use Merge PDF when you have several separate files to join in order. If you need to pull pages out of one big file instead, Split PDF is the right tool.",
    },
    {
      title: "Compressing without ruining quality",
      body: "Compress PDF shrinks the file so it can be emailed or uploaded to a form. If text looks blurry afterwards, the original images were already low-resolution — compression can't fix that, but it won't make a good PDF worse.",
    },
    {
      title: "PDF to image vs. PDF to Word",
      body: "Convert to JPG or PNG when you need a picture of a page (for slides or social posts). Choose PDF to Word when you need to edit the text — it extracts the text content rather than snapshotting the page.",
    },
    {
      title: "Keep sensitive files in the browser",
      body: "All the tools on this page process files locally on your device. Avoid services that make you upload private documents to their servers, especially for IDs, contracts, and financial paperwork.",
    },
  ],
  faqs: [
    {
      q: "Are these PDF tools really free?",
      a: "Yes. Every tool on this page is free with no sign-up, no watermarks, and no daily limits. Because most processing happens in your browser rather than on our servers, there is no cost to pass on to you.",
    },
    {
      q: "Do my PDF files get uploaded anywhere?",
      a: "No. The PDF tools run entirely in your browser — your files never leave your device. That makes them safe to use for sensitive documents like contracts, ID scans, and bank statements.",
    },
    {
      q: "Will compressing a PDF reduce its quality?",
      a: "Compression shrinks images inside the PDF, so text stays sharp while photos may lose some detail. If the file still looks fine on screen and prints clearly, the quality loss is negligible for everyday use.",
    },
    {
      q: "Can I convert a scanned PDF to Word?",
      a: "A scanned PDF is a picture of text, not real text. The PDF-to-Word converter extracts text-based content; for scanned pages you would first need OCR (optical character recognition) to turn the image into text.",
    },
    {
      q: "Which tool makes a PDF from my photos?",
      a: "Use Image to PDF: add your JPG or PNG photos, arrange them in order, and download a single PDF. It is handy for turning photographed notes or receipts into one clean document.",
    },
  ],
};

export default function PdfToolsPage() {
  return <HubPage config={config} />;
}
