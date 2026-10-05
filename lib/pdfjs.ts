// Shared pdf.js setup.
//
// pdfjs-dist v6 *requires* a worker: calling getDocument() without
// GlobalWorkerOptions.workerSrc throws 'No "GlobalWorkerOptions.workerSrc"
// specified.' (There is no main-thread fallback anymore.)
//
// We load the version-pinned worker from jsDelivr. pdf.js itself wraps a
// cross-origin worker URL in a same-origin blob (`await import(url)`), so this
// works without any bundler config or CSP changes. The version below MUST stay
// in sync with the pdfjs-dist dependency in package.json.

import * as pdfjs from "pdfjs-dist";

const WORKER_URL =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/build/pdf.worker.min.mjs";

export function getPdfjs() {
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;
  }
  return pdfjs;
}
