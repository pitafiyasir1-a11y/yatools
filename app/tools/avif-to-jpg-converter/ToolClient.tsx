"use client";

import ImgConvClient, { type ImgConvConfig } from "../_imgconv/ImgConvClient";

const config: ImgConvConfig = {
  sourceKind: "avif",
  sourceExts: [".avif"],
  sourceTypes: ["image/avif"],
  sourceLabel: "an AVIF image",
  targetMime: "image/jpeg",
  targetExt: "jpg",
  targetLabel: "JPG",
  qualityDefault: 0.9,
  backgroundDefault: "#ffffff",
  decodeFailedMessage:
    "Your browser couldn't decode that AVIF file. Try a recent Chromium-based browser (Chrome, Edge) — AVIF decoding needs a modern engine.",
  convertLabel: "Convert to JPG",
  acceptLine: ".avif files (still images)",
};

export default function AvifToJpgClient() {
  return <ImgConvClient config={config} />;
}
