import ToolClient from "./ToolClient";
import ConvPage, { convPageMeta, type ConvPageSpec } from "../_imgconv/ConvPage";
import { JsonLd } from "../tool-parts";
import { softwareAppJsonLd } from "../_conv-shared/seo";

const spec: ConvPageSpec = {
  tool: {
    slug: "jpg-to-png-converter",
    name: "JPG to PNG Converter",
    tagline: "A free JPG to PNG converter: switch JPGs to PNG with zero quality loss — in your browser, no sign-up.",
    description:
      "Free JPG to PNG converter: change JPG photos into lossless PNG images with every pixel preserved. No uploads, no sign-up, runs in your browser.",
    category: "Everyday Utilities",
    keyword: "jpg to png converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["png-to-jpg-converter", "heic-to-jpg-converter", "image-converter"],
  },
  heroTitle: (
    <>
      Free JPG to <em>PNG Converter</em> Online
    </>
  ),
  tagline: "A free JPG to PNG converter: switch JPGs to PNG with zero quality loss — in your browser, no sign-up.",
  metaTitle: "JPG to PNG Converter - Change JPEG to PNG Free Online",
  metaDescription:
    "JPG to PNG converter, free online: switch JPG photos to PNG with zero quality loss, right in your browser. No sign-up, no watermark. Try it now — it’s free!",
  keywords: [
    "JPG to PNG",
    "JPG to PNG converter",
    "convert JPG to PNG",
    "JPEG to PNG",
    "JPG to PNG with transparency",

  ],
  formats: [
    {
      t: "JPG / JPEG input",
      d: "Any .jpg or .jpeg file — phone photos, camera shots, downloads. If your browser can display it, this tool can convert it.",
    },
    {
      t: "PNG output",
      d: "Lossless PNG: every pixel of the JPG is preserved exactly. No quality slider exists because PNG doesn't throw away detail.",
    },
    {
      t: "Bigger files, honestly",
      d: "PNG files are usually larger than the JPG they came from — that's the price of lossless. If size matters more, convert to WebP instead.",
    },
    {
      t: "No fake transparency",
      d: "JPG has no alpha channel, so the PNG won't magically gain transparency. It keeps the photo exactly as it looked.",
    },
  ],
  steps: [
    {
      title: "Drop your JPG",
      text: "Drag the .jpg file in or click to browse. A preview appears instantly with its dimensions and size.",
    },
    {
      title: "Nothing to configure",
      text: "PNG is lossless, so there are no quality settings to get wrong. Every pixel carries over exactly.",
    },
    {
      title: "Download the PNG",
      text: "Hit “Convert to PNG” and save it. The file keeps its original name with a .png extension.",
    },
  ],
  useCases: [
    {
      t: "Stop generational quality loss",
      d: "Every JPG re-save degrades quality slightly. Convert to PNG once, and further edits won't accumulate compression damage.",
    },
    {
      t: "Editing workflows",
      d: "Design tools and editors work better with PNG masters. Convert your JPG source before cropping, annotating, or compositing.",
    },
    {
      t: "Screenshots of photos",
      d: "JPG screenshots of JPGs double the compression artifacts. A PNG copy freezes the current quality exactly.",
    },
    {
      t: "Uploads that demand PNG",
      d: "Some platforms, print services, and app stores only accept PNG. Convert in seconds instead of re-exporting from an editor.",
    },
    {
      t: "Archiving originals",
      d: "Keep a lossless PNG alongside the JPG so you always have the best-available version of a photo for future edits.",
    },
  ],
  faqs: [
    {
      q: "Does converting JPG to PNG improve quality?",
      a: "No — and any tool claiming otherwise is lying. JPG already discarded some detail when it was created, and conversion can't bring it back. What PNG gives you is a guarantee: zero further quality loss from this point on.",
    },
    {
      q: "Why is the PNG bigger than my JPG?",
      a: "JPG uses lossy compression that throws away detail humans barely notice; PNG keeps everything. For photos, expect the PNG to be 2–5× larger. That's normal and unavoidable — if you want smaller files, convert to WebP instead.",
    },
    {
      q: "Will the PNG have a transparent background?",
      a: "No. JPG images have no transparency information, so there's nothing to preserve. The PNG will look pixel-identical to your JPG.",
    },
    {
      q: "Is there a file size limit?",
      a: "Yes — 100 MB per file. Since conversion happens in your browser's memory, very large images on low-RAM devices may be slow, but typical photos convert instantly.",
    },
    {
      q: "Is this really free with no sign-up?",
      a: "Yes. Unlimited conversions, no account, no watermark. The conversion runs on your device with the browser's canvas engine, so there's no per-file server cost.",
    },
    {
      q: "Are my images uploaded anywhere?",
      a: "Never. The file is decoded and re-encoded inside your browser tab. Close the tab and nothing remains — no server, no storage, no tracking of your images.",
    },
  ],
  privacyNote:
    "Conversion runs 100% in your browser with the canvas engine. Your images are never uploaded to any server.",
};

export const metadata = convPageMeta(spec);

export default function JpgToPngPage() {
  return (
    <>
      <JsonLd data={softwareAppJsonLd(spec.tool, "UtilitiesApplication")} />
      <ConvPage spec={spec}>
        <ToolClient />
      </ConvPage>
    </>
  );
}
