"use client";

import ImgConvClient, { type ImgConvConfig } from "../_imgconv/ImgConvClient";

const config: ImgConvConfig = {
  sourceKind: "svg",
  sourceExts: [".svg"],
  sourceTypes: ["image/svg+xml"],
  sourceLabel: "an SVG file",
  targetMime: "image/png",
  targetExt: "png",
  targetLabel: "PNG",
  sizeOptions: [
    { label: "512 px", width: 512 },
    { label: "1024 px", width: 1024 },
    { label: "2048 px", width: 2048 },
    { label: "4096 px", width: 4096 },
  ],
  decodeFailedMessage:
    "That file couldn't be read as an SVG — make sure it's a valid .svg file, not an HTML page saved with the wrong extension.",
  convertLabel: "Convert to PNG",
  acceptLine: ".svg vector files",
};

export default function SvgToPngClient() {
  return <ImgConvClient config={config} />;
}
