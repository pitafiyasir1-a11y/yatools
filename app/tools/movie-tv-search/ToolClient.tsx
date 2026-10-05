"use client";

import { useState } from "react";

interface TitleResult {
  title: string;
  type: string;
  year: string | number;
  rating: string | number;
  image: string;
  url: string;
  imdbUrl?: string | null;
  watchUrl?: string | null;
  cast?: string | null;
}

type Status = "idle" | "loading" | "ready" | "error";

// Only render links that are real http(s) URLs — never javascript: or junk.
const isHttpUrl = (u: unknown): u is string =>
  typeof u === "string" && /^https?:\/\//i.test(u);

const EXAMPLES = ["Breaking Bad", "Dune", "The Office", "Interstellar"];

export default function MovieTvClient() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TitleResult[]>([]);
  const [tvOnly, setTvOnly] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async (override?: string) => {
    const query = (override ?? q).trim();
    if (!query) {
      setStatus("error");
      setError("Type a movie or TV show name to search.");
      return;
    }
    setStatus("loading");
    setError(null);
    setSearched(true);
    try {
      const res = await fetch(
        `/api/v1/msearch?q=${encodeURIComponent(query)}`
      );
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.ok === false) {
        throw new Error(
          data?.error?.message || "Search failed. Please try again."
        );
      }
      const list = data?.data?.results;
      setResults(Array.isArray(list) ? list : []);
      setTvOnly(Boolean(data?.data?.tvOnly));
      setStatus("ready");
    } catch (e) {
      setStatus("error");
      setError(
        e instanceof Error ? e.message : "Search failed. Please try again."
      );
    }
  };

  const pickExample = (ex: string) => {
    setQ(ex);
    search(ex);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="card p-6 md:p-8 max-w-3xl mx-auto">
        <label className="field-label" htmlFor="mtv-q">
          Movie or TV show title
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="mtv-q"
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
            placeholder="e.g. Dune, Breaking Bad…"
            autoComplete="off"
          />
          <button
            className="btn btn-primary"
            onClick={() => search()}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Searching…" : "Search"}
          </button>
        </div>
      </div>

      <div className="mt-8">
        {status === "idle" && !searched && (
          <div className="result-box text-center max-w-3xl mx-auto">
            <p className="font-bold mb-1">Search movies and TV shows</p>
            <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Try one of these to get started:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  className="tab"
                  onClick={() => pickExample(ex)}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="result-box text-center max-w-3xl mx-auto">
            <p className="font-bold">Searching titles…</p>
          </div>
        )}

        {status === "error" && error && (
          <div className="notice notice-warn max-w-3xl mx-auto">
            <strong>Something went wrong.</strong> {error}
          </div>
        )}

        {status === "ready" && (
          <>
            {tvOnly && (
              <div className="notice notice-warn mb-6 max-w-3xl mx-auto">
                <strong>Fallback mode:</strong> TV shows only. Data from{" "}
                <a
                  href="https://www.tvmaze.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold"
                >
                  TVMaze
                </a>
                , CC BY-SA.
              </div>
            )}

            {results.length === 0 ? (
              <div className="result-box text-center max-w-3xl mx-auto">
                <p className="font-bold">No titles found.</p>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  Check the spelling, or try a shorter title.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      className="tab"
                      onClick={() => pickExample(ex)}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="tool-grid">
                {results.map((r, i) => (
                  <div
                    key={`${r.title}-${i}`}
                    className="card card-hover p-4 flex gap-4"
                  >
                    {r.image && (
                      <img
                        src={r.image}
                        alt={`${r.title} poster`}
                        loading="lazy"
                        className="w-20 h-28 object-cover rounded-lg border-2 shrink-0"
                        style={{ borderColor: "var(--line)" }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold leading-snug">{r.title}</h3>
                      {r.cast && (
                        <p
                          className="text-xs mt-1 leading-snug"
                          style={{ color: "var(--muted)" }}
                        >
                          {r.cast}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {r.type && (
                          <span className="badge badge-blue">
                            {r.type}
                          </span>
                        )}
                        {r.year !== undefined &&
                          r.year !== null &&
                          r.year !== "" && (
                            <span
                              className="font-mono2 text-xs"
                              style={{ color: "var(--muted)" }}
                            >
                              {r.year}
                            </span>
                          )}
                        {r.rating !== undefined &&
                          r.rating !== null &&
                          r.rating !== "" && (
                            <span className="font-mono2 text-xs">
                              Rating: {r.rating}/10
                            </span>
                          )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {isHttpUrl(r.watchUrl) && (
                          <a
                            href={r.watchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-primary"
                          >
                            ▶ Watch direct
                          </a>
                        )}
                        {isHttpUrl(r.imdbUrl) && (
                          <a
                            href={r.imdbUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm"
                          >
                            IMDb
                          </a>
                        )}
                        {!isHttpUrl(r.watchUrl) &&
                          !isHttpUrl(r.imdbUrl) &&
                          isHttpUrl(r.url) && (
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline text-sm font-semibold inline-block"
                              style={{ color: "var(--red-dark)" }}
                            >
                              View details
                            </a>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
