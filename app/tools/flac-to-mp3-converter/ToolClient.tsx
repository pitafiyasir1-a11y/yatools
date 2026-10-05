"use client";

import AudioMp3Client, { type AudioMp3Config } from "../_conv-shared/AudioMp3Client";

const config: AudioMp3Config = {
  controlPrefix: "f2m",
  inputLabel: "FLAC",
  accept: ".flac,audio/flac,audio/x-flac",
  extPattern: /\.flac$/i,
  wrongFormatError:
    "That doesn't look like a FLAC file — this page converts .flac files only. Please choose a .flac file.",
  dropTitle: "Drop in a FLAC file",
  dropHint:
    "FLAC files up to ~50MB. Decoded losslessly and encoded 100% in your browser with the LAME encoder — your file never leaves this device.",
  decodeHint:
    "Your browser couldn't decode that FLAC. It may be corrupted or use an unusual encoding — try a different file, or use Chrome or Edge.",
};

export default function FlacToMp3ToolClient() {
  return <AudioMp3Client config={config} />;
}
