import { pageMeta } from "@/lib/site";
import HubPage, { type HubConfig } from "../hubs/HubPage";

export const metadata = pageMeta({
  title: "Free Image Tools Online — Convert, Compress & Resize",
  description:
    "Free image tools online: convert formats, compress, resize, crop, and remove backgrounds in your browser. No sign-up, no watermarks — try one free now.",
  path: "/image-tools",
  keywords: [
    "free image tools online",
    "image converter online free",
    "compress image online",
    "resize image online",
    "image format converter",
  ],
});

const config: HubConfig = {
  path: "/image-tools",
  hubName: "Image Tools",
  title: "Free Image Tools Online",
  description:
    "Free online image tools: convert formats, compress, resize, crop, flip, remove backgrounds, and generate or scan QR codes — all in your browser.",
  intro: [
    "Free image tools online handle the format chores that come up constantly: a photo saved as HEIC that won't upload, a PNG that is too big to email, a WebP you need as a JPG. This collection converts between common formats (JPG, PNG, WebP, HEIC, AVIF, SVG, TIFF), compresses files to smaller sizes, resizes dimensions, crops, flips, inverts, and removes backgrounds — without installing anything.",
    "Almost everything here runs 100% in your browser, which matters twice for images: your photos are never uploaded anywhere, and there are no server-side queues or watermarks. The converters re-encode the file locally and hand you the result as a download, so even private photos and screenshots are safe to process.",
    "Beyond the basics you also get handy extras: AI image generation, text extraction from images, text rendered onto images, QR code generation and scanning, and a simple upscaler for making small pictures usable at larger sizes. Each tool is one click away below, with its own dedicated page.",
  ],
  slugs: [
    "image-converter",
    "image-compressor",
    "image-resizer",
    "image-cropper",
    "background-remover",
    "image-upscaler",
    "invert-image",
    "mirror-image",
    "text-to-image",
    "image-to-text",
    "qr-code-generator",
    "qr-scanner",
    "ai-image-generator",
    "heic-to-jpg-converter",
    "heic-to-png-converter",
    "jpg-to-png-converter",
    "png-to-jpg-converter",
    "webp-to-jpg-converter",
    "jpg-to-webp-converter",
    "avif-to-jpg-converter",
    "svg-to-png-converter",
    "png-to-svg-converter",
    "tiff-to-jpg-converter",
  ],
  chooseTitle: "How to choose the right image tool",
  chooseIntro:
    "Pick the tool that matches your actual goal — resizing, re-encoding, and compressing are three different jobs.",
  choose: [
    {
      title: "Converting formats vs. compressing",
      body: "Use a converter (JPG to PNG, WebP to JPG, HEIC to JPG…) when a site or app rejects your file type. Use the compressor when the format is fine but the file is too large to upload or email.",
    },
    {
      title: "JPG or PNG — which to convert to?",
      body: "Choose JPG for photos: it makes much smaller files with barely visible quality loss. Choose PNG for graphics, logos, and screenshots with text — or anything that needs a transparent background.",
    },
    {
      title: "Resizing vs. cropping",
      body: "Resizing scales the whole image up or down. Cropping cuts out a region. If a profile picture looks wrong, you usually need to crop first (to get the right shape) and then resize.",
    },
    {
      title: "What upscaling can and can't do",
      body: "The image upscaler enlarges small images so they look acceptable at bigger sizes, but it can't invent detail that isn't there. Results are best for simple graphics and decent-quality photos, not heavily compressed thumbnails.",
    },
  ],
  faqs: [
    {
      q: "Are these image tools free?",
      a: "Yes — every image tool on this page is free, with no sign-up and no watermarks. Conversion and compression happen in your browser, so there are no server costs to pass on.",
    },
    {
      q: "Are my photos uploaded to a server?",
      a: "No. The converters, compressor, resizer, and editors process your images locally in your browser tab. Your photos never leave your device.",
    },
    {
      q: "Why won't a website accept my iPhone photo?",
      a: "iPhones save photos as HEIC by default, and many sites only accept JPG or PNG. Use HEIC to JPG to convert the file in your browser — the photo stays on your device and comes out as a widely accepted JPG.",
    },
    {
      q: "Does converting between formats lose quality?",
      a: "Converting between lossy formats (like JPG to WebP) can lose a little quality each time. Converting to or from PNG is lossless. For best results, convert from the original file rather than re-converting an already converted one.",
    },
  ],
};

export default function ImageToolsPage() {
  return <HubPage config={config} />;
}
