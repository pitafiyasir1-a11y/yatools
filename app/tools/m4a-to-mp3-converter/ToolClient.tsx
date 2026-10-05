"use client";

import AudioMp3Client, { type AudioMp3Config } from "../_conv-shared/AudioMp3Client";

const config: AudioMp3Config = {
  controlPrefix: "m2m",
  inputLabel: "M4A",
  accept: ".m4a,audio/mp4,audio/x-m4a",
  extPattern: /\.m4a$/i,
  wrongFormatError:
    "That doesn't look like an M4A file — this page converts .m4a files only. Please choose a .m4a file.",
  dropTitle: "Drop in an M4A file",
  dropHint:
    "M4A files up to ~50MB — voice memos, music, recordings. Decoded and encoded 100% in your browser with the LAME encoder — your file never leaves this device.",
  decodeHint:
    "Your browser couldn't decode that M4A. Firefox can't decode M4A in-browser — open this tool in Chrome, Edge, or Safari instead. The file may also be corrupted.",
  caveat: "Firefox can't decode M4A in-browser — use Chrome/Edge/Safari for M4A files.",
};

export default function M4aToMp3ToolClient() {
  return <AudioMp3Client config={config} />;
}
