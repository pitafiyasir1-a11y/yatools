import type { FC, ReactNode } from "react";

type IconProps = { className?: string };

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      focusable="false" className={className}>
      {children}
    </svg>
  );
}

type Icon = FC<IconProps>;

// 1. website-screenshot
const IconWebsiteScreenshot: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <circle cx="6" cy="7" r="0.7" fill="var(--red)" stroke="none" />
    <path d="M7 16.5l3-3 2 2 3.5-3.5 2 2" />
  </Svg>
);

// 2. audio-to-text
const IconAudioToText: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="3.5" y="3" width="5" height="9" rx="2.5" />
    <path d="M2 11.5a5 5 0 0 0 8 0" />
    <line x1="6" y1="16.5" x2="6" y2="19.5" />
    <line x1="3.5" y1="19.5" x2="8.5" y2="19.5" />
    <line x1="13" y1="8" x2="21" y2="8" />
    <line x1="13" y1="12" x2="21" y2="12" />
    <line x1="13" y1="16" x2="18" y2="16" />
  </Svg>
);

// 3. text-to-speech
const IconTextToSpeech: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" />
    <path d="M15.5 9a4.5 4.5 0 0 1 0 6" />
    <path d="M18.2 6.3a8.4 8.4 0 0 1 0 11.4" />
  </Svg>
);

// 4. urdu-handwriting
const IconUrduHandwriting: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M5 19l.9-3.4L15 6.5l2.5 2.5L8.4 18.1 5 19z" />
    <line x1="13.2" y1="8.3" x2="15.7" y2="10.8" />
  </Svg>
);

// 5. wikipedia-to-pdf
const IconWikipediaToPdf: Icon = ({ className }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <ellipse cx="12" cy="12" rx="4" ry="8.5" />
    <line x1="3.5" y1="12" x2="20.5" y2="12" />
  </Svg>
);

// 6. n8n-workflow-search
const IconN8nWorkflowSearch: Icon = ({ className }) => (
  <Svg className={className}>
    <circle cx="6" cy="7" r="2.5" />
    <circle cx="18" cy="8.5" r="2.5" />
    <circle cx="11" cy="17" r="2.5" />
    <line x1="8.3" y1="7.6" x2="15.6" y2="8.2" />
    <line x1="7" y1="9.3" x2="9.9" y2="14.8" />
    <line x1="16.7" y1="10.6" x2="12.9" y2="15" />
  </Svg>
);

// 7. ai-image-generator
const IconAiImageGenerator: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="var(--red)" stroke="none" />
  </Svg>
);

// 8. movie-tv-search
const IconMovieTvSearch: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="6" width="12" height="12" rx="2" />
    <line x1="7" y1="6" x2="7" y2="18" />
    <line x1="11" y1="6" x2="11" y2="18" />
    <circle cx="16.5" cy="16.5" r="3.8" />
    <line x1="19.3" y1="19.3" x2="22" y2="22" />
  </Svg>
);

// 9. qr-code-generator
const IconQrCodeGenerator: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <rect x="14" y="14" width="2.6" height="2.6" rx="0.5" />
    <rect x="17.4" y="17.4" width="2.6" height="2.6" rx="0.5" />
    <circle cx="17" cy="7" r="1" fill="var(--red)" stroke="none" />
  </Svg>
);

// 10. word-counter
const IconWordCounter: Icon = ({ className }) => (
  <Svg className={className}>
    <line x1="4" y1="6" x2="13" y2="6" />
    <line x1="4" y1="10" x2="17" y2="10" />
    <line x1="4" y1="14" x2="11" y2="14" />
    <text x="17.5" y="19" fontSize="7" fill="currentColor" stroke="none" textAnchor="middle">123</text>
  </Svg>
);

// 11. json-formatter
const IconJsonFormatter: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M10 4c-2.5 0-3.5 1.5-3.5 3.5v2.7c0 .9-.8 1.3-.8 1.8s.8.9.8 1.8v2.7c0 2 1 3.5 3.5 3.5" />
    <path d="M14 4c2.5 0 3.5 1.5 3.5 3.5v2.7c0 .9.8 1.3.8 1.8s-.8.9-.8 1.8v2.7c0 2-1 3.5-3.5 3.5" />
  </Svg>
);

// 12. password-generator
const IconPasswordGenerator: Icon = ({ className }) => (
  <Svg className={className}>
    <circle cx="8" cy="12" r="4" />
    <line x1="11.6" y1="12" x2="20" y2="12" />
    <line x1="16.5" y1="12" x2="16.5" y2="15.5" />
    <line x1="19.5" y1="12" x2="19.5" y2="14.5" />
  </Svg>
);

// 13. case-converter
const IconCaseConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <text x="12" y="16.5" fontSize="11" fill="currentColor" stroke="none" textAnchor="middle">aA</text>
  </Svg>
);

// 14. color-picker
const IconColorPicker: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="m2 22 1-4 9.6-9.6 3.4 3.4L6.4 21 2 22z" />
    <path d="M14.5 5.5 18 9l3.5-3.5L18 2z" />
  </Svg>
);

