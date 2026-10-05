"use client";

import VideoMp4Client, { type VideoMp4Config } from "../_conv-shared/VideoMp4Client";

const config: VideoMp4Config = {
  inputLabel: "MOV",
  inputExt: ".mov",
  accept: ".mov,video/quicktime",
  extPattern: /\.mov$/i,
  wrongFormatError:
    "That doesn't look like a MOV file — this page converts .mov files only. Please choose a .mov file.",
  dropTitle: "Drop in a MOV file",
  dropHint:
    "MOV files up to ~50MB — including iPhone videos. Converted 100% in your browser with ffmpeg — your file never leaves this device. First run loads the video engine (~30 MB), once.",
  strategyNote:
    "we first try a lossless remux (repackaging your video and audio streams into an MP4 without re-encoding — instant, original quality). iPhone HEVC clips and MOVs with unusual codecs get re-encoded to H.264 + AAC instead, so they play everywhere. The result tells you which path was taken.",
};

export default function MovToMp4ToolClient() {
  return <VideoMp4Client config={config} />;
}
