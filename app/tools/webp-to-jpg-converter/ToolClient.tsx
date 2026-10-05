"use client";

import ImgConvClient, { type ImgConvConfig } from "../_imgconv/ImgConvClient";

const config: ImgConvConfig = {
  sourceKind: "standard",
  sourceExts: [".webp"],
  sourceTypes: ["image/webp"],
  sourceLabel: "a WebP image",
  targetMime: "image/jpeg",
  targetExt: "jpg",
  targetLabel: "JPG",
  qualityDefault: 0.9,
  backgroundDefault: "#ffffff",
  decodeFailedMessage:
    "That file couldn't be read as an image — it may be corrupted, or an animated WebP your browser can't decode.",
  convertLabel: "Convert to JPG",
  acceptLine: ".webp files (still images)",
};

export default function WebpToJpgClient() {
  return <ImgConvClient config={config} />;
}
