import type { Metadata } from "next";

/* ============ YATools site-wide constants & tool registry (single source of truth) ============ */

export const SITE = {
  name: "YATools",
  url: "https://yatools-xyv3.vercel.app",
  description:
    "Free online tools for screenshots, audio, documents, Urdu content, and developers — with simple APIs for integration.",
  tagline: "Free tools for screenshots, audio, documents, and everyday work.",
  email: "yasirabbas@relianceengineering.com.pk",
  owner: "Yasir Abbas",
  locale: "en",
} as const;

export type ToolCategory =
  | "Screenshots & PDF"
  | "Audio & Speech"
  | "Urdu Tools"
  | "Developer Tools"
  | "AI Tools"
  | "Everyday Utilities";

export interface ToolDef {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  keyword: string;
  badge: string;
  badgeColor: "red" | "green" | "blue" | "purple";
  api: string | null; // our proxy route, e.g. "/api/v1/websnap"; null = pure client-side
  related: string[]; // slugs of genuinely related tools
}

export const TOOLS: ToolDef[] = [
  {
    slug: "website-screenshot",
    name: "Website Screenshot",
    tagline: "Capture any URL as a full-page screenshot.",
    description:
      "Turn any public web page into a full-page PNG screenshot. Paste a link, get an image — perfect for client reports, design reviews, and archiving pages.",
    category: "Screenshots & PDF",
    keyword: "website screenshot online",
    badge: "API",
    badgeColor: "blue",
    api: "/api/v1/websnap",
    related: ["wikipedia-to-pdf", "movie-tv-search", "qr-code-generator"],
  },
  {
    slug: "audio-to-text",
    name: "Audio to Text",
    tagline: "Transcribe MP3, WAV, M4A, YouTube links and more into editable text.",
    description:
      "Upload an audio file or paste a YouTube link and get an accurate transcript with optional SRT timestamps. Great for lecture notes, interviews, voice messages, and podcasts.",
    category: "Audio & Speech",
    keyword: "audio to text online",
    badge: "AI",
    badgeColor: "purple",
    api: "/api/v1/transcribe",
    related: ["text-to-speech", "urdu-handwriting", "word-counter"],
  },
  {
    slug: "text-to-speech",
    name: "Text to Speech",
    tagline: "Convert any text into natural-sounding audio.",
    description:
      "Type or paste text and generate lifelike speech in multiple voices and languages. Ideal for video narration, Urdu voiceovers, and accessibility.",
    category: "Audio & Speech",
    keyword: "text to speech online",
    badge: "AI",
    badgeColor: "purple",
    api: "/api/v1/tts",
    related: ["audio-to-text", "urdu-handwriting", "word-counter"],
  },
  {
    slug: "urdu-handwriting",
    name: "Urdu Handwriting",
    tagline: "Turn typed notes into realistic handwriting.",
    description:
      "Convert typed English or Urdu text into realistic handwriting on ruled paper. Download as PNG — perfect for notes, assignments, and study material.",
    category: "Urdu Tools",
    keyword: "urdu handwriting generator",
    badge: "Urdu",
    badgeColor: "green",
    api: "/api/v1/hand",
    related: ["wikipedia-to-pdf", "text-to-speech", "word-counter"],
  },
  {
    slug: "wikipedia-to-pdf",
    name: "Wikipedia to PDF",
    tagline: "Convert any Wikipedia article into a clean PDF.",
    description:
      "Save any Wikipedia article as a beautifully formatted, selectable-text PDF with working links. Perfect for offline reading and study packs.",
    category: "Screenshots & PDF",
    keyword: "wikipedia article to pdf",
    badge: "Docs",
    badgeColor: "blue",
    api: "/api/v1/wikipdf",
    related: ["website-screenshot", "urdu-handwriting", "word-counter"],
  },
  {
    slug: "n8n-workflow-search",
    name: "n8n Workflow Search",
    tagline: "Search thousands of n8n automation workflows.",
    description:
      "Find ready-made n8n workflow templates by keyword, category, complexity, and trigger type. Jump-start your next automation instead of building from zero.",
    category: "Developer Tools",
    keyword: "n8n workflow templates",
    badge: "Dev",
    badgeColor: "red",
    api: "/api/v1/n8n",
    related: ["json-formatter", "website-screenshot", "qr-code-generator"],
  },
  {
    slug: "ai-image-generator",
    name: "AI Image Generator",
    tagline: "Generate images from text prompts, free.",
    description:
      "Describe anything and get a high-quality AI image in seconds. Eleven aspect ratios for thumbnails, reels, posts, and presentations.",
    category: "AI Tools",
    keyword: "free ai image generator",
    badge: "AI",
    badgeColor: "purple",
    api: "/api/v1/tti",
    related: ["website-screenshot", "qr-code-generator", "color-picker"],
  },
  {
    slug: "movie-tv-search",
    name: "Movie & TV Search",
    tagline: "Search movies and shows — ratings, cast, posters.",
    description:
      "Look up movies and TV shows with ratings, genres, cast, and posters. Plan your next watch or research titles for content.",
    category: "AI Tools",
    keyword: "movie tv show search",
    badge: "Media",
    badgeColor: "blue",
    api: "/api/v1/msearch",
    related: ["ai-image-generator", "website-screenshot", "qr-code-generator"],
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    tagline: "Create QR codes for links, text, and Wi-Fi.",
    description:
      "Generate crisp QR codes instantly in your browser — for URLs, plain text, or Wi-Fi credentials. Nothing is uploaded; everything stays on your device.",
    category: "Everyday Utilities",
    keyword: "free qr code generator",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["website-screenshot", "password-generator", "color-picker"],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Count words, characters, and reading time.",
    description:
      "Paste text to count words, characters, sentences, and paragraphs — plus estimated reading time. A must-have for writers, students, and creators.",
    category: "Everyday Utilities",
    keyword: "word counter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["case-converter", "text-to-speech", "audio-to-text"],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    tagline: "Format, validate, and minify JSON.",
    description:
      "Paste raw JSON to pretty-print it, validate it, or minify it for production. Errors are highlighted with clear messages for developers.",
    category: "Developer Tools",
    keyword: "json formatter online",
    badge: "Dev",
    badgeColor: "red",
    api: null,
    related: ["n8n-workflow-search", "word-counter", "case-converter"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    tagline: "Create strong, random passwords.",
    description:
      "Generate cryptographically strong passwords with the options you choose — length, symbols, numbers. Created locally; never sent anywhere.",
    category: "Everyday Utilities",
    keyword: "strong password generator",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["qr-code-generator", "word-counter", "color-picker"],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    tagline: "Convert text between cases in one click.",
    description:
      "Switch text between UPPERCASE, lowercase, Title Case, camelCase, and snake_case instantly. Handy for developers, writers, and data cleanup.",
    category: "Everyday Utilities",
    keyword: "text case converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["word-counter", "json-formatter", "text-to-speech"],
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    tagline: "Pick colors and copy HEX, RGB, HSL codes.",
    description:
      "Choose any color and instantly copy its HEX, RGB, and HSL values. Includes a curated palette of designer-friendly swatches.",
    category: "Everyday Utilities",
    keyword: "color picker hex",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["ai-image-generator", "qr-code-generator", "website-screenshot"],
  },
  {
    slug: "certificate-maker",
    name: "Certificate Maker",
    tagline: "Create fun novelty certificates in seconds.",
    description:
      "Design a novelty certificate with any name, title, and date — pick from 8 styles and download it as PDF, PNG, or JPG. For fun and personal use only.",
    category: "Everyday Utilities",
    keyword: "novelty certificate maker free",
    badge: "Fun",
    badgeColor: "green",
    api: "/api/v1/certificate",
    related: ["ai-image-generator", "urdu-handwriting", "qr-code-generator"],
  },
  {
    slug: "ai-vision-chat",
    name: "AI Vision Chat",
    tagline: "Upload an image and ask AI about it.",
    description:
      "Upload any photo and ask questions about it — describe scenes, read text in images, identify objects. Powered by AI vision, free with fair-use limits.",
    category: "AI Tools",
    keyword: "ai image chat ask questions",
    badge: "AI",
    badgeColor: "purple",
    api: "/api/v1/imgchat",
    related: ["ai-image-generator", "movie-tv-search", "website-screenshot"],
  },
  {
    slug: "text-to-pdf",
    name: "Text to PDF",
    tagline: "Turn styled text into a downloadable PDF.",
    description:
      "Write or paste text, style it with headings, font sizes, and alignment, then download a clean PDF. Everything happens in your browser — nothing is uploaded.",
    category: "Screenshots & PDF",
    keyword: "text to pdf converter free",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["wikipedia-to-pdf", "word-counter", "case-converter"],
  },
  {
    slug: "background-remover",
    name: "Background Remover",
    tagline: "Remove image backgrounds right in your browser.",
    description:
      "Upload a photo and erase its background with an on-device AI model. Your image never leaves your device — processing is 100% local and private.",
    category: "AI Tools",
    keyword: "remove image background free",
    badge: "AI",
    badgeColor: "purple",
    api: null,
    related: ["ai-image-generator", "image-compressor", "image-converter"],
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    tagline: "Shrink image file sizes without visible loss.",
    description:
      "Compress JPG, PNG, and WebP images with a quality slider and live before/after size preview. Files stay on your device — nothing is uploaded.",
    category: "Everyday Utilities",
    keyword: "compress image online free",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-converter", "image-resizer", "background-remover"],
  },
  {
    slug: "image-converter",
    name: "Image Converter",
    tagline: "Convert images between PNG, JPG, and WebP.",
    description:
      "Convert your images between PNG, JPEG, and WebP formats instantly in the browser. Free, private, and no watermarks.",
    category: "Everyday Utilities",
    keyword: "convert image png jpg webp",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-compressor", "image-resizer", "background-remover"],
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    tagline: "Resize images to exact dimensions.",
    description:
      "Set exact width and height — with aspect-ratio lock — and download your resized image. Fast, free, and fully private in-browser processing.",
    category: "Everyday Utilities",
    keyword: "resize image online free",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-compressor", "image-converter", "background-remover"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    tagline: "Convert length, weight, temperature, and data.",
    description:
      "Instantly convert between metric and imperial units — length, weight, temperature, and data storage. Type a number, get every conversion at once.",
    category: "Everyday Utilities",
    keyword: "unit converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["word-counter", "case-converter", "json-formatter"],
  },
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    tagline: "Combine multiple PDFs into one, in your chosen order.",
    description:
      "Merge multiple PDF files into a single PDF document, in the order you choose. Files are combined right in your browser — nothing is uploaded.",
    category: "Screenshots & PDF",
    keyword: "merge pdf online free",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["split-pdf", "rotate-pdf", "text-to-pdf"],
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    tagline: "Extract pages, page ranges, or split a PDF into parts.",
    description:
      "Split a PDF into separate files: extract page ranges, split every N pages, or pick individual pages — all in your browser, free.",
    category: "Screenshots & PDF",
    keyword: "split pdf online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["merge-pdf", "rotate-pdf", "compress-pdf"],
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    tagline: "Shrink PDF file size by cleaning up its structure.",
    description:
      "Reduce PDF file size with honest structural compression: removes unused objects and strips metadata. Runs in your browser, free.",
    category: "Screenshots & PDF",
    keyword: "compress pdf online free",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["merge-pdf", "image-compressor", "image-to-pdf"],
  },
  {
    slug: "image-to-pdf",
    name: "Image to PDF",
    tagline: "Turn JPG, PNG, and WebP images into a single PDF.",
    description:
      "Combine multiple images into one PDF document. Choose page size, orientation, and margins — all in your browser, free.",
    category: "Screenshots & PDF",
    keyword: "jpg to pdf online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["text-to-pdf", "pdf-to-jpg", "merge-pdf"],
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    tagline: "Turn every PDF page into a high-quality JPG image.",
    description:
      "Convert PDF pages to JPG images in your browser. Preview every page, download individually or all at once — free, no uploads.",
    category: "Screenshots & PDF",
    keyword: "pdf to jpg online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-to-pdf", "image-compressor", "image-converter"],
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    tagline: "Rotate all or selected PDF pages 90°, 180°, or 270°.",
    description:
      "Fix sideways or upside-down PDF pages: rotate every page or just the ones you pick — in your browser, free.",
    category: "Screenshots & PDF",
    keyword: "rotate pdf online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["merge-pdf", "split-pdf", "compress-pdf"],
  },
  {
    slug: "qr-scanner",
    name: "QR Code Scanner",
    tagline: "Decode QR codes from photos or your live camera.",
    description:
      "Scan QR codes online: upload an image or use your live camera. Decodes instantly in your browser — free, private, no app needed.",
    category: "Everyday Utilities",
    keyword: "qr code scanner online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["qr-code-generator", "word-counter", "image-converter"],
  },
  {
    slug: "invert-image",
    name: "Invert Image",
    tagline: "Flip any photo into its negative with one click.",
    description:
      "Invert image colors online for free. Upload a photo and flip every pixel to its opposite color — instant photo-negative effect, right in your browser.",
    category: "Everyday Utilities",
    keyword: "invert image colors online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-converter", "image-resizer", "background-remover"],
  },
  {
    slug: "mirror-image",
    name: "Mirror Image",
    tagline: "Flip any photo horizontally or vertically.",
    description:
      "Mirror an image online for free. Flip photos horizontally or vertically with a live preview — great for fixing selfies and creating symmetric edits.",
    category: "Everyday Utilities",
    keyword: "mirror image online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["invert-image", "image-resizer", "image-converter"],
  },
  {
    slug: "image-cropper",
    name: "Image Cropper",
    tagline: "Crop photos to any size with drag-to-select.",
    description:
      "Crop images online for free. Drag to select the exact area, lock aspect ratios like 1:1 or 16:9, preview live, and download the full-resolution crop.",
    category: "Everyday Utilities",
    keyword: "crop image online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-resizer", "invert-image", "mirror-image"],
  },
  {
    slug: "text-to-image",
    name: "Text to Image",
    tagline: "Turn words into shareable typography posters.",
    description:
      "Free text to image generator. Design typography posters with custom fonts, colors, and gradients — square, landscape, or portrait — and download as PNG.",
    category: "Everyday Utilities",
    keyword: "text to image generator",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["qr-code-generator", "text-to-pdf", "word-counter"],
  },
  {
    slug: "image-to-text",
    name: "Image to Text OCR",
    tagline: "Extract editable text from any image.",
    description:
      "Free image to text OCR online. Upload a photo, screenshot, or scan and extract editable English text — right in your browser, no sign-up.",
    category: "Everyday Utilities",
    keyword: "image to text ocr online",
    badge: "AI",
    badgeColor: "purple",
    api: null,
    related: ["audio-to-text", "word-counter", "text-to-pdf"],
  },
  {
    slug: "universal-downloader",
    name: "Universal Downloader",
    tagline: "Get download links for videos and audio.",
    description:
      "Free online video downloader. Paste a link from YouTube, TikTok, Instagram, Facebook, and more to get direct download links — for content you own or have the right to save.",
    category: "Everyday Utilities",
    keyword: "online video downloader",
    badge: "API",
    badgeColor: "blue",
    api: "/api/v1/alldl",
    related: ["website-screenshot", "audio-to-text", "text-to-speech"],
  },
  {
    slug: "temp-mail",
    name: "Temporary Email",
    tagline: "Disposable inboxes for sign-ups, minus the spam.",
    description:
      "Free temporary email generator. Create a disposable address in one click and read incoming mail — receive-only, no sign-up, addresses expire automatically.",
    category: "Everyday Utilities",
    keyword: "temporary email generator",
    badge: "API",
    badgeColor: "blue",
    api: "/api/v1/mail",
    related: ["qr-code-generator", "password-generator", "word-counter"],
  },
  {
    slug: "heic-to-jpg-converter",
    name: "HEIC to JPG Converter",
    tagline: "Turn iPhone HEIC photos into JPGs that open anywhere.",
    description:
      "Free HEIC to JPG converter: turn iPhone and iPad HEIC photos into JPGs that open on any device. Runs entirely in your browser — no uploads, no sign-up.",
    category: "Everyday Utilities",
    keyword: "heic to jpg converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-converter", "jpg-to-png-converter", "image-compressor"],
  },
  {
    slug: "jpg-to-png-converter",
    name: "JPG to PNG Converter",
    tagline: "Convert JPG photos to PNG with zero quality loss.",
    description:
      "Free JPG to PNG converter: change JPG photos into lossless PNG images with every pixel preserved. No uploads, no sign-up, runs in your browser.",
    category: "Everyday Utilities",
    keyword: "jpg to png converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-converter", "png-to-jpg-converter", "image-compressor"],
  },
  {
    slug: "png-to-jpg-converter",
    name: "PNG to JPG Converter",
    tagline: "Shrink PNG screenshots and graphics into lightweight JPGs.",
    description:
      "Free PNG to JPG converter: turn PNG images into compact JPGs with a quality slider and background picker for transparency. All in your browser.",
    category: "Everyday Utilities",
    keyword: "png to jpg converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-converter", "jpg-to-png-converter", "image-compressor"],
  },
  {
    slug: "webp-to-jpg-converter",
    name: "WebP to JPG Converter",
    tagline: "Convert WebP images to JPG for maximum compatibility.",
    description:
      "Free WebP to JPG converter: change modern WebP images into universally compatible JPGs. Runs 100% in your browser — no uploads.",
    category: "Everyday Utilities",
    keyword: "webp to jpg converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-converter", "jpg-to-webp-converter", "image-compressor"],
  },
  {
    slug: "jpg-to-webp-converter",
    name: "JPG to WebP Converter",
    tagline: "Convert JPGs to modern WebP files that load faster.",
    description:
      "Free JPG to WebP converter: shrink JPG photos into smaller, faster-loading WebP images with a quality slider. Private, in-browser, no sign-up.",
    category: "Everyday Utilities",
    keyword: "jpg to webp converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-converter", "webp-to-jpg-converter", "image-compressor"],
  },
  {
    slug: "avif-to-jpg-converter",
    name: "AVIF to JPG Converter",
    tagline: "Convert next-gen AVIF images to JPGs that open everywhere.",
    description:
      "Free AVIF to JPG converter: change AVIF images into universally supported JPGs using your browser's own decoder. No uploads, no sign-up.",
    category: "Everyday Utilities",
    keyword: "avif to jpg converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-converter", "webp-to-jpg-converter", "image-compressor"],
  },
  {
    slug: "svg-to-png-converter",
    name: "SVG to PNG Converter",
    tagline: "Rasterize SVG vectors into crisp PNGs at any size.",
    description:
      "Free SVG to PNG converter: turn vector SVG files into sharp PNG images at sizes up to 4096 px. Transparency preserved, runs in your browser.",
    category: "Everyday Utilities",
    keyword: "svg to png converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-converter", "png-to-jpg-converter", "image-resizer"],
  },
  {
    slug: "pdf-to-png-converter",
    name: "PDF to PNG Converter",
    tagline: "Export every PDF page as a sharp, high-quality PNG.",
    description:
      "Free PDF to PNG converter: render each PDF page as a PNG image at up to 300 DPI. Everything happens in your browser — no uploads.",
    category: "Screenshots & PDF",
    keyword: "pdf to png converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["pdf-to-jpg", "image-to-pdf", "merge-pdf"],
  },
  {
    slug: "image-upscaler",
    name: "AI Image Upscaler",
    tagline: "Enlarge photos 2x with AI — sharper, cleaner, right in your browser.",
    description:
      "AI image upscaler online: enlarge photos 2x with the ESRGAN neural network. Free, private, runs entirely in your browser — no uploads.",
    category: "AI Tools",
    keyword: "ai image upscaler online",
    badge: "AI",
    badgeColor: "purple",
    api: null,
    related: ["background-remover", "image-compressor", "image-converter"],
  },
  {
    slug: "mp4-to-mp3-converter",
    name: "MP4 to MP3 Converter",
    tagline: "Pull the audio out of any video as an MP3 — right in your browser.",
    description:
      "Convert MP4 to MP3 online free: extract audio from video in your browser with ffmpeg. Choose 128–320 kbps quality. No uploads, fully private.",
    category: "Everyday Utilities",
    keyword: "mp4 to mp3 converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["audio-to-mp3", "video-to-gif-converter", "audio-to-text"],
  },
  {
    slug: "video-to-gif-converter",
    name: "Video to GIF Converter",
    tagline: "Turn any video clip into a looping GIF — pick the moment, set the quality.",
    description:
      "Video to GIF converter online free: make GIFs from MP4, WebM, or MOV in your browser. Choose start time, length, fps, and size. No uploads, fully private.",
    category: "Everyday Utilities",
    keyword: "video to gif converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["video-trimmer", "mp4-to-mp3-converter", "video-converter"],
  },
  {
    slug: "video-trimmer",
    name: "Video Trimmer",
    tagline: "Cut out the part you want — frame-accurate trims, exported as MP4.",
    description:
      "Trim video online free: cut MP4, WebM, or MOV clips in your browser with frame-accurate precision. Export as MP4 (H.264 + AAC). No uploads, fully private.",
    category: "Everyday Utilities",
    keyword: "video trimmer online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["video-converter", "mp4-to-mp3-converter", "video-to-gif-converter"],
  },
  {
    slug: "video-converter",
    name: "Video Converter",
    tagline: "Turn MOV, MKV, and WebM into MP4 that plays everywhere.",
    description:
      "Video converter online free: convert MOV, MKV, WebM, and AVI to MP4 (H.264 + AAC) in your browser. Fast remux when possible, re-encode fallback. No uploads.",
    category: "Everyday Utilities",
    keyword: "video converter online free",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["video-trimmer", "mp4-to-mp3-converter", "video-to-gif-converter"],
  },
  {
    slug: "audio-to-mp3",
    name: "Audio to MP3 Converter",
    tagline: "Turn WAV, FLAC, M4A, and OGG into MP3 — in your browser.",
    description:
      "Audio to MP3 converter online free: convert WAV, FLAC, M4A, and OGG to MP3 with the LAME encoder. Choose 96–320 kbps. Runs in your browser, fully private.",
    category: "Audio & Speech",
    keyword: "audio to mp3 converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["mp4-to-mp3-converter", "audio-to-text", "text-to-speech"],
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder & Decoder",
    tagline: "Encode text to Base64, decode it back, or turn files into data URIs.",
    description:
      "Free Base64 encoder and decoder online: convert text to Base64, decode Base64 to text, or encode files as data URIs — instant and private in your browser.",
    category: "Developer Tools",
    keyword: "base64 encode decode online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["url-encoder-decoder", "html-encoder-decoder", "json-formatter"],
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder & Decoder",
    tagline: "Encode or decode URLs and query strings in two modes.",
    description:
      "Free URL encoder and decoder online: percent-encode URLs and query parameters or decode them back — with full-URL and component modes, instant in your browser.",
    category: "Developer Tools",
    keyword: "url encode decode online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["base64-encoder-decoder", "html-encoder-decoder", "slug-generator"],
  },
  {
    slug: "html-encoder-decoder",
    name: "HTML Encoder & Decoder",
    tagline: "Convert HTML to entities and entities back to readable text.",
    description:
      "Free HTML entity encoder and decoder online: escape < > & &#34; ' for safe display or decode named and numeric entities — instant in your browser.",
    category: "Developer Tools",
    keyword: "html encode decode online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["markdown-to-html-converter", "html-to-markdown-converter", "base64-encoder-decoder"],
  },
  {
    slug: "unix-timestamp-converter",
    name: "Unix Timestamp Converter",
    tagline: "Turn epoch timestamps into dates and dates into timestamps.",
    description:
      "Free Unix timestamp converter: epoch to human date and back, with a live current-timestamp ticker, automatic second/millisecond detection, and UTC + local time.",
    category: "Developer Tools",
    keyword: "unix timestamp converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["json-formatter", "url-encoder-decoder", "base64-encoder-decoder"],
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    tagline: "Placeholder text by paragraphs, sentences, or words — one click.",
    description:
      "Free lorem ipsum generator online: generate placeholder text by paragraphs, sentences, or words with one-click copy — instant, no sign-up.",
    category: "Developer Tools",
    keyword: "lorem ipsum generator",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["word-counter", "case-converter", "slug-generator"],
  },
  {
    slug: "slug-generator",
    name: "URL Slug Generator",
    tagline: "Turn any headline into a clean, SEO-friendly URL slug.",
    description:
      "Free URL slug generator: paste a title and get a clean hyphenated slug as you type — with underscore option and length limit, instant in your browser.",
    category: "Developer Tools",
    keyword: "url slug generator",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["url-encoder-decoder", "word-counter", "case-converter"],
  },
  {
    slug: "markdown-to-html-converter",
    name: "Markdown to HTML Converter",
    tagline: "Write Markdown, get clean HTML with a live preview.",
    description:
      "Free Markdown to HTML converter online: live preview plus one-click HTML copy — headings, lists, links, code blocks, and blockquotes, all in your browser.",
    category: "Developer Tools",
    keyword: "markdown to html converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["html-to-markdown-converter", "html-encoder-decoder", "text-to-pdf"],
  },
  {
    slug: "html-to-markdown-converter",
    name: "HTML to Markdown Converter",
    tagline: "Turn messy HTML into clean, readable Markdown.",
    description:
      "Free HTML to Markdown converter online: live conversion of headings, links, lists, code, and formatting — runs in your browser, no sign-up.",
    category: "Developer Tools",
    keyword: "html to markdown converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["markdown-to-html-converter", "html-encoder-decoder", "base64-encoder-decoder"],
  },
  {
    slug: "pdf-to-word-converter",
    name: "PDF to Word Converter",
    tagline: "Extract editable text from any PDF into a real .docx file.",
    description:
      "Convert PDF to Word online for free: extract editable text into a genuine .docx document right in your browser. Private, fast, no sign-up.",
    category: "Screenshots & PDF",
    keyword: "pdf to word converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["word-to-pdf-converter", "text-to-pdf", "pdf-to-jpg"],
  },
  {
    slug: "word-to-pdf-converter",
    name: "Word to PDF Converter",
    tagline: "Turn any .docx into a PDF with your browser's print engine.",
    description:
      "Convert Word to PDF online for free: render your .docx in the browser and save it as PDF via print. Private, fast, no sign-up.",
    category: "Screenshots & PDF",
    keyword: "word to pdf converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["pdf-to-word-converter", "word-to-jpg-converter", "text-to-pdf"],
  },
  {
    slug: "word-to-jpg-converter",
    name: "Word to JPG Converter",
    tagline: "Turn every page of a .docx into a shareable JPG image.",
    description:
      "Convert Word to JPG online for free: render each .docx page as a crisp image in your browser. Choose quality, download individually. No sign-up.",
    category: "Screenshots & PDF",
    keyword: "word to jpg converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["word-to-pdf-converter", "pdf-to-jpg", "image-converter"],
  },
  {
    slug: "excel-to-pdf-converter",
    name: "Excel to PDF Converter",
    tagline: "Turn spreadsheet sheets into clean, printable PDFs.",
    description:
      "Convert Excel to PDF online for free: read .xlsx/.xls/.csv in your browser and save sheets as PDF via print. Private, fast, no sign-up.",
    category: "Screenshots & PDF",
    keyword: "excel to pdf converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["excel-to-jpg-converter", "word-to-pdf-converter", "pdf-to-jpg"],
  },
  {
    slug: "excel-to-jpg-converter",
    name: "Excel to JPG Converter",
    tagline: "Turn spreadsheet sheets into shareable JPG images.",
    description:
      "Convert Excel to JPG online for free: capture .xlsx/.xls/.csv sheets as crisp images in your browser. Quality control, no sign-up.",
    category: "Screenshots & PDF",
    keyword: "excel to jpg converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["excel-to-pdf-converter", "word-to-jpg-converter", "image-converter"],
  },
  {
    slug: "video-compressor",
    name: "Video Compressor",
    tagline: "Shrink MP4, WebM and MOV files online — free, in your browser.",
    description:
      "Free online video compressor: shrink MP4, WebM and MOV files with adjustable quality, right in your browser. No upload, no sign-up, no watermark.",
    category: "Everyday Utilities",
    keyword: "video compressor online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["gif-to-mp4-converter", "image-compressor", "image-converter"],
  },
  {
    slug: "gif-to-mp4-converter",
    name: "GIF to MP4 Converter",
    tagline: "Turn heavy GIFs into tiny MP4 videos — free, in your browser.",
    description:
      "Free online GIF to MP4 converter: turn animated GIFs into small, compatible MP4 videos in your browser. No upload, no sign-up, no watermark.",
    category: "Everyday Utilities",
    keyword: "gif to mp4",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["video-compressor", "image-converter", "image-compressor"],
  },
  {
    slug: "png-to-svg-converter",
    name: "PNG to SVG Converter",
    tagline: "Vectorize logos and icons — PNG to clean, scalable SVG.",
    description:
      "Free online PNG to SVG converter: trace logos, icons and line art into scalable vectors in your browser. No upload, no sign-up. Not for photos.",
    category: "Everyday Utilities",
    keyword: "png to svg",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["image-converter", "image-resizer", "image-compressor"],
  },
  {
    slug: "tiff-to-jpg-converter",
    name: "TIFF to JPG Converter",
    tagline: "Turn TIFF scans and photos into shareable JPGs — even multi-page.",
    description:
      "Free online TIFF to JPG converter: turn .tif/.tiff scans (even multi-page) into shareable JPGs in your browser. No upload, no sign-up.",
    category: "Everyday Utilities",
    keyword: "tiff to jpg",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["pdf-to-jpg", "heic-to-png-converter", "image-converter"],
  },
  {
    slug: "heic-to-png-converter",
    name: "HEIC to PNG Converter",
    tagline: "Open iPhone HEIC photos anywhere — as lossless PNGs.",
    description:
      "Free online HEIC to PNG converter: turn iPhone .heic photos into lossless, universally-compatible PNGs in your browser. No upload, no sign-up.",
    category: "Everyday Utilities",
    keyword: "heic to png",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["tiff-to-jpg-converter", "png-to-svg-converter", "image-converter"],
  },
  {
    slug: "pdf-to-word-ocr",
    name: "PDF to Word (OCR)",
    tagline: "Convert scanned PDFs to editable Word with browser-based OCR.",
    description:
      "Scanned PDF to Word converter online: OCR turns scanned pages into a real editable .docx — free, private, and 100% in your browser.",
    category: "Screenshots & PDF",
    keyword: "scanned pdf to word converter",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["pdf-to-word-converter", "image-to-text", "pdf-to-jpg"],
  },
  {
    slug: "wav-to-mp3-converter",
    name: "WAV to MP3 Converter",
    tagline: "Turn WAV audio into universal MP3 — in your browser.",
    description:
      "WAV to MP3 converter online free: convert WAV to MP3 with the LAME encoder at 128–320 kbps. Runs 100% in your browser — no uploads, no sign-up.",
    category: "Audio & Speech",
    keyword: "wav to mp3 converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["m4a-to-mp3-converter", "flac-to-mp3-converter", "audio-to-mp3"],
  },
  {
    slug: "m4a-to-mp3-converter",
    name: "M4A to MP3 Converter",
    tagline: "Turn M4A audio into universal MP3 — in your browser.",
    description:
      "M4A to MP3 converter online free: convert M4A to MP3 with the LAME encoder at 128–320 kbps. Runs 100% in your browser — no uploads, no sign-up.",
    category: "Audio & Speech",
    keyword: "m4a to mp3 converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["wav-to-mp3-converter", "flac-to-mp3-converter", "audio-to-mp3"],
  },
  {
    slug: "flac-to-mp3-converter",
    name: "FLAC to MP3 Converter",
    tagline: "Turn lossless FLAC into universal MP3 — in your browser.",
    description:
      "FLAC to MP3 converter online free: convert FLAC to MP3 with the LAME encoder at 128–320 kbps. Runs 100% in your browser — no uploads, no sign-up.",
    category: "Audio & Speech",
    keyword: "flac to mp3 converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["wav-to-mp3-converter", "m4a-to-mp3-converter", "audio-to-mp3"],
  },
  {
    slug: "mkv-to-mp4-converter",
    name: "MKV to MP4 Converter",
    tagline: "Turn MKV video into universal MP4 — in your browser.",
    description:
      "MKV to MP4 converter online free: remux MKV to MP4 instantly when possible, re-encode to H.264 + AAC when needed. Runs 100% in your browser — no uploads.",
    category: "Everyday Utilities",
    keyword: "mkv to mp4 converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["mov-to-mp4-converter", "gif-to-mp4-converter", "video-converter"],
  },
  {
    slug: "mov-to-mp4-converter",
    name: "MOV to MP4 Converter",
    tagline: "Turn MOV video — including iPhone clips — into MP4.",
    description:
      "MOV to MP4 converter online free: perfect for iPhone videos. Remux MOV to MP4 instantly when possible, re-encode to H.264 + AAC when needed. 100% in-browser.",
    category: "Everyday Utilities",
    keyword: "mov to mp4 converter online",
    badge: "Free",
    badgeColor: "green",
    api: null,
    related: ["mkv-to-mp4-converter", "gif-to-mp4-converter", "video-converter"],
  },
];