// 15. certificate-maker
const IconCertificateMaker: Icon = ({ className }) => (
  <Svg className={className}>
    <circle cx="12" cy="9" r="5" />
    <path d="M9.3 13.4 8 20l4-2.3L16 20l-1.3-6.6" />
    <circle cx="12" cy="9" r="1.2" fill="var(--red)" stroke="none" />
  </Svg>
);

// 16. ai-vision-chat
const IconAiVisionChat: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M4 6h16v10H10l-4.5 4.5v-4.5H4z" />
    <ellipse cx="12" cy="11" rx="3.4" ry="2.2" />
    <circle cx="12" cy="11" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

// 17. text-to-pdf
const IconTextToPdf: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4" />
    <line x1="9" y1="12" x2="15" y2="12" />
    <line x1="9" y1="15.5" x2="15" y2="15.5" />
    <line x1="9" y1="19" x2="13" y2="19" />
  </Svg>
);

// 18. background-remover
const IconBackgroundRemover: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="4" y="4" width="16" height="16" rx="2" strokeDasharray="3 2.5" />
    <circle cx="12" cy="10.5" r="3.2" />
    <path d="M7 18c.8-2.6 2.8-4 5-4s4.2 1.4 5 4" />
  </Svg>
);

// 19. image-compressor
const IconImageCompressor: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="10" y="10" width="4" height="4" rx="1" />
    <path d="M9 4v4.5H4.5" />
    <path d="M15 4v4.5h4.5" />
    <path d="M9 20v-4.5H4.5" />
    <path d="M15 20v-4.5h4.5" />
  </Svg>
);

// 20. image-converter
const IconImageConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3" />
    <path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3" />
    <path d="M17.5 3.5v3h-3" />
    <path d="M6.5 20.5v-3h3" />
  </Svg>
);

// 21. image-resizer
const IconImageResizer: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M9 4H4v5" />
    <path d="M15 4h5v5" />
    <path d="M20 15v5h-5" />
    <path d="M9 20H4v-5" />
  </Svg>
);

// 22. unit-converter
const IconUnitConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="9" width="18" height="7" rx="1.5" />
    <line x1="7" y1="9" x2="7" y2="12" />
    <line x1="11" y1="9" x2="11" y2="13.5" />
    <line x1="15" y1="9" x2="15" y2="12" />
    <line x1="19" y1="9" x2="19" y2="13.5" />
  </Svg>
);

// 23. merge-pdf
const IconMergePdf: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M8.5 3H5v9h3.5" />
    <path d="M15.5 3H19v9h-3.5" />
    <line x1="12" y1="12" x2="12" y2="18" />
    <path d="M8.8 15.5 12 18.7l3.2-3.2" />
    <line x1="5" y1="21" x2="19" y2="21" />
  </Svg>
);

// 24. split-pdf
const IconSplitPdf: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M9 3h7l4 4v14H9z" />
    <path d="M16 3v4h4" />
    <line x1="14.5" y1="10" x2="14.5" y2="20" strokeDasharray="3 2" />
    <path d="M3.5 12 6 9.5M3.5 12 6 14.5M3.5 12H7" />
  </Svg>
);

// 25. compress-pdf
const IconCompressPdf: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M9 5h6l3 3v9H9z" />
    <path d="M15 5v3h3" />
    <path d="M4 9V6.5H6.5" />
    <path d="M20 9V6.5h-2.5" />
    <path d="M4 17v2.5h2.5" />
    <path d="M20 17v2.5h-2.5" />
  </Svg>
);

// 26. image-to-pdf
const IconImageToPdf: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="9" width="7" height="7" rx="1" />
    <circle cx="4.8" cy="11" r="0.8" fill="currentColor" stroke="none" />
    <path d="M3 14.5l2-2 1.5 1.5 2-2" />
    <line x1="11" y1="12.5" x2="14" y2="12.5" />
    <path d="M12.8 10.8 14.5 12.5l-1.7 1.7" />
    <path d="M16 8h4l2 2v7h-6z" />
    <path d="M20 8v2h2" />
  </Svg>
);

// 27. pdf-to-jpg
const IconPdfToJpg: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M2.5 8h4L8.5 10v7h-6z" />
    <path d="M6.5 8v2h2" />
    <line x1="10" y1="12.5" x2="13" y2="12.5" />
    <path d="M11.8 10.8 13.5 12.5l-1.7 1.7" />
    <rect x="14.5" y="9" width="7" height="7" rx="1" />
    <circle cx="16.8" cy="11" r="0.8" fill="currentColor" stroke="none" />
    <path d="M15 14.5l2-2 1.5 1.5 2-2" />
  </Svg>
);

// 28. rotate-pdf
const IconRotatePdf: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M9 8h5l3 3v8H9z" />
    <path d="M14 8v3h3" />
    <path d="M4.5 10a8 8 0 1 1-.8 4.5" />
    <path d="M4 5.5V10H8.5" />
  </Svg>
);

