import { pageMeta } from "@/lib/site";
import HubPage, { type HubConfig } from "../hubs/HubPage";

export const metadata = pageMeta({
  title: "Free Video Tools Online — MP3, GIF, Trim & Compress",
  description:
    "Free video tools online: convert MP4 to MP3, make GIFs, trim clips, and compress videos in your browser. No sign-up needed — all free, start editing now.",
  path: "/video-tools",
  keywords: [
    "free video tools online",
    "mp4 to mp3 online free",
    "video to gif online",
    "trim video online",
    "compress video online",
  ],
});

const config: HubConfig = {
  path: "/video-tools",
  hubName: "Video Tools",
  title: "Free Video Tools Online",
  description:
    "Free online video tools: convert MP4 to MP3, turn video into GIFs, trim clips, compress files, and download from popular platforms.",
  intro: [
    "Free video tools online cover the small editing jobs you shouldn't need a heavy app for: pulling the audio out of a video as an MP3, cutting a clip shorter, turning a funny moment into a GIF, or shrinking a file so it can be sent on WhatsApp. This collection puts those jobs in your browser, one click at a time.",
    "Most of the video tools here run entirely on your device using in-browser processing. That keeps your footage private — nothing is uploaded to a server — but it does mean large files take real time to process, since your computer is doing the encoding work. Plan for a wait on long videos, and keep the tab open while a tool works.",
    "One honest note: in-browser video conversion is slower than desktop software and works best for short clips (under a few minutes). For quick tasks like extracting audio, making GIFs, or trimming the start and end off a recording, it is more than enough — and it costs nothing.",
  ],
  slugs: [
    "universal-downloader",
    "mp4-to-mp3-converter",
    "video-to-gif-converter",
    "video-trimmer",
    "video-converter",
    "video-compressor",
    "gif-to-mp4-converter",
  ],
  chooseTitle: "How to choose the right video tool",
  chooseIntro:
    "Video jobs differ in what they keep: picture, sound, or both. Match the tool to what you want out of it.",
  choose: [
    {
      title: "Extracting audio vs. converting formats",
      body: "MP4 to MP3 pulls just the sound out of a video — perfect for lectures, podcasts, and music. The video converter changes the file's format or encoding while keeping the picture.",
    },
    {
      title: "Trimming before compressing",
      body: "Cut unwanted parts off first with the video trimmer, then compress. Trimming removes whole sections, which shrinks the file far more effectively than compression alone.",
    },
    {
      title: "GIFs are for moments, not movies",
      body: "Video to GIF works best on short clips (a few seconds). GIFs have no sound and get huge quickly, so keep them short and small — ideal for reactions and memes, terrible for full videos.",
    },
    {
      title: "Only download what you have rights to",
      body: "The universal downloader is for saving videos you own or that are freely licensed. Downloading copyrighted videos from streaming platforms may violate their terms of service.",
    },
  ],
  faqs: [
    {
      q: "Are these video tools free?",
      a: "Yes. All video tools on this page are free with no sign-up. Processing happens in your browser, so there are no server costs — just allow some time for large files to encode.",
    },
    {
      q: "Is my video uploaded to a server?",
      a: "No. The MP3, GIF, trim, convert, and compress tools process your video locally in your browser. Your footage never leaves your device, which keeps private recordings private.",
    },
    {
      q: "Why is video conversion slow?",
      a: "Encoding video is heavy work, and here your own device is doing it instead of a powerful server. Short clips finish quickly; long or high-resolution videos take longer. Keep the tab open while it processes.",
    },
    {
      q: "What is the best format for sharing a video on WhatsApp?",
      a: "WhatsApp compresses videos itself, but starting with an MP4 helps. If a video won't send, use the video compressor first to shrink it below the app's size limit.",
    },
  ],
};

export default function VideoToolsPage() {
  return <HubPage config={config} />;
}
