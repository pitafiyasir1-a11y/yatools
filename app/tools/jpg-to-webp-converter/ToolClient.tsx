"use client";

import ImgConvClient, { type ImgConvConfig } from "../_imgconv/ImgConvClient";

const config: ImgConvConfig = {
  sourceKind: "standard",
  sourceExts: [".jpg", ".jpeg"],
  sourceTypes: ["image/jpeg"],
  sourceLabel: "a JPG image",
  targetMime: "image/webp",
  targetExt: "webp",
  targetLabel: "WebP",
  qualityDefault: 0.85,
  decodeFailedMessage:
    "That file couldn't be read as an image — it may be corrupted or not a real JPG file.",
  convertLabel: "Convert to WebP",
  acceptLine: ".jpg and .jpeg files",
};

export default function JpgToWebpClient() {
  return <ImgConvClient config={config} />;
}
