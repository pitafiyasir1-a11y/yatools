"use client";

import ImgConvClient, { type ImgConvConfig } from "../_imgconv/ImgConvClient";

const config: ImgConvConfig = {
  sourceKind: "standard",
  sourceExts: [".jpg", ".jpeg"],
  sourceTypes: ["image/jpeg"],
  sourceLabel: "a JPG image",
  targetMime: "image/png",
  targetExt: "png",
  targetLabel: "PNG",
  decodeFailedMessage:
    "That file couldn't be read as an image — it may be corrupted or not a real JPG file.",
  convertLabel: "Convert to PNG",
  acceptLine: ".jpg and .jpeg files",
};

export default function JpgToPngClient() {
  return <ImgConvClient config={config} />;
}
