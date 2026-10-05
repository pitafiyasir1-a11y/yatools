/* Pure ffmpeg argument builders for the dedicated video → MP4 converter
 * pages (mkv-to-mp4-converter, mov-to-mp4-converter).
 *
 * Strategy: try a lossless `-c copy` remux first (instant, original quality),
 * and fall back to a full H.264 + AAC re-encode when the source's streams
 * don't fit the MP4 container (e.g. HEVC video, Opus audio, odd codecs).
 */

export function remuxArgs(input: string, output: string): string[] {
  return ["-i", input, "-c", "copy", "-movflags", "+faststart", output];
}

export function reencodeArgs(input: string, output: string): string[] {
  return [
    "-i",
    input,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "23",
    "-preset",
    "veryfast",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    output,
  ];
}