// 29. qr-scanner
const IconQrScanner: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M4 8V4h4" />
    <path d="M16 4h4v4" />
    <path d="M20 16v4h-4" />
    <path d="M8 20H4v-4" />
    <line x1="8" y1="12" x2="16" y2="12" stroke="var(--red)" />
    <rect x="10.5" y="9.5" width="3" height="3" rx="0.5" />
  </Svg>
);

// 30. invert-image
const IconInvertImage: Icon = ({ className }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none" />
  </Svg>
);

// 31. mirror-image
const IconMirrorImage: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M10 5.5 4.5 12l5.5 6.5z" />
    <path d="M14 5.5l5.5 6.5-5.5 6.5z" />
    <line x1="12" y1="3.5" x2="12" y2="20.5" strokeDasharray="2.5 2" />
  </Svg>
);

// 32. image-cropper
const IconImageCropper: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M6 2v14a2 2 0 0 0 2 2h14" />
    <path d="M18 22V8a2 2 0 0 0-2-2H2" />
  </Svg>
);

// 33. text-to-image
const IconTextToImage: Icon = ({ className }) => (
  <Svg className={className}>
    <line x1="2.5" y1="9" x2="8.5" y2="9" />
    <line x1="2.5" y1="12.5" x2="8.5" y2="12.5" />
    <line x1="2.5" y1="16" x2="6.5" y2="16" />
    <line x1="10" y1="12.5" x2="13.5" y2="12.5" />
    <path d="M12.3 10.8 14 12.5l-1.7 1.7" />
    <rect x="15" y="8.5" width="7" height="7" rx="1" />
    <circle cx="17.2" cy="10.6" r="0.8" fill="currentColor" stroke="none" />
    <path d="M15.5 14l2-2 1.5 1.5 2-2" />
  </Svg>
);

// 34. image-to-text
const IconImageToText: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="8.5" width="7" height="7" rx="1" />
    <circle cx="4.7" cy="10.6" r="0.8" fill="currentColor" stroke="none" />
    <path d="M3 14l2-2 1.5 1.5 2-2" />
    <line x1="11" y1="12.5" x2="14.5" y2="12.5" />
    <path d="M13.3 10.8 15 12.5l-1.7 1.7" />
    <line x1="16" y1="9" x2="22" y2="9" />
    <line x1="16" y1="12.5" x2="22" y2="12.5" />
    <line x1="16" y1="16" x2="20" y2="16" />
  </Svg>
);

// 35. universal-downloader
const IconUniversalDownloader: Icon = ({ className }) => (
  <Svg className={className}>
    <line x1="12" y1="3.5" x2="12" y2="14" />
    <path d="M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4 16.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2.5" />
  </Svg>
);

// 36. temp-mail
const IconTempMail: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M3.5 7.5 12 13l8.5-5.5" />
    <circle cx="17" cy="17" r="3.6" fill="var(--bg)" />
    <line x1="17" y1="17" x2="17" y2="15.2" />
    <line x1="17" y1="17" x2="18.4" y2="17.8" />
  </Svg>
);

// 37. heic-to-jpg-converter
const IconHeicToJpgConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="7" width="6" height="11" rx="1.5" />
    <circle cx="5.5" cy="15.8" r="0.6" fill="currentColor" stroke="none" />
    <line x1="10" y1="12.5" x2="13" y2="12.5" />
    <path d="M11.8 10.8 13.5 12.5l-1.7 1.7" />
    <rect x="14.5" y="9" width="7" height="7" rx="1" />
    <path d="M15 14.5l2-2 1.5 1.5 2-2" />
  </Svg>
);

// 38. jpg-to-png-converter
const IconJpgToPngConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="9" width="7" height="7" rx="1" />
    <circle cx="4.8" cy="11" r="0.8" fill="currentColor" stroke="none" />
    <path d="M3 14.5l2-2 1.5 1.5 2-2" />
    <line x1="11" y1="12.5" x2="14" y2="12.5" />
    <path d="M12.8 10.8 14.5 12.5l-1.7 1.7" />
    <rect x="14.5" y="9" width="7" height="7" rx="1" strokeDasharray="2.5 2" />
    <rect x="15.5" y="10" width="1.8" height="1.8" rx="0.3" fill="currentColor" stroke="none" />
    <rect x="17.3" y="11.8" width="1.8" height="1.8" rx="0.3" fill="currentColor" stroke="none" />
  </Svg>
);

// 39. png-to-jpg-converter
const IconPngToJpgConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="9" width="7" height="7" rx="1" strokeDasharray="2.5 2" />
    <rect x="3.5" y="10" width="1.8" height="1.8" rx="0.3" fill="currentColor" stroke="none" />
    <rect x="5.3" y="11.8" width="1.8" height="1.8" rx="0.3" fill="currentColor" stroke="none" />
    <line x1="10" y1="12.5" x2="13" y2="12.5" />
    <path d="M11.8 10.8 13.5 12.5l-1.7 1.7" />
    <rect x="14.5" y="9" width="7" height="7" rx="1" />
    <circle cx="16.8" cy="11" r="0.8" fill="currentColor" stroke="none" />
    <path d="M15 14.5l2-2 1.5 1.5 2-2" />
  </Svg>
);

