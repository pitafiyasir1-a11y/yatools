import ToolClient from "./ToolClient";
import ConvPage, { convPageMeta, type ConvPageSpec } from "../_imgconv/ConvPage";
import { JsonLd } from "../tool-parts";
import { softwareAppJsonLd } from "../_conv-shared/seo";

const spec: ConvPageSpec = {
  tool: {
    slug: "svg-to-png-converter",
    name: "SVG to PNG Converter",
    tagline: "A free SVG to PNG converter: rasterize vectors into crisp PNGs at any size you choose — no sign-up.",
    description:
      "Free SVG to PNG converter: turn vector SVG files into sharp PNG images at sizes up to 4096 px. Transparency preserved, runs in your browser.",
    category: "Everyday Utilities",
    keyword: "svg to png converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["png-to-svg-converter", "image-converter", "png-to-jpg-converter"],
  },
  heroTitle: (
    <>
      Free SVG to <em>PNG Converter</em> Online
    </>
  ),
  tagline: "A free SVG to PNG converter: rasterize vectors into crisp PNGs at any size you choose — no sign-up.",
  metaTitle: "SVG to PNG Converter - Convert SVG Vectors Free Online",
  metaDescription:
    "SVG to PNG converter, free online: rasterize vector graphics into crisp PNGs at any size you choose. No sign-up, no watermark. Try it now — it’s free!",
  keywords: [
    "SVG to PNG",
    "SVG to PNG converter",
    "convert SVG to PNG",
    "vector to PNG",
    "SVG to PNG high resolution",

  ],
  formats: [
    {
      t: "SVG input",
      d: "Any valid .svg vector file — logos, icons, illustrations. The tool reads its intrinsic size or viewBox to get the aspect ratio right.",
    },
    {
      t: "PNG output",
      d: "Lossless PNG rasterized at your chosen width: 512, 1024, 2048, or 4096 px. Vectors scale perfectly, so 4096 px is genuinely sharp.",
    },
    {
      t: "Transparency preserved",
      d: "Unlike JPG conversions, SVG → PNG keeps transparent backgrounds transparent. No fill color needed, nothing flattened.",
    },
    {
      t: "Font caveat",
      d: "Text inside SVGs renders with fonts installed on YOUR device. If the SVG uses a font you don't have, text may look different — convert text to outlines first if it matters.",
    },
  ],
  steps: [
    {
      title: "Drop your SVG",
      text: "Drag the .svg file in or click to browse. The tool detects its natural size and shows a preview.",
    },
    {
      title: "Pick an output size",
      text: "Choose 512 px for icons, 1024–2048 px for web use, or 4096 px for print. Bigger is always sharp — it's a vector.",
    },
    {
      title: "Download the PNG",
      text: "Hit “Convert to PNG”. The file keeps its name with a .png extension, ready for anywhere raster images go.",
    },
  ],
  useCases: [
    {
      t: "Logos for documents",
      d: "Word, PowerPoint, and PDFs handle PNGs far better than SVGs. Export your logo at 2048 px and it stays crisp in print.",
    },
    {
      t: "App icons & favicons",
      d: "Design in vector, export raster: generate the exact PNG sizes your app manifest or favicon set needs.",
    },
    {
      t: "Social media graphics",
      d: "Platforms want PNG/JPG uploads, not SVGs. Rasterize your vector artwork at the platform's recommended dimensions.",
    },
    {
      t: "Thumbnails from illustrations",
      d: "Turn a detailed SVG illustration into a PNG thumbnail for a blog post or video cover without opening an editor.",
    },
    {
      t: "Email signatures",
      d: "Mail clients are notoriously bad with SVG. A PNG version of your logo renders correctly in every inbox.",
    },
  ],
  faqs: [
    {
      q: "What's the difference between SVG and PNG?",
      a: "SVG is vector: mathematical shapes that scale infinitely. PNG is raster: a fixed grid of pixels. You convert when the destination needs pixels — documents, uploads, apps — and you pick the size so it's sharp enough for the job.",
    },
    {
      q: "What output size should I choose?",
      a: "Match the use: 512 px for icons and avatars, 1024–2048 px for web graphics and slides, 4096 px for print. Since the source is vector, larger never means blurrier — only a bigger file.",
    },
    {
      q: "Will transparency be preserved?",
      a: "Yes. PNG supports an alpha channel, so transparent areas of your SVG stay transparent. This is one of the main reasons to choose PNG over JPG for vector exports.",
    },
    {
      q: "Why does text in my SVG look wrong?",
      a: "SVG text renders with fonts installed on the device doing the conversion — your computer. If the designer used a font you don't have, the browser substitutes something else. For pixel-perfect results, ask for the SVG with text converted to outlines.",
    },
    {
      q: "Can I convert PNG back to SVG?",
      a: "Not meaningfully with a simple converter — that requires vector tracing (potrace-style), which is a different, much harder problem. This tool goes vector → raster only.",
    },
    {
      q: "Is my file uploaded anywhere?",
      a: "No. The SVG is parsed and rasterized inside your browser tab via the canvas engine. Nothing leaves your device.",
    },
  ],
  privacyNote:
    "SVG parsing and PNG rasterization run 100% in your browser. Your files are never uploaded to any server.",
};

export const metadata = convPageMeta(spec);

export default function SvgToPngPage() {
  return (
    <>
      <JsonLd data={softwareAppJsonLd(spec.tool, "UtilitiesApplication")} />
      <ConvPage spec={spec}>
        <ToolClient />
      </ConvPage>
    </>
  );
}
