"use client";

import AudioMp3Client, { type AudioMp3Config } from "../_conv-shared/AudioMp3Client";

const config: AudioMp3Config = {
  controlPrefix: "w2m",
  inputLabel: "WAV",
  accept: ".wav,audio/wav,audio/x-wav",
  extPattern: /\.wav$/i,
  wrongFormatError:
    "That doesn't look like a WAV file — this page converts .wav files only. Please choose a .wav file.",
  dropTitle: "Drop in a WAV file",
  dropHint:
    "WAV files up to ~50MB. Decoded and encoded 100% in your browser with the LAME encoder — your file never leaves this device.",
  decodeHint:
    "Your browser couldn't decode that WAV. It may be corrupted, or use an unusual encoding — try a different file.",
};

export default function WavToMp3ToolClient() {
  return <AudioMp3Client config={config} />;
}