// 40. webp-to-jpg-converter
const IconWebpToJpgConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <line x1="2" y1="9" x2="4" y2="9" />
    <line x1="1.5" y1="12.5" x2="3.5" y2="12.5" />
    <line x1="2" y1="16" x2="4" y2="16" />
    <rect x="5" y="8" width="8" height="8" rx="1" />
    <line x1="14.5" y1="12.5" x2="17" y2="12.5" />
    <path d="M15.8 10.8 17.5 12.5l-1.7 1.7" />
    <rect x="18" y="9" width="5" height="7" rx="1" />
  </Svg>
);

// 41. jpg-to-webp-converter
const IconJpgToWebpConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="1" y="9" width="5" height="7" rx="1" />
    <line x1="7" y1="12.5" x2="9.5" y2="12.5" />
    <path d="M8.3 10.8 10 12.5l-1.7 1.7" />
    <rect x="11" y="8" width="8" height="8" rx="1" />
    <line x1="20" y1="9" x2="22" y2="9" />
    <line x1="20.5" y1="12.5" x2="22.5" y2="12.5" />
    <line x1="20" y1="16" x2="22" y2="16" />
  </Svg>
);

// 42. avif-to-jpg-converter
const IconAvifToJpgConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="9" width="7" height="7" rx="1" />
    <path d="M3 14.5l2-2 1.5 1.5 2-2" />
    <path d="M11 4.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z" fill="var(--red)" stroke="none" />
    <line x1="11" y1="12.5" x2="14" y2="12.5" />
    <path d="M12.8 10.8 14.5 12.5l-1.7 1.7" />
    <rect x="14.5" y="9" width="7" height="7" rx="1" />
    <path d="M15 14.5l2-2 1.5 1.5 2-2" />
  </Svg>
);

// 43. svg-to-png-converter
const IconSvgToPngConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M3 16c3-6 6 2 9-4" />
    <rect x="2.5" y="15" width="1.6" height="1.6" rx="0.3" fill="currentColor" stroke="none" />
    <rect x="10.4" y="11" width="1.6" height="1.6" rx="0.3" fill="currentColor" stroke="none" />
    <line x1="13.5" y1="12.5" x2="15.5" y2="12.5" />
    <path d="M14.3 10.8 16 12.5l-1.7 1.7" />
    <circle cx="18" cy="10" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="20" cy="10" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="22" cy="10" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="18" cy="12.5" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="20" cy="12.5" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="22" cy="12.5" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="18" cy="15" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="20" cy="15" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="22" cy="15" r="0.7" fill="currentColor" stroke="none" />
  </Svg>
);

// 44. pdf-to-png-converter
const IconPdfToPngConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M2.5 8h4L8.5 10v7h-6z" />
    <path d="M6.5 8v2h2" />
    <line x1="10" y1="12.5" x2="13" y2="12.5" />
    <path d="M11.8 10.8 13.5 12.5l-1.7 1.7" />
    <rect x="14.5" y="9" width="7" height="7" rx="1" strokeDasharray="2.5 2" />
    <rect x="15.5" y="10" width="1.8" height="1.8" rx="0.3" fill="currentColor" stroke="none" />
    <rect x="17.3" y="11.8" width="1.8" height="1.8" rx="0.3" fill="currentColor" stroke="none" />
  </Svg>
);

// 45. image-upscaler
const IconImageUpscaler: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="4" width="10" height="10" rx="1.5" />
    <circle cx="6" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
    <path d="M3.5 12l2.5-2.5 2 2 2.5-2.5" />
    <circle cx="16.5" cy="16.5" r="4.2" />
    <line x1="16.5" y1="14.8" x2="16.5" y2="18.2" />
    <line x1="14.8" y1="16.5" x2="18.2" y2="16.5" />
    <line x1="13.6" y1="13.6" x2="11.5" y2="11.5" />
  </Svg>
);

// 46. mp4-to-mp3-converter
const IconMp4ToMp3Converter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="8" width="7" height="9" rx="1" />
    <line x1="4.5" y1="8" x2="4.5" y2="17" />
    <line x1="7.5" y1="8" x2="7.5" y2="17" />
    <line x1="11" y1="12.5" x2="13.5" y2="12.5" />
    <path d="M12.3 10.8 14 12.5l-1.7 1.7" />
    <line x1="15.5" y1="11" x2="15.5" y2="14" />
    <line x1="17.5" y1="9.5" x2="17.5" y2="15.5" />
    <line x1="19.5" y1="11" x2="19.5" y2="14" />
    <line x1="21.5" y1="12" x2="21.5" y2="13" />
  </Svg>
);

