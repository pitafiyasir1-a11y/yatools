"use client";

import { useEffect, useRef, useState } from "react";

type Status =
  | "idle"
  | "loading"
  | "fallback-loading"
  | "ready"
  | "fallback"
  | "error";

const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u00c0-\u024f\u1e00-\u1eff]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "wikipedia-article";

/** Make Wikipedia's relative/protocol-relative URLs absolute so images & links work. */
const absolutize = (body: string) =>
  body
    .replace(/srcset="\/\//g, 'srcset="https://')
    .replace(/src="\/\//g, 'src="https://')
    .replace(/href="\/\//g, 'href="https://')
    .replace(/src="\//g, 'src="https://en.wikipedia.org/')
    .replace(/href="\//g, 'href="https://en.wikipedia.org/');

export default function WikipediaToPdfClient() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState("article.pdf");
  const [html, setHtml] = useState("");
  const [wikiUrl, setWikiUrl] = useState("");
  const pdfUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    };
  }, []);

  const loadFallback = async (q: string) => {
    setStatus("fallback-loading");
    setError(null);
    const slug = encodeURIComponent(q.trim().replace(/\s+/g, "_"));
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/html/${slug}`
      );
      if (res.status === 404) {
        setStatus("error");
        setError(
          `No Wikipedia article found for "${q}". Check the spelling, or try searching with different words.`
        );
        return;
      }
      if (!res.ok) throw new Error("fallback unreachable");
      const body = await res.text();
      setHtml(absolutize(body));
      setWikiUrl(`https://en.wikipedia.org/wiki/${slug}`);
      setStatus("fallback");
    } catch {
      setStatus("error");
      setError(
        "The PDF service and Wikipedia are both unreachable right now. Check your connection and try again in a minute."
      );
    }
  };

  const generate = async () => {
    const q = title.trim();
    if (!q) {
      setStatus("error");
      setError(
        "Enter a Wikipedia article title first — for example, “Artificial intelligence”."
      );
      return;
    }
    if (pdfUrlRef.current) {
      URL.revokeObjectURL(pdfUrlRef.current);
      pdfUrlRef.current = null;
    }
    setPdfUrl(null);
    setHtml("");
    setError(null);
    setStatus("loading");
    try {
      const res = await fetch(
        `/api/v1/wikipdf?query=${encodeURIComponent(q)}`
      );
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/pdf")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        pdfUrlRef.current = url;
        setPdfUrl(url);
        setPdfName(`${slugify(q)}.pdf`);
        setStatus("ready");
        return;
      }
      let code = "";
      try {
        const data = await res.json();
        code = data?.error?.code || "";
      } catch {
        /* non-JSON body */
      }
      if (code === "WIKIPDF_DOWN") {
        await loadFallback(q);
        return;
      }
      setStatus("error");
      setError(
        "The PDF service returned an unexpected response. Please try again in a minute."
      );
    } catch {
      // network error -> fallback mode
      await loadFallback(q);
    }
  };

  const busy = status === "loading" || status === "fallback-loading";

  return (
    <div className="neu-card p-6 md:p-8 max-w-3xl mx-auto">
      <style>{`
        .wiki-article { overflow-wrap: break-word; }
        .wiki-article img { max-width: 100%; height: auto; }
        .wiki-article table { max-width: 100%; display: block; overflow-x: auto; }
        .wiki-article a { color: var(--red-dark); }
        .wiki-article h1, .wiki-article h2 { font-weight: 800; margin: 0.9em 0 0.5em; line-height: 1.2; }
        .wiki-article h3 { font-weight: 700; margin: 0.8em 0 0.4em; }
        .wiki-article p { margin: 0 0 0.9em; line-height: 1.7; }
        .wiki-article ul, .wiki-article ol { margin: 0 0 1em; padding-left: 1.4em; }
        .wiki-article li { margin-bottom: 0.4em; }
        @media print {
          body * { visibility: hidden !important; }
          #wiki-print-area, #wiki-print-area * { visibility: visible !important; }
          #wiki-print-area {
            position: absolute !important; left: 0; top: 0; width: 100%;
            border: none !important; background: #fff !important; box-shadow: none !important;
          }
        }
      `}</style>

      <label className="neu-label" htmlFor="wiki-title">
        Wikipedia article title
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="wiki-title"
          className="neu-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") generate();
          }}
          placeholder="e.g. Artificial intelligence"
          autoComplete="off"
        />
        <button
          className="neu-btn neu-btn-primary"
          onClick={generate}
          disabled={busy}
        >
          {status === "loading" ? "Generating PDF…" : "Generate PDF"}
        </button>
      </div>

      {status === "fallback-loading" && (
        <div className="result-box mt-6 text-center">
          <p className="font-bold">
            PDF service is down — loading the article directly from
            Wikipedia…
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            You can print or save it as a PDF from your browser instead.
          </p>
        </div>
      )}

      {status === "error" && error && (
        <div className="notice notice-warn mt-6">
          <strong>Something went wrong.</strong> {error}
        </div>
      )}

      {status === "ready" && pdfUrl && (
        <div className="result-box mt-6 text-center">
          <p className="font-bold text-lg">Your PDF is ready</p>
          <p
            className="text-sm mt-1 mb-5 font-mono2"
            style={{ color: "var(--muted)" }}
          >
            {pdfName}
          </p>
          <a
            href={pdfUrl}
            download={pdfName}
            className="neu-btn neu-btn-primary"
          >
            Download PDF
          </a>
        </div>
      )}

      {status === "fallback" && (
        <div className="mt-6">
          <div className="notice notice-warn mb-5">
            <strong>Fallback mode.</strong> The PDF service is down, so the
            article was loaded straight from Wikipedia. Use{" "}
            <strong>Print / Save as PDF</strong> below — your browser
            creates the PDF.
          </div>
          <span className="neu-badge neu-badge-green mb-4 inline-block">
            Rendered from Wikipedia (fallback)
          </span>
          <button
            className="neu-btn neu-btn-primary mb-5"
            onClick={() => window.print()}
          >
            Print / Save as PDF
          </button>
          <div
            id="wiki-print-area"
            className="result-box wiki-article"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>
            Content from{" "}
            <a
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              Wikipedia
            </a>
            , available under the Creative Commons Attribution-ShareAlike (CC
            BY-SA) license.
          </p>
        </div>
      )}
    </div>
  );
}
