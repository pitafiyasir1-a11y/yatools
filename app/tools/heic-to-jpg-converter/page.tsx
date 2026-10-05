import ToolClient from "./ToolClient";
import ConvPage, { convPageMeta, type ConvPageSpec } from "../_imgconv/ConvPage";
import { JsonLd } from "../tool-parts";
import { softwareAppJsonLd } from "../_conv-shared/seo";

const spec: ConvPageSpec = {
  tool: {
    slug: "heic-to-jpg-converter",
    name: "HEIC to JPG Converter",
    tagline: "A free HEIC to JPG converter: turn iPhone HEIC photos into JPGs that open anywhere — no upload, no sign-up.",
    description:
      "Free HEIC to JPG converter: turn iPhone and iPad HEIC photos into JPGs that open on any device. Runs entirely in your browser — no uploads, no sign-up.",
    category: "Everyday Utilities",
    keyword: "heic to jpg converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["heic-to-png-converter", "jpg-to-png-converter", "image-converter"],
  },
  heroTitle: (
    <>
      Free HEIC to <em>JPG Converter</em> Online
    </>
  ),
  tagline:
    "A free HEIC to JPG converter: turn iPhone HEIC photos into JPGs that open anywhere — no upload, no sign-up.",
  metaTitle: "HEIC to JPG Converter - Convert iPhone HEIC Free Online",
  metaDescription:
    "HEIC to JPG converter, free online: turn iPhone HEIC photos into JPGs that open on any device. Runs 100% in your browser, nothing uploaded. Try it now — free!",
  keywords: [
    "HEIC to JPG",
    "HEIC to JPG converter",
    "convert HEIC to JPG",
    "iPhone HEIC to JPG",
    "HEIC converter",

  ],
  formats: [
    {
      t: "HEIC / HEIF input",
      d: "Photos saved by iPhones and iPads (.heic, .heif) since iOS 11, plus HEIC files from some Android phones. Just drop the file in.",
    },
    {
      t: "JPG output",
      d: "Universally supported JPEG with an adjustable quality slider (10–100%, defaults to 92%). The file keeps its name — photo.heic becomes photo.jpg.",
    },
    {
      t: "Honest limits",
      d: "Files up to 100 MB. A few HEIC variants (10-bit, some encoders) can't be decoded in a browser — if yours fails, export it as JPG from your Photos app first.",
    },
    {
      t: "Private by design",
      d: "Decoding runs on your device with the heic2any engine. Your photos are never uploaded, stored, or seen by anyone but you.",
    },
  ],
  steps: [
    {
      title: "Drop your HEIC file",
      text: "Drag a .heic photo onto the converter, or click to browse your phone or computer. It starts reading immediately.",
    },
    {
      title: "Pick a quality",
      text: "The slider defaults to 92% — visually identical to the original at a fraction of the size. Lower it only if you need a tiny file.",
    },
    {
      title: "Download the JPG",
      text: "Hit “Convert to JPG” and save the result. It opens everywhere: Windows, Android, old software, web uploads.",
    },
  ],
  useCases: [
    {
      t: "Sharing with non-iPhone friends",
      d: "Sent a HEIC to someone on Android or Windows and they can't open it? Convert once and resend — problem gone.",
    },
    {
      t: "Websites that reject HEIC",
      d: "Job portals, government forms, and print shops often accept only JPG/PNG. Convert before you upload and skip the error message.",
    },
    {
      t: "Older photo software",
      d: "Some desktop editors and viewers still don't speak HEIC. A JPG drops straight into any of them with no plugins.",
    },
    {
      t: "Email attachments",
      d: "Recipients shouldn't need a converter to see your photos. JPG attachments open in every mail app ever made.",
    },
    {
      t: "Future-proof archiving",
      d: "HEIC is efficient but young. Keeping JPG copies of important photos means they'll open on whatever device you own in ten years.",
    },
  ],
  faqs: [
    {
      q: "What is a HEIC file?",
      a: "HEIC (High Efficiency Image Container) is Apple's photo format, default on iPhones since iOS 11. It stores better quality in smaller files than JPG, but many Windows apps, websites, and older devices can't open it — which is why converting to JPG is so common.",
    },
    {
      q: "Will converting to JPG reduce quality?",
      a: "Barely. HEIC to JPG is a re-encode, but at the default 92% quality the result is visually identical to the original for normal viewing and printing. You'd need to pixel-peep at 200% zoom to spot any difference.",
    },
    {
      q: "Why did my HEIC file fail to convert?",
      a: "A few HEIC variants — 10-bit photos, files from certain third-party encoders, and multi-image HEIC sequences — can't be decoded inside a browser. The fix is easy: open the photo in your phone's Photos app, use Share → Save/Export as JPG, and convert that instead.",
    },
    {
      q: "Is there a file size limit?",
      a: "Yes — 100 MB per file, which is generous: a typical iPhone HEIC photo is 1–4 MB. The limit exists because decoding happens in your browser's memory.",
    },
    {
      q: "Are my photos uploaded anywhere?",
      a: "No. The heic2any decoding engine runs entirely on your device. Your photos never leave your browser, are never stored on a server, and can't be seen by anyone else.",
    },
    {
      q: "Can I convert HEIC to PNG instead?",
      a: "Yes — our all-in-one image converter handles HEIC → PNG, WebP, and JPG in one place, if you need a lossless format instead.",
    },
  ],
  privacyNote:
    "HEIC decoding runs 100% in your browser with the heic2any engine. Your photos are never uploaded to any server.",
};

export const metadata = convPageMeta(spec);

export default function HeicToJpgPage() {
  return (
    <>
      <JsonLd data={softwareAppJsonLd(spec.tool, "UtilitiesApplication")} />
      <ConvPage spec={spec}>
        <ToolClient />
      </ConvPage>
    </>
  );
}