// 47. video-to-gif-converter
const IconVideoToGifConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="8" width="7" height="9" rx="1" />
    <line x1="4.5" y1="8" x2="4.5" y2="17" />
    <line x1="7.5" y1="8" x2="7.5" y2="17" />
    <line x1="11" y1="12.5" x2="13.5" y2="12.5" />
    <path d="M12.3 10.8 14 12.5l-1.7 1.7" />
    <rect x="15" y="7.5" width="6" height="4.5" rx="0.8" />
    <rect x="16.5" y="10" width="6" height="4.5" rx="0.8" />
    <rect x="15" y="12.5" width="6" height="4.5" rx="0.8" />
  </Svg>
);

// 48. video-trimmer
const IconVideoTrimmer: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="7" width="18" height="10" rx="2" />
    <line x1="8" y1="7" x2="8" y2="17" />
    <line x1="16" y1="7" x2="16" y2="17" />
    <path d="M11 10.5l3.5 1.5-3.5 1.5z" fill="currentColor" stroke="none" />
  </Svg>
);

// 49. video-converter
const IconVideoConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M4.5 12a7.5 7.5 0 0 1 12.8-5.3" />
    <path d="M19.5 12a7.5 7.5 0 0 1-12.8 5.3" />
    <path d="M17.5 3.5v3h-3" />
    <path d="M6.5 20.5v-3h3" />
    <path d="M10 9.8l4.5 2.2-4.5 2.2z" fill="currentColor" stroke="none" />
  </Svg>
);

// 50. audio-to-mp3
const IconAudioToMp3: Icon = ({ className }) => (
  <Svg className={className}>
    <line x1="2.5" y1="11" x2="2.5" y2="14" />
    <line x1="4.5" y1="9.5" x2="4.5" y2="15.5" />
    <line x1="6.5" y1="11" x2="6.5" y2="14" />
    <line x1="8.5" y1="12" x2="8.5" y2="13" />
    <line x1="10" y1="12.5" x2="12.5" y2="12.5" />
    <path d="M11.3 10.8 13 12.5l-1.7 1.7" />
    <path d="M17 15V7l5-1.5V14" />
    <circle cx="15.5" cy="15.5" r="1.8" />
    <circle cx="20.5" cy="14" r="1.8" />
  </Svg>
);

// 51. base64-encoder-decoder
const IconBase64EncoderDecoder: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M4 8.5h10.5L12 6" />
    <path d="M20 15.5H9.5L12 18" />
    <circle cx="5" cy="15.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="19" cy="8.5" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

// 52. url-encoder-decoder
const IconUrlEncoderDecoder: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M10 14a4 4 0 0 0 6 0l2.5-2.5a4 4 0 0 0-6-6L11 7" />
    <path d="M14 10a4 4 0 0 0-6 0l-2.5 2.5a4 4 0 0 0 6 6L13 17" />
  </Svg>
);

// 53. html-encoder-decoder
const IconHtmlEncoderDecoder: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M8.5 6.5 4 12l4.5 5.5" />
    <path d="M15.5 6.5 20 12l-4.5 5.5" />
  </Svg>
);

// 54. unix-timestamp-converter
const IconUnixTimestampConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <line x1="12" y1="7.5" x2="12" y2="12" />
    <line x1="12" y1="12" x2="15" y2="14" />
  </Svg>
);

// 55. lorem-ipsum-generator
const IconLoremIpsumGenerator: Icon = ({ className }) => (
  <Svg className={className}>
    <text x="6" y="11" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">¶</text>
    <line x1="11" y1="7" x2="20" y2="7" />
    <line x1="11" y1="11" x2="20" y2="11" />
    <line x1="11" y1="15" x2="17" y2="15" />
  </Svg>
);

// 56. slug-generator
const IconSlugGenerator: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M9.5 14.5a3 3 0 0 0 4.2 0l1.8-1.8a3 3 0 0 0-4.2-4.2l-.9.9" />
    <path d="M14.5 9.5a3 3 0 0 0-4.2 0l-1.8 1.8a3 3 0 0 0 4.2 4.2l.9-.9" />
    <line x1="4" y1="20" x2="20" y2="20" />
  </Svg>
);

// 57. markdown-to-html-converter
const IconMarkdownToHtmlConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <line x1="3" y1="9" x2="8" y2="9" />
    <line x1="3" y1="12.5" x2="8" y2="12.5" />
    <line x1="3" y1="16" x2="6" y2="16" />
    <line x1="9.5" y1="12.5" x2="12.5" y2="12.5" />
    <path d="M11.3 10.8 13 12.5l-1.7 1.7" />
    <path d="M14.5 9l-2.5 3.5 2.5 3.5" />
    <path d="M19 9l2.5 3.5-2.5 3.5" />
  </Svg>
);

// 58. html-to-markdown-converter
const IconHtmlToMarkdownConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M4.5 9l-2.5 3.5 2.5 3.5" />
    <path d="M9 9l2.5 3.5-2.5 3.5" />
    <line x1="11.5" y1="12.5" x2="14.5" y2="12.5" />
    <path d="M13.3 10.8 15 12.5l-1.7 1.7" />
    <line x1="16" y1="9" x2="21" y2="9" />
    <line x1="16" y1="12.5" x2="21" y2="12.5" />
    <line x1="16" y1="16" x2="19" y2="16" />
  </Svg>
);

