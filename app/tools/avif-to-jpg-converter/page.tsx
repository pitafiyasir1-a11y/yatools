import ToolClient from "./ToolClient";
import ConvPage, { convPageMeta, type ConvPageSpec } from "../_imgconv/ConvPage";
import { JsonLd } from "../tool-parts";
import { softwareAppJsonLd } from "../_conv-shared/seo";

const spec: ConvPageSpec = {
  tool: {
    slug: "avif-to-jpg-converter",
    name: "AVIF to JPG Converter",
    tagline: "A free AVIF to JPG converter: turn next-gen AVIF images into JPGs that open everywhere — no upload.",
    description:
      "Free AVIF to JPG converter: change AVIF images into universally supported JPGs using your browser's own decoder. No uploads, no sign-up.",
    category: "Everyday Utilities",
    keyword: "avif to jpg converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["webp-to-jpg-converter", "image-converter", "png-to-jpg-converter"],
  },
  heroTitle: (
    <>
      Free AVIF to <em>JPG Converter</em> Online
    </>
  ),
  tagline: "A free AVIF to JPG converter: turn next-gen AVIF images into JPGs that open everywhere — no upload.",
  metaTitle: "AVIF to JPG Converter - Change AVIF to JPEG Free Online",
  metaDescription:
    "AVIF to JPG converter, free online: turn next-gen AVIF images into JPGs that open everywhere. Runs in your browser, no uploads. Try it now — it’s free!",
  keywords: [
    "AVIF to JPG",
    "AVIF to JPG converter",
    "convert AVIF to JPG",
    "AVIF to JPEG",
    "AVIF converter",

  ],
  formats: [
    {
      t: "AVIF input",
      d: "Still .avif images — the cutting-edge format (based on AV1 video) that compresses even better than WebP. Decoded with your browser's native engine.",
    },
    {
      t: "JPG output",
      d: "Universal JPEG with a quality slider (defaults to 90%). The result opens in literally everything, no decoder required.",
    },
    {
      t: "Browser requirement",
      d: "AVIF decoding needs a modern browser — recent Chrome, Edge, Firefox, or Safari. If decoding fails, the tool tells you plainly instead of hanging.",
    },
    {
      t: "Size trade-off",
      d: "AVIF is the most efficient still-image format around, so the JPG will be noticeably larger. That's the price of universal compatibility.",
    },
  ],
  steps: [
    {
      title: "Drop your AVIF",
      text: "Drag the .avif file in or click to browse. Your browser's own decoder reads it — no plugins, no uploads.",
    },
    {
      title: "Set quality & background",
      text: "Quality defaults to 90%; pick a background color in case the AVIF has transparency (JPG can't keep it).",
    },
    {
      title: "Download the JPG",
      text: "Hit “Convert to JPG” and use the result anywhere — editors, documents, uploads, sharing.",
    },
  ],
  useCases: [
    {
      t: "Images saved from modern sites",
      d: "Cutting-edge websites now serve AVIF, and your downloader saved one your apps can't open. Convert it to something usable.",
    },
    {
      t: "Compatibility for clients",
      d: "Sending deliverables as AVIF is asking for a “can't open this” reply. JPGs never generate that email.",
    },
    {
      t: "Editing in desktop software",
      d: "Most photo editors haven't caught up to AVIF yet. Convert to JPG (or PNG) before importing into your workflow.",
    },
    {
      t: "CMS and marketplace uploads",
      d: "Upload forms with strict allow-lists reject AVIF outright. A quick conversion gets your product photos listed.",
    },
    {
      t: "Archiving in a safe format",
      d: "AVIF is the future, but futures are uncertain. JPG copies guarantee your images open on any device, any decade.",
    },
  ],
  faqs: [
    {
      q: "What is AVIF?",
      a: "AVIF is an image format based on the AV1 video codec — it compresses photos roughly 50% better than JPG at the same visual quality. It's technically superb but still poorly supported outside browsers, which is exactly why this converter exists.",
    },
    {
      q: "Why can't my apps open AVIF files?",
      a: "Format adoption is slow: operating systems, editors, and office suites add new formats years after browsers do. JPG, by contrast, has been universally supported since the 1990s. Conversion bridges that gap.",
    },
    {
      q: "Will the JPG be bigger than the AVIF?",
      a: "Yes, noticeably — often 2–3× larger at matched quality. AVIF is the most efficient still-image format in existence; JPG is from 1992. You're trading file size for the ability to open the image anywhere.",
    },
    {
      q: "My AVIF won't decode. What's wrong?",
      a: "AVIF decoding is done by your browser, so you need a recent version of Chrome, Edge, Firefox, or Safari. Update your browser and retry. Very old devices may also lack the horsepower for large AVIFs.",
    },
    {
      q: "Does it handle animated AVIF?",
      a: "Only the first frame — this is a still-image converter. Animated AVIF is rare in the wild; if you have one, a video tool is the right choice, not an image converter.",
    },
    {
      q: "Is my image uploaded anywhere?",
      a: "No. Your browser decodes the AVIF and re-encodes the JPG locally. The file never leaves your device.",
    },
  ],
  privacyNote:
    "AVIF decoding and JPG encoding both run 100% in your browser. Your images are never uploaded to any server.",
};

export const metadata = convPageMeta(spec);

export default function AvifToJpgPage() {
  return (
    <>
      <JsonLd data={softwareAppJsonLd(spec.tool, "UtilitiesApplication")} />
      <ConvPage spec={spec}>
        <ToolClient />
      </ConvPage>
    </>
  );
}
