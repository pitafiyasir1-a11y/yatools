"use client";

import VideoMp4Client, { type VideoMp4Config } from "../_conv-shared/VideoMp4Client";

const config: VideoMp4Config = {
  inputLabel: "MKV",
  inputExt: ".mkv",
  accept: ".mkv,video/x-matroska",
  extPattern: /\.mkv$/i,
  wrongFormatError:
    "That doesn't look like an MKV file — this page converts .mkv files only. Please choose a .mkv file.",
  dropTitle: "Drop in an MKV file",
  dropHint:
    "MKV files up to ~50MB. Converted 100% in your browser with ffmpeg — your file never leaves this device. First run loads the video engine (~30 MB), once.",
  strategyNote:
    "we first try a lossless remux (repackaging your video and audio streams into an MP4 without re-encoding — instant, original quality). If your MKV's codecs don't fit the MP4 container, we re-encode to H.264 + AAC instead. The result tells you which path was taken.",
};

export default function MkvToMp4ToolClient() {
  return <VideoMp4Client config={config} />;
}