// 59. pdf-to-word-converter
const IconPdfToWordConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M3 5h4l2 2v9H3z" />
    <path d="M7 5v2h2" />
    <circle cx="5" cy="12" r="1" fill="var(--red)" stroke="none" />
    <line x1="11" y1="12.5" x2="14" y2="12.5" />
    <path d="M12.8 10.8 14.5 12.5l-1.7 1.7" />
    <path d="M14 8h5l2 2v7h-7z" />
    <path d="M19 8v2h2" />
    <line x1="16" y1="12" x2="20" y2="12" />
    <line x1="16" y1="14.5" x2="20" y2="14.5" />
  </Svg>
);

// 60. word-to-pdf-converter
const IconWordToPdfConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M3 8h5l2 2v7H3z" />
    <path d="M8 8v2h2" />
    <line x1="5" y1="12" x2="9" y2="12" />
    <line x1="5" y1="14.5" x2="9" y2="14.5" />
    <line x1="11" y1="12.5" x2="14" y2="12.5" />
    <path d="M12.8 10.8 14.5 12.5l-1.7 1.7" />
    <path d="M14 5h4l2 2v9h-6z" />
    <path d="M18 5v2h2" />
    <circle cx="16" cy="12" r="1" fill="var(--red)" stroke="none" />
  </Svg>
);

// 61. word-to-jpg-converter
const IconWordToJpgConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M2.5 8h4L8.5 10v7h-6z" />
    <path d="M6.5 8v2h2" />
    <line x1="4" y1="13" x2="7.5" y2="13" />
    <line x1="4" y1="15.5" x2="7.5" y2="15.5" />
    <line x1="10" y1="12.5" x2="13" y2="12.5" />
    <path d="M11.8 10.8 13.5 12.5l-1.7 1.7" />
    <rect x="14.5" y="9" width="7" height="7" rx="1" />
    <circle cx="16.8" cy="11" r="0.8" fill="currentColor" stroke="none" />
    <path d="M15 14.5l2-2 1.5 1.5 2-2" />
  </Svg>
);

// 62. excel-to-pdf-converter
const IconExcelToPdfConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="8" width="7" height="9" rx="1" />
    <line x1="2.5" y1="11" x2="9.5" y2="11" />
    <line x1="2.5" y1="14" x2="9.5" y2="14" />
    <line x1="6" y1="8" x2="6" y2="17" />
    <line x1="11" y1="12.5" x2="14" y2="12.5" />
    <path d="M12.8 10.8 14.5 12.5l-1.7 1.7" />
    <path d="M15.5 8h4l2 2v7h-6z" />
    <path d="M19.5 8v2h2" />
  </Svg>
);

// 63. excel-to-jpg-converter
const IconExcelToJpgConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="8" width="7" height="9" rx="1" />
    <line x1="2.5" y1="11" x2="9.5" y2="11" />
    <line x1="2.5" y1="14" x2="9.5" y2="14" />
    <line x1="6" y1="8" x2="6" y2="17" />
    <line x1="11" y1="12.5" x2="14" y2="12.5" />
    <path d="M12.8 10.8 14.5 12.5l-1.7 1.7" />
    <rect x="14.5" y="9" width="7" height="7" rx="1" />
    <circle cx="16.8" cy="11" r="0.8" fill="currentColor" stroke="none" />
    <path d="M15 14.5l2-2 1.5 1.5 2-2" />
  </Svg>
);

// 64. video-compressor
const IconVideoCompressor: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="9" y="9" width="6" height="7" rx="1" />
    <path d="M11 12l2.5 1-2.5 1z" fill="currentColor" stroke="none" />
    <path d="M7 4v3.5h3.5" />
    <path d="M17 4v3.5h-3.5" />
    <path d="M7 20v-3.5h3.5" />
    <path d="M17 20v-3.5h-3.5" />
  </Svg>
);

// 65. gif-to-mp4-converter
const IconGifToMp4Converter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="7.5" width="6" height="4.5" rx="0.8" />
    <rect x="4" y="10" width="6" height="4.5" rx="0.8" />
    <rect x="2.5" y="12.5" width="6" height="4.5" rx="0.8" />
    <line x1="11" y1="12.5" x2="13.5" y2="12.5" />
    <path d="M12.3 10.8 14 12.5l-1.7 1.7" />
    <rect x="15" y="8" width="7" height="9" rx="1" />
    <line x1="17" y1="8" x2="17" y2="17" />
    <line x1="20" y1="8" x2="20" y2="17" />
  </Svg>
);

// 66. png-to-svg-converter
const IconPngToSvgConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <circle cx="4" cy="10" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="6" cy="10" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="8" cy="10" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="4" cy="12.5" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="6" cy="12.5" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="8" cy="12.5" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="4" cy="15" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="6" cy="15" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="8" cy="15" r="0.7" fill="currentColor" stroke="none" />
    <line x1="10" y1="12.5" x2="12" y2="12.5" />
    <path d="M10.8 10.8 12.5 12.5l-1.7 1.7" />
    <path d="M13.5 16c3-6 6 2 9-4" />
  </Svg>
);