export const toolBySlug = (slug: string): ToolDef | undefined =>
  TOOLS.find((t) => t.slug === slug);

export const USE_CASES = [
  {
    slug: "website-screenshots-for-client-reports",
    title: "Website Screenshots for Client Reports",
    description:
      "How freelancers and agencies capture pixel-perfect website screenshots for client reports in seconds.",
    keyword: "website screenshot for client report",
  },
  {
    slug: "whatsapp-voice-note-to-text",
    title: "Convert WhatsApp Voice Notes to Text",
    description:
      "Turn long WhatsApp voice notes into readable, searchable text you can skim, quote, and save.",
    keyword: "whatsapp voice note to text",
  },
  {
    slug: "urdu-text-to-voice-for-creators",
    title: "Urdu Text to Voice for Content Creators",
    description:
      "How Pakistani creators generate Urdu voiceovers for videos without recording a single line.",
    keyword: "urdu text to voice",
  },
  {
    slug: "wikipedia-to-pdf-for-students",
    title: "Wikipedia to PDF for Students",
    description:
      "Build offline study packs by converting Wikipedia articles into clean, printable PDFs.",
    keyword: "wikipedia to pdf for studying",
  },
] as const;

/** Standard metadata builder: unique title/description + canonical + OG/Twitter. */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${SITE.url}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
    },
  };
}

/** JSON-LD helpers (rendered via <script type="application/ld+json">). */
export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: "https://yatools-xyv3.vercel.app/og-image.jpg",
  };
}

export function webAppJsonLd(tool: ToolDef) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.name} — ${SITE.name}`,
    url: `${SITE.url}/tools/${tool.slug}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: tool.description,
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}
