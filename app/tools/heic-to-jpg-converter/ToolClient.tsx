"use client";

import ImgConvClient, { type ImgConvConfig } from "../_imgconv/ImgConvClient";

const config: ImgConvConfig = {
  sourceKind: "heic",
  sourceExts: [".heic", ".heif"],
  sourceTypes: ["image/heic", "image/heif"],
  sourceLabel: "a HEIC photo",
  targetMime: "image/jpeg",
  targetExt: "jpg",
  targetLabel: "JPG",
  qualityDefault: 0.92,
  decodeFailedMessage:
    "That file couldn't be read as a HEIC image — it may be corrupted or a different format wearing a .heic name.",
  convertLabel: "Convert to JPG",
  acceptLine: ".heic and .heif files",
};

export default function HeicToJpgClient() {
  return <ImgConvClient config={config} />;
}
