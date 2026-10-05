import ToolClient from "./ToolClient";
import ConvPage, { convPageMeta, type ConvPageSpec } from "../_imgconv/ConvPage";
import { JsonLd } from "../tool-parts";
import { softwareAppJsonLd } from "../_conv-shared/seo";

const spec: ConvPageSpec = {
  tool: {
    slug: "jpg-to-webp-converter",
    name: "JPG to WebP Converter",
    tagline: "A free JPG to WebP converter: make JPGs up to 30% smaller as modern WebP files — fast and private.",
    description:
      "Free JPG to WebP converter: shrink JPG photos into smaller, faster-loading WebP images with a quality slider. Private, in-browser, no sign-up.",
    category: "Everyday Utilities",
    keyword: "jpg to webp converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["webp-to-jpg-converter", "image-compressor", "image-converter"],
  },
  heroTitle: (
    <>
      Free JPG to <em>WebP Converter</em> Online
    </>
  ),
  tagline: "A free JPG to WebP converter: make JPGs up to 30% smaller as modern WebP files — fast and private.",
  metaTitle: "JPG to WebP Converter - Optimize to WebP Free Online",
  metaDescription:
    "JPG to WebP converter, free online: make your JPGs up to 30% smaller as modern WebP files. Fast, private, in-browser. No sign-up. Try it now — it’s free!",
  keywords: [
    "JPG to WebP",
    "JPG to WebP converter",
    "convert JPG to WebP",
    "JPEG to WebP",
    "optimize JPG to WebP",

  ],
  formats: [
    {
      t: "JPG / JPEG input",
      d: "Any .jpg or .jpeg — phone photos, camera exports, stock images. The tool reads the pixels; the original compression doesn't matter.",
    },
    {
      t: "WebP output",
      d: "Modern WebP with a quality slider (defaults to 85%). Typically 25–35% smaller than an equivalent-quality JPG.",
    },
    {
      t: "Universal browser support",
      d: "Every current browser — Chrome, Edge, Firefox, Safari — displays WebP natively. The compatibility worries of 2019 are over.",
    },
    {
      t: "One honest caveat",
      d: "Some desktop software still lags on WebP. If the file is headed for an old editor or a picky uploader, stick with JPG.",
    },
  ],
  steps: [
    {
      title: "Drop your JPG",
      text: "Drag the photo in or click to browse. Preview shows instantly with dimensions and file size.",
    },
    {
      title: "Set the quality",
      text: "85% is the web sweet spot — much smaller than JPG, visually identical. Nudge higher for hero images, lower for thumbnails.",
    },
    {
      title: "Download the WebP",
      text: "Hit “Convert to WebP” and compare sizes. Then use it on your site, in your app, or wherever modern formats shine.",
    },
  ],
  useCases: [
    {
      t: "Faster websites",
      d: "Images are usually the heaviest part of a page. Swapping JPGs for WebPs at the same visual quality can cut image weight by a third.",
    },
    {
      t: "Better Core Web Vitals",
      d: "Google's page-experience metrics reward fast-loading images. Smaller WebP files directly improve your LCP scores.",
    },
    {
      t: "App assets",
      d: "Mobile apps bundling JPG assets can slim their download size with WebP — users on slow connections will feel it.",
    },
    {
      t: "Email newsletters",
      d: "Lighter images mean emails that render faster and eat less of your subscribers' data — and most mail clients display WebP fine now.",
    },
    {
      t: "Storage savings",
      d: "Large photo libraries converted to WebP take meaningfully less disk. Keep the JPG masters, serve the WebPs.",
    },
  ],
  faqs: [
    {
      q: "How much smaller is WebP than JPG really?",
      a: "For photos at matched visual quality, WebP is typically 25–35% smaller than JPG. At the default 85% quality setting here, most people can't tell the WebP and the original JPG apart side by side.",
    },
    {
      q: "Will WebP work in all browsers?",
      a: "Yes, in every browser released in the last several years — Chrome, Edge, Firefox, Safari, and mobile browsers all render WebP natively. Unless your audience is on truly ancient software, you're safe.",
    },
    {
      q: "What quality should I pick?",
      a: "85% for general web use, 90%+ for large hero images where every detail counts, 75–80% for thumbnails. Below 70% you'll start seeing the smooth-gradient banding that plagues all lossy formats.",
    },
    {
      q: "Does converting JPG to WebP lose quality?",
      a: "Technically yes — it's one more lossy encode. Practically, at 85%+ the difference is invisible in normal viewing. Don't convert back and forth repeatedly, though; each generation costs a little.",
    },
    {
      q: "When should I NOT use WebP?",
      a: "When the destination is old desktop software, a strict corporate CMS, or a print workflow — those still expect JPG/PNG/TIFF. WebP is a web-delivery format first.",
    },
    {
      q: "Are my photos uploaded anywhere?",
      a: "No. The conversion runs entirely in your browser tab using the canvas encoder. Your images never touch a server.",
    },
  ],
  privacyNote:
    "Conversion runs 100% in your browser with the canvas engine. Your images are never uploaded to any server.",
};

export const metadata = convPageMeta(spec);

export default function JpgToWebpPage() {
  return (
    <>
      <JsonLd data={softwareAppJsonLd(spec.tool, "UtilitiesApplication")} />
      <ConvPage spec={spec}>
        <ToolClient />
      </ConvPage>
    </>
  );
}
