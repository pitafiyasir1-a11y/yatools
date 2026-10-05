import ToolClient from "./ToolClient";
import ConvPage, { convPageMeta, type ConvPageSpec } from "../_imgconv/ConvPage";
import { JsonLd } from "../tool-parts";
import { softwareAppJsonLd } from "../_conv-shared/seo";

const spec: ConvPageSpec = {
  tool: {
    slug: "png-to-jpg-converter",
    name: "PNG to JPG Converter",
    tagline: "A free PNG to JPG converter: shrink PNG screenshots into lightweight JPGs — adjustable quality, no sign-up.",
    description:
      "Free PNG to JPG converter: turn PNG images into compact JPGs with a quality slider and background picker for transparency. All in your browser.",
    category: "Everyday Utilities",
    keyword: "png to jpg converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["jpg-to-png-converter", "heic-to-jpg-converter", "image-converter"],
  },
  heroTitle: (
    <>
      Free PNG to <em>JPG Converter</em> Online
    </>
  ),
  tagline: "A free PNG to JPG converter: shrink PNG screenshots into lightweight JPGs — adjustable quality, no sign-up.",
  metaTitle: "PNG to JPG Converter - Compress PNG to JPG Free Online",
  metaDescription:
    "PNG to JPG converter, free online: shrink PNG screenshots into lightweight JPGs with an adjustable quality slider. No sign-up needed. Try it now — it’s free!",
  keywords: [
    "PNG to JPG",
    "PNG to JPG converter",
    "convert PNG to JPG",
    "PNG to JPEG",
    "PNG to JPG with background",

  ],
  formats: [
    {
      t: "PNG input",
      d: "Any .png file — screenshots, logos, graphics, exports from design tools. Transparency is detected and handled, not mangled.",
    },
    {
      t: "JPG output",
      d: "Compact JPEG with a quality slider (10–100%, defaults to 90%). Screenshots typically shrink 60–80% with no visible difference.",
    },
    {
      t: "Transparency → background",
      d: "JPG can't do transparency, so see-through areas are filled with a color you pick (white by default). No ugly black fills unless you choose black.",
    },
    {
      t: "Limits",
      d: "Files up to 100 MB, converted one at a time. Text-heavy screenshots stay sharpest at 90%+ quality — don't go below 80% for those.",
    },
  ],
  steps: [
    {
      title: "Drop your PNG",
      text: "Drag the screenshot or graphic in, or click to browse. You'll see a preview with its dimensions and file size.",
    },
    {
      title: "Tune quality & background",
      text: "Set the quality slider (90% is a great default) and pick the fill color for any transparent areas.",
    },
    {
      title: "Download the JPG",
      text: "Hit “Convert to JPG”. Compare the sizes — screenshots usually drop dramatically with no visible change.",
    },
  ],
  useCases: [
    {
      t: "Screenshots for email & chat",
      d: "PNG screenshots are often several megabytes. A JPG version sends faster and won't blow past attachment limits.",
    },
    {
      t: "Blog and CMS uploads",
      d: "Many blog platforms recompress uploads anyway — send them a lean JPG and your pages load faster for readers.",
    },
    {
      t: "Forms with file-size caps",
      d: "Application portals that cap uploads at 1–2 MB reject PNG screenshots constantly. Convert first, upload without stress.",
    },
    {
      t: "Phone storage",
      d: "Screenshot folders balloon fast. Batch-convert (one at a time here) the keepers to JPG and reclaim space.",
    },
    {
      t: "Social media posts",
      d: "Platforms convert everything to JPG on upload regardless. Starting from a quality JPG avoids double-compression weirdness.",
    },
  ],
  faqs: [
    {
      q: "What happens to transparency in my PNG?",
      a: "JPG has no alpha channel, so transparent pixels must become a solid color. This tool fills them with the background color you pick — white by default. If your logo needs transparency, keep it as PNG instead.",
    },
    {
      q: "What quality setting should I use?",
      a: "90% is the sweet spot for screenshots and graphics: dramatically smaller than PNG with no visible change. For photos inside PNGs, 85% is fine. Below 75% you'll start seeing artifacts around text and sharp edges.",
    },
    {
      q: "How much smaller will the JPG be?",
      a: "It depends on the image. Screenshots with flat colors often shrink 60–80%. Detailed photos saved as PNG might only shrink 30–50%. The tool shows you the exact before/after sizes so you can judge.",
    },
    {
      q: "Will text in my screenshots stay readable?",
      a: "Yes, at 85% quality and above. JPG artifacts show up first around sharp high-contrast edges — exactly what text is. Keep quality at 90%+ for text-heavy screenshots and they'll stay crisp.",
    },
    {
      q: "Can I convert multiple PNGs at once?",
      a: "This page converts one file at a time so each gets your full attention on quality. For one-click batch work, the all-in-one image converter covers the same PNG → JPG path.",
    },
    {
      q: "Is my image uploaded to a server?",
      a: "No. Decoding and re-encoding happen inside your browser tab via the canvas engine. Nothing is transmitted, stored, or logged anywhere.",
    },
  ],
  privacyNote:
    "Conversion runs 100% in your browser with the canvas engine. Your images are never uploaded to any server.",
};

export const metadata = convPageMeta(spec);

export default function PngToJpgPage() {
  return (
    <>
      <JsonLd data={softwareAppJsonLd(spec.tool, "UtilitiesApplication")} />
      <ConvPage spec={spec}>
        <ToolClient />
      </ConvPage>
    </>
  );
}
