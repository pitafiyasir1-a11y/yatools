"use client";

import { useEffect, useRef } from "react";

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  );
}

/** Big tool-search input. Pressing "/" anywhere focuses it. */
export default function ToolSearchBar({
  value,
  onChange,
  resultCount,
}: {
  value: string;
  onChange: (v: string) => void;
  resultCount: number | null;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        ref.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mb-6">
      <div
        className="card flex items-center gap-3"
        style={{ padding: "6px 6px 6px 18px", borderRadius: 18 }}
      >
        <span style={{ color: "var(--muted)", display: "flex" }} aria-hidden="true">
          <SearchIcon />
        </span>
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search 74 tools — try “insta downloader”, “pdf to word”, “qr”…"
          aria-label="Search tools"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent outline-none"
          style={{
            border: "none",
            boxShadow: "none",
            fontSize: "1.05rem",
            padding: "12px 4px",
            color: "var(--text)",
            minWidth: 0,
          }}
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              ref.current?.focus();
            }}
            className="btn"
            style={{ padding: "10px 16px" }}
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : (
          <kbd
            className="font-mono2 hidden sm:block"
            style={{
              color: "var(--muted)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 13,
              marginRight: 8,
            }}
            aria-hidden="true"
          >
            /
          </kbd>
        )}
      </div>
      {value.trim() && (
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }} role="status">
          {resultCount === 0 ? (
            <>
              No tools found for “{value.trim()}”. Try “pdf”, “image”, or
              “audio” — or browse the categories below.
            </>
          ) : (
            <>
              {resultCount} result{resultCount === 1 ? "" : "s"} for “{value.trim()}”
            </>
          )}
        </p>
      )}
    </div>
  );
}
