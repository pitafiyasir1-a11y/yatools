import { TOOLS, type ToolDef } from "./site";

/* Extra search terms per tool, so visitors find tools even when they use
   different words than the tool's name — e.g. "insta downloader" finds the
   Universal Downloader, "dp" finds the profile-picture helpers, etc. */
const SYNONYMS: Record<string, string[]> = {
  "website-screenshot": ["webpage capture", "site snapshot", "url to image", "page capture", "screenshot url"],
  "audio-to-text": ["transcribe", "transcription", "speech to text", "voice to text", "dictation", "subtitles", "srt"],
  "text-to-speech": ["tts", "voice generator", "read aloud", "narrate", "voiceover"],
  "urdu-handwriting": ["urdu calligraphy", "urdu text style", "handwriting generator"],
  "wikipedia-to-pdf": ["wiki pdf", "wikipedia download", "article to pdf"],
  "n8n-workflow-search": ["automation", "workflows", "n8n templates", "zapier alternative"],
  "ai-image-generator": ["text to image ai", "ai art", "generate picture", "midjourney alternative", "dalle"],
  "movie-tv-search": ["film search", "series finder", "imdb", "what to watch"],
  "qr-code-generator": ["qr maker", "create qr", "barcode"],
  "qr-scanner": ["qr reader", "scan qr", "decode qr"],
  "word-counter": ["character count", "count words", "wordcount"],
  "json-formatter": ["json beautifier", "json validator", "pretty json", "json lint"],
  "password-generator": ["random password", "strong password", "secure password", "passgen"],
  "case-converter": ["uppercase lowercase", "title case", "camelcase", "change case"],
  "color-picker": ["hex picker", "colour", "eyedropper", "rgb hex"],
  "certificate-maker": ["diploma maker", "award certificate", "certification"],
  "ai-vision-chat": ["image chat", "ask ai about image", "vision ai", "describe image"],
  "text-to-pdf": ["txt to pdf", "notepad to pdf", "text document pdf"],
  "background-remover": ["remove bg", "transparent background", "cutout", "bg remover", "remove background from image"],
  "image-compressor": ["reduce image size", "compress jpg", "make image smaller", "optimize image", "shrink photo"],
  "image-converter": ["change image format", "convert picture"],
  "image-resizer": ["resize photo", "change image dimensions", "scale image"],
  "unit-converter": ["convert units", "km to miles", "kg to lbs", "celsius fahrenheit"],
  "merge-pdf": ["combine pdf", "join pdf", "merge documents"],
  "split-pdf": ["separate pdf", "extract pdf pages", "divide pdf"],
  "compress-pdf": ["reduce pdf size", "shrink pdf", "optimize pdf", "make pdf smaller"],
  "image-to-pdf": ["jpg to pdf", "png to pdf", "photo to pdf", "images to pdf"],
  "pdf-to-jpg": ["pdf to image", "convert pdf to picture", "pdf to jpeg"],
  "pdf-to-png-converter": ["pdf to image", "pdf to png"],
  "rotate-pdf": ["rotate pages", "turn pdf"],
  "invert-image": ["negative image", "invert colors", "photo negative"],
  "mirror-image": ["flip image", "mirror photo", "reverse image"],
  "image-cropper": ["crop photo", "trim image", "cut picture"],
  "text-to-image": ["text to picture", "word art", "text image generator"],
  "image-to-text": ["ocr", "extract text from image", "image text extractor", "photo to text"],
  "universal-downloader": [
    "instagram downloader", "insta downloader", "insta", "instagram reels download",
    "facebook downloader", "fb downloader", "youtube downloader", "yt downloader",
    "tiktok downloader", "video downloader", "download video", "save video",
    "reels downloader", "shorts downloader", "status downloader", "social media downloader",
  ],
  "temp-mail": ["temporary email", "disposable email", "fake email", "throwaway email", "10 minute mail", "guerrilla mail"],
  "heic-to-jpg-converter": ["iphone photo converter", "heic to jpeg", "ios image"],
  "heic-to-png-converter": ["iphone photo to png", "heic to png"],
  "jpg-to-png-converter": ["jpeg to png", "jpg to png"],
  "png-to-jpg-converter": ["png to jpeg", "png to jpg"],
  "webp-to-jpg-converter": ["webp to jpeg"],
  "jpg-to-webp-converter": ["jpeg to webp", "jpg to webp"],
  "avif-to-jpg-converter": ["avif to jpeg"],
  "svg-to-png-converter": ["vector to png", "svg to image"],
  "png-to-svg-converter": ["image to vector", "vectorize", "png to vector"],
  "tiff-to-jpg-converter": ["tif to jpg", "tiff to jpeg"],
  "image-upscaler": ["upscale image", "enhance photo", "increase resolution", "hd image", "ai upscaler"],
  "mp4-to-mp3-converter": ["extract audio", "video to audio", "mp4 to audio", "convert video to mp3"],
  "video-to-gif-converter": ["mp4 to gif", "video to gif", "make gif", "animated gif"],
  "video-trimmer": ["cut video", "trim mp4", "shorten video", "crop video"],
  "video-converter": ["convert video format", "mp4 converter", "change video format"],
  "video-compressor": ["reduce video size", "compress mp4", "shrink video", "make video smaller"],
  "gif-to-mp4-converter": ["gif to video"],
  "mkv-to-mp4-converter": ["mkv to mp4"],
  "mov-to-mp4-converter": ["mov to mp4", "iphone video to mp4", "quicktime to mp4"],
  "audio-to-mp3": ["convert audio", "audio converter", "sound to mp3"],
  "wav-to-mp3-converter": ["wav to mp3"],
  "m4a-to-mp3-converter": ["m4a to mp3", "apple audio to mp3"],
  "flac-to-mp3-converter": ["flac to mp3"],
  "base64-encoder-decoder": ["base64 encode", "base64 decode", "b64"],
  "url-encoder-decoder": ["url encode", "percent encoding", "encode url"],
  "html-encoder-decoder": ["html entities", "escape html"],
  "unix-timestamp-converter": ["epoch converter", "timestamp to date", "unixtime"],
  "lorem-ipsum-generator": ["dummy text", "placeholder text", "lipsum"],
  "slug-generator": ["url slug", "permalink generator"],
  "markdown-to-html-converter": ["md to html"],
  "html-to-markdown-converter": ["html to md"],
  "pdf-to-word-converter": ["pdf to docx", "pdf to word", "convert pdf to word"],
  "pdf-to-word-ocr": ["scanned pdf to word", "ocr pdf"],
  "word-to-pdf-converter": ["docx to pdf", "word to pdf", "doc to pdf"],
  "word-to-jpg-converter": ["docx to jpg", "word to image"],
  "excel-to-pdf-converter": ["xlsx to pdf", "spreadsheet to pdf", "excel to pdf"],
  "excel-to-jpg-converter": ["xlsx to jpg", "spreadsheet to image"],
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface IndexedTool {
  tool: ToolDef;
  name: string;
  keyword: string;
  tagline: string;
  category: string;
  desc: string;
  synonyms: string[];
}

let index: IndexedTool[] | null = null;

function getIndex(): IndexedTool[] {
  if (!index) {
    index = TOOLS.map((tool) => ({
      tool,
      name: normalize(tool.name),
      keyword: normalize(tool.keyword),
      tagline: normalize(tool.tagline),
      category: normalize(tool.category),
      desc: normalize(tool.description),
      synonyms: (SYNONYMS[tool.slug] ?? []).map(normalize),
    }));
  }
  return index;
}

/** True when the query token appears in the text, or starts any word of it
    ("insta" matches "instagram", "down" matches "downloader"). */
function tokenHits(token: string, text: string): boolean {
  if (!token || !text) return false;
  if (text.includes(token)) return true;
  return text.split(" ").some((w) => w.startsWith(token));
}

function tokenScore(token: string, t: IndexedTool): number {
  let s = 0;
  if (tokenHits(token, t.name)) s += 5;
  if (tokenHits(token, t.keyword)) s += 4;
  if (t.synonyms.some((syn) => tokenHits(token, syn))) s += 3;
  if (tokenHits(token, t.tagline)) s += 2;
  if (tokenHits(token, t.category)) s += 2;
  if (tokenHits(token, t.desc)) s += 1;
  return s;
}

/** Ranked search over all tools. Every query word must match somewhere;
   results are ordered by relevance. Empty query returns []. */
export function searchTools(query: string): ToolDef[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return [];
  const scored: { tool: ToolDef; score: number }[] = [];
  for (const t of getIndex()) {
    let score = 0;
    let allMatch = true;
    for (const token of tokens) {
      const ts = tokenScore(token, t);
      if (ts === 0) {
        allMatch = false;
        break;
      }
      score += ts;
    }
    if (allMatch) scored.push({ tool: t.tool, score });
  }
  scored.sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name));
  return scored.map((s) => s.tool);
}
