"use client";

import ImgConvClient, { type ImgConvConfig } from "../_imgconv/ImgConvClient";

const config: ImgConvConfig = {
  sourceKind: "standard",
  sourceExts: [".png"],
  sourceTypes: ["image/png"],
  sourceLabel: "a PNG image",
  targetMime: "image/jpeg",
  targetExt: "jpg",
  targetLabel: "JPG",
  qualityDefault: 0.9,
  backgroundDefault: "#ffffff",
  decodeFailedMessage:
    "That file couldn't be read as an image — it may be corrupted or not a real PNG file.",
  convertLabel: "Convert to JPG",
  acceptLine: ".png files",
};

export default function PngToJpgClient() {
  return <ImgConvClient config={config} />;
}
