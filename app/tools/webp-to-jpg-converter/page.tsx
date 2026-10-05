import ToolClient from "./ToolClient";
import ConvPage, { convPageMeta, type ConvPageSpec } from "../_imgconv/ConvPage";
import { JsonLd } from "../tool-parts";
import { softwareAppJsonLd } from "../_conv-shared/seo";

const spec: ConvPageSpec = {
  tool: {
    slug: "webp-to-jpg-converter",
    name: "WebP to JPG Converter",
    tagline: "A free WebP to JPG converter: turn WebP images into JPGs for maximum compatibility — no sign-up.",
    description:
      "Free WebP to JPG converter: change modern WebP images into universally compatible JPGs. Runs 100% in your browser — no uploads.",
    category: "Everyday Utilities",
    keyword: "webp to jpg converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["jpg-to-webp-converter", "png-to-jpg-converter", "image-converter"],
  },
  heroTitle: (
    <>
      Free WebP to <em>JPG Converter</em> Online
    </>
  ),
  tagline: "A free WebP to JPG converter: turn WebP images into JPGs for maximum compatibility — no sign-up.",
  metaTitle: "WebP to JPG Converter - Change WebP to JPEG Free Online",
  metaDescription:
    "WebP to JPG converter, free online: turn WebP images into universally compatible JPGs in your browser. No sign-up, no watermark. Try it now — it’s free!",
  keywords: [
    "WebP to JPG",
    "WebP to JPG converter",
    "convert WebP to JPG",
    "WebP to JPEG",
    "WebP converter",

  ],
  formats: [
    {
      t: "WebP input",
      d: "Still WebP images (.webp) — the format Google pushed for the web and the one your browser saves images as by default now.",
    },
    {
      t: "JPG output",
      d: "Classic JPEG with a quality slider (defaults to 90%). Opens in every image viewer, editor, and office app ever shipped.",
    },
    {
      t: "Animated WebP",
      d: "This tool handles still images. Animated WebP files (tiny video-like loops) will convert only their first frame — use a GIF tool for those.",
    },
    {
      t: "Transparency handled",
      d: "WebP supports transparency and JPG doesn't, so see-through areas get the background color you choose — white by default.",
    },
  ],
  steps: [
    {
      title: "Drop your WebP",
      text: "That image you saved from the web that nothing wants to open? Drag it in or click to browse for the .webp file.",
    },
    {
      title: "Adjust if needed",
      text: "Quality defaults to 90% and the background to white. Change them only if you have a reason — most people don't.",
    },
    {
      title: "Download the JPG",
      text: "Hit “Convert to JPG” and open it anywhere — Photoshop, Word, WhatsApp, your grandma's old laptop.",
    },
  ],
  useCases: [
    {
      t: "“Save image as” gave you WebP",
      d: "Browsers now save web images as .webp by default, and half your apps can't open them. Convert once and move on with your day.",
    },
    {
      t: "Inserting into documents",
      d: "Word, PowerPoint, and Google Docs are happier with JPGs. Convert before inserting and skip the broken-image icon.",
    },
    {
      t: "Older photo editors",
      d: "Lightroom versions, old Photoshop, and basic viewers predate WebP. A JPG drops into any of them with zero fuss.",
    },
    {
      t: "Uploading to picky sites",
      d: "Marketplaces, forums, and print services with strict format lists almost always accept JPG. Don't fight the uploader — convert.",
    },
    {
      t: "Sharing in chat apps",
      d: "Some messaging apps show WebP as an unopenable file instead of a preview. JPGs always render inline.",
    },
  ],
  faqs: [
    {
      q: "What is WebP and why do I keep getting these files?",
      a: "WebP is Google's image format for the web — smaller than JPG at similar quality. Browsers now default to saving web images as .webp, which is great for the web but annoying when the rest of your software doesn't recognize the format yet.",
    },
    {
      q: "Will I lose quality converting WebP to JPG?",
      a: "Essentially no. Both are lossy formats, but at the default 90% quality the JPG is visually identical to the WebP for normal viewing. You're trading a tiny bit of efficiency for universal compatibility.",
    },
    {
      q: "Can it convert animated WebP files?",
      a: "Only the first frame. Animated WebP is really a tiny video format, and this is a still-image converter — the output will be a single JPG of the opening frame. For animations, look for a dedicated WebP-to-GIF tool.",
    },
    {
      q: "What about WebP transparency?",
      a: "It's preserved as a solid background color of your choice (white by default), because JPG has no transparency. If you need to keep transparency, convert to PNG instead with our all-in-one image converter.",
    },
    {
      q: "Why is the JPG bigger than my WebP?",
      a: "WebP compresses more efficiently than JPG — that's its whole point. A JPG version of the same image is typically 20–40% larger. You're paying that size premium for compatibility with everything.",
    },
    {
      q: "Do my images get uploaded?",
      a: "No. The file is decoded and re-encoded inside your browser tab. Nothing travels to a server, nothing is stored, and closing the tab wipes the slate clean.",
    },
  ],
  privacyNote:
    "Conversion runs 100% in your browser with the canvas engine. Your images are never uploaded to any server.",
};

export const metadata = convPageMeta(spec);

export default function WebpToJpgPage() {
  return (
    <>
      <JsonLd data={softwareAppJsonLd(spec.tool, "UtilitiesApplication")} />
      <ConvPage spec={spec}>
        <ToolClient />
      </ConvPage>
    </>
  );
}
