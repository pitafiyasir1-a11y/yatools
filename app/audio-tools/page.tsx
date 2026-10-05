import { pageMeta } from "@/lib/site";
import HubPage, { type HubConfig } from "../hubs/HubPage";

export const metadata = pageMeta({
  title: "Free Audio Tools Online — Text to Speech & More",
  description:
    "Free audio tools online: text to speech, voice dictation, and audio file conversion. Turn text into voice or voice into text — no sign-up, try it now.",
  path: "/audio-tools",
  keywords: [
    "free audio tools online",
    "text to speech online free",
    "audio to text online",
    "voice to text free",
    "tts online free",
  ],
});

const config: HubConfig = {
  path: "/audio-tools",
  hubName: "Audio Tools",
  title: "Free Audio Tools Online",
  description:
    "Free online audio tools: convert text to speech, dictate voice to text, and convert audio files to MP3 — right in your browser.",
  intro: [
    "Free audio tools online turn text into spoken voice and spoken voice into text, without installing anything. The collection here covers the two directions: text-to-speech reads your words aloud for proofreading, accessibility, or making voiceovers, while audio-to-text (dictation) types what you say through your microphone.",
    "Text to speech here uses your browser's built-in voices, so it works offline, costs nothing, and sends none of your text to a server. The voices vary by device — phones and laptops each ship their own set — but for listening back to an article, checking how an email sounds, or helping someone read more easily, they do the job well.",
    "Dictation mode is handy when typing is slow or awkward: speak into your microphone and watch the words appear. It needs an internet connection for recognition on most browsers, and a quiet room plus a clear voice makes a big difference to accuracy.",
  ],
  slugs: ["text-to-speech", "audio-to-text", "audio-to-mp3"],
  chooseTitle: "How to choose the right audio tool",
  chooseIntro:
    "Decide which direction your audio needs to go: text into voice, or voice into text.",
  choose: [
    {
      title: "Text to speech: listen before you publish",
      body: "Paste any text and hear it read aloud. Writers use it to catch awkward sentences, students use it to listen to notes, and creators use it for quick voiceovers.",
    },
    {
      title: "Dictation: type with your voice",
      body: "Use audio-to-text when you want to speak instead of type — notes, messages, or drafts. Speak punctuation like 'comma' and 'full stop' for cleaner results.",
    },
    {
      title: "Browser voices differ by device",
      body: "The available voices and languages depend on your phone or computer, not on this site. If a voice sounds robotic, check your device's speech settings for higher-quality options.",
    },
    {
      title: "Accuracy tips for dictation",
      body: "Speak at a normal pace in a quiet room, stay close to the microphone, and correct mistakes as you go. Heavy background noise is the number one cause of bad transcription.",
    },
  ],
  faqs: [
    {
      q: "Are these audio tools free?",
      a: "Yes — text to speech and voice dictation are completely free with no sign-up. Speech runs through your browser's built-in engine, so there are no usage limits or fees.",
    },
    {
      q: "Is my voice or text sent to a server?",
      a: "Text-to-speech runs fully offline in your browser: your text never leaves the device. Dictation uses your browser's speech recognition, which on most browsers processes audio through the browser maker's cloud service.",
    },
    {
      q: "Which languages does text to speech support?",
      a: "The available voices and languages come from your device's operating system, so they differ between phones and computers. Most devices include English plus several other major languages, including Urdu on many Android phones.",
    },
    {
      q: "Can I download the spoken audio as a file?",
      a: "Browser-based speech plays the voice live rather than producing a downloadable file. If you need an MP3 of the narration, you can record your device's audio output while it plays.",
    },
  ],
};

export default function AudioToolsPage() {
  return <HubPage config={config} />;
}