// 67. tiff-to-jpg-converter
const IconTiffToJpgConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="9" width="7" height="7" rx="1" />
    <path d="M3 14.5l2-2 1.5 1.5 2-2" />
    <path d="M7.5 6.5V10l1.2-1 1.3 1V6.5z" fill="currentColor" stroke="none" />
    <line x1="11" y1="12.5" x2="14" y2="12.5" />
    <path d="M12.8 10.8 14.5 12.5l-1.7 1.7" />
    <rect x="14.5" y="9" width="7" height="7" rx="1" />
    <path d="M15 14.5l2-2 1.5 1.5 2-2" />
  </Svg>
);

// 68. heic-to-png-converter
const IconHeicToPngConverter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="7" width="6" height="11" rx="1.5" />
    <circle cx="5.5" cy="15.8" r="0.6" fill="currentColor" stroke="none" />
    <line x1="10" y1="12.5" x2="13" y2="12.5" />
    <path d="M11.8 10.8 13.5 12.5l-1.7 1.7" />
    <rect x="14.5" y="9" width="7" height="7" rx="1" strokeDasharray="2.5 2" />
    <rect x="15.5" y="10" width="1.8" height="1.8" rx="0.3" fill="currentColor" stroke="none" />
    <rect x="17.3" y="11.8" width="1.8" height="1.8" rx="0.3" fill="currentColor" stroke="none" />
  </Svg>
);

// 69. pdf-to-word-ocr
const IconPdfToWordOcr: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M7 3h7l4 4v14H7z" />
    <path d="M14 3v4h4" />
    <line x1="9.5" y1="11" x2="16.5" y2="11" stroke="var(--red)" />
    <circle cx="15.5" cy="16" r="2.8" />
    <line x1="17.5" y1="18" x2="20" y2="20.5" />
  </Svg>
);

// 70. wav-to-mp3-converter
const IconWavToMp3Converter: Icon = ({ className }) => (
  <Svg className={className}>
    <line x1="2.5" y1="10" x2="2.5" y2="15" />
    <line x1="4.5" y1="8" x2="4.5" y2="17" />
    <line x1="6.5" y1="11" x2="6.5" y2="14" />
    <line x1="8.5" y1="9" x2="8.5" y2="16" />
    <line x1="10.5" y1="12.5" x2="13" y2="12.5" />
    <path d="M11.8 10.8 13.5 12.5l-1.7 1.7" />
    <path d="M17.5 15V7l5-1.5V14" />
    <circle cx="16" cy="15.5" r="1.8" />
    <circle cx="21" cy="14" r="1.8" />
  </Svg>
);

// 71. m4a-to-mp3-converter
const IconM4aToMp3Converter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="3" y="8" width="5" height="10" rx="1.2" />
    <circle cx="5.5" cy="16.2" r="0.6" fill="currentColor" stroke="none" />
    <line x1="10" y1="12.5" x2="13" y2="12.5" />
    <path d="M11.8 10.8 13.5 12.5l-1.7 1.7" />
    <path d="M17 15V7l5-1.5V14" />
    <circle cx="15.5" cy="15.5" r="1.8" />
    <circle cx="20.5" cy="14" r="1.8" />
  </Svg>
);

// 72. flac-to-mp3-converter
const IconFlacToMp3Converter: Icon = ({ className }) => (
  <Svg className={className}>
    <line x1="3" y1="10" x2="3" y2="15" />
    <line x1="5" y1="8" x2="5" y2="17" />
    <line x1="7" y1="11" x2="7" y2="14" />
    <line x1="9" y1="9" x2="9" y2="16" />
    <line x1="11" y1="12.5" x2="13.5" y2="12.5" />
    <path d="M12.3 10.8 14 12.5l-1.7 1.7" />
    <path d="M17 15V7l5-1.5V14" />
    <circle cx="15.5" cy="15.5" r="1.8" />
    <circle cx="20.5" cy="14" r="1.8" />
  </Svg>
);

// 73. mkv-to-mp4-converter
const IconMkvToMp4Converter: Icon = ({ className }) => (
  <Svg className={className}>
    <rect x="2.5" y="8" width="7" height="9" rx="1" />
    <line x1="4.5" y1="8" x2="4.5" y2="17" />
    <line x1="7.5" y1="8" x2="7.5" y2="17" />
    <line x1="11" y1="12.5" x2="14" y2="12.5" />
    <path d="M12.8 10.8 14.5 12.5l-1.7 1.7" />
    <rect x="15" y="9" width="7" height="7" rx="1.5" />
    <path d="M17.5 10.8l3.5 1.7-3.5 1.7z" fill="currentColor" stroke="none" />
  </Svg>
);

// 74. mov-to-mp4-converter
const IconMovToMp4Converter: Icon = ({ className }) => (
  <Svg className={className}>
    <circle cx="6" cy="12.5" r="4.5" />
    <path d="M5 10.8l3.5 1.7-3.5 1.7z" fill="currentColor" stroke="none" />
    <line x1="12" y1="12.5" x2="14.5" y2="12.5" />
    <path d="M13.3 10.8 15 12.5l-1.7 1.7" />
    <rect x="16" y="8" width="6" height="9" rx="1" />
    <line x1="18" y1="8" x2="18" y2="17" />
    <line x1="20" y1="8" x2="20" y2="17" />
  </Svg>
);

const ICONS: Record<string, Icon> = {
  "website-screenshot": IconWebsiteScreenshot,
  "audio-to-text": IconAudioToText,
  "text-to-speech": IconTextToSpeech,
  "urdu-handwriting": IconUrduHandwriting,
  "wikipedia-to-pdf": IconWikipediaToPdf,
  "n8n-workflow-search": IconN8nWorkflowSearch,
  "ai-image-generator": IconAiImageGenerator,
  "movie-tv-search": IconMovieTvSearch,
  "qr-code-generator": IconQrCodeGenerator,
  "word-counter": IconWordCounter,
  "json-formatter": IconJsonFormatter,
  "password-generator": IconPasswordGenerator,
  "case-converter": IconCaseConverter,
  "color-picker": IconColorPicker,
  "certificate-maker": IconCertificateMaker,
  "ai-vision-chat": IconAiVisionChat,
  "text-to-pdf": IconTextToPdf,
  "background-remover": IconBackgroundRemover,
  "image-compressor": IconImageCompressor,
  "image-converter": IconImageConverter,
  "image-resizer": IconImageResizer,
  "unit-converter": IconUnitConverter,
  "merge-pdf": IconMergePdf,
  "split-pdf": IconSplitPdf,
  "compress-pdf": IconCompressPdf,
  "image-to-pdf": IconImageToPdf,
  "pdf-to-jpg": IconPdfToJpg,
  "rotate-pdf": IconRotatePdf,
  "qr-scanner": IconQrScanner,
  "invert-image": IconInvertImage,
  "mirror-image": IconMirrorImage,
  "image-cropper": IconImageCropper,
  "text-to-image": IconTextToImage,
  "image-to-text": IconImageToText,
  "universal-downloader": IconUniversalDownloader,
  "temp-mail": IconTempMail,
  "heic-to-jpg-converter": IconHeicToJpgConverter,
  "jpg-to-png-converter": IconJpgToPngConverter,
  "png-to-jpg-converter": IconPngToJpgConverter,
  "webp-to-jpg-converter": IconWebpToJpgConverter,
  "jpg-to-webp-converter": IconJpgToWebpConverter,
  "avif-to-jpg-converter": IconAvifToJpgConverter,
  "svg-to-png-converter": IconSvgToPngConverter,
  "pdf-to-png-converter": IconPdfToPngConverter,
  "image-upscaler": IconImageUpscaler,
  "mp4-to-mp3-converter": IconMp4ToMp3Converter,
  "video-to-gif-converter": IconVideoToGifConverter,
  "video-trimmer": IconVideoTrimmer,
  "video-converter": IconVideoConverter,
  "audio-to-mp3": IconAudioToMp3,
  "base64-encoder-decoder": IconBase64EncoderDecoder,
  "url-encoder-decoder": IconUrlEncoderDecoder,
  "html-encoder-decoder": IconHtmlEncoderDecoder,
  "unix-timestamp-converter": IconUnixTimestampConverter,
  "lorem-ipsum-generator": IconLoremIpsumGenerator,
  "slug-generator": IconSlugGenerator,
  "markdown-to-html-converter": IconMarkdownToHtmlConverter,
  "html-to-markdown-converter": IconHtmlToMarkdownConverter,
  "pdf-to-word-converter": IconPdfToWordConverter,
  "word-to-pdf-converter": IconWordToPdfConverter,
  "word-to-jpg-converter": IconWordToJpgConverter,
  "excel-to-pdf-converter": IconExcelToPdfConverter,
  "excel-to-jpg-converter": IconExcelToJpgConverter,
  "video-compressor": IconVideoCompressor,
  "gif-to-mp4-converter": IconGifToMp4Converter,
  "png-to-svg-converter": IconPngToSvgConverter,
  "tiff-to-jpg-converter": IconTiffToJpgConverter,
  "heic-to-png-converter": IconHeicToPngConverter,
  "pdf-to-word-ocr": IconPdfToWordOcr,
  "wav-to-mp3-converter": IconWavToMp3Converter,
  "m4a-to-mp3-converter": IconM4aToMp3Converter,
  "flac-to-mp3-converter": IconFlacToMp3Converter,
  "mkv-to-mp4-converter": IconMkvToMp4Converter,
  "mov-to-mp4-converter": IconMovToMp4Converter,
};

const IconGeneric: Icon = ({ className }) => (
  <Svg className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </Svg>
);

export function ToolIcon({ slug, className }: { slug: string; className?: string }) {
  const C = ICONS[slug] ?? IconGeneric;
  return <C className={className} />;
}
