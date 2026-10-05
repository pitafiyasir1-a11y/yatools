"use client";

import { useCallback, useEffect, useState } from "react";

interface N8nTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: string;
  triggerType: string;
  nodeCount: number;
  downloadUrl: string;
}

const LIMIT = 9;

const COMPLEXITIES = [
  { value: "", label: "Any complexity" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const TRIGGERS = [
  { value: "", label: "Any trigger" },
  { value: "webhook", label: "Webhook" },
  { value: "schedule", label: "Scheduled" },
  { value: "manual", label: "Manual" },
  { value: "event", label: "Event" },
];

export default function N8nSearchClient() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [complexity, setComplexity] = useState("");
  const [trigger, setTrigger] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [templates, setTemplates] = useState<N8nTemplate[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const runSearch = useCallback(
    async (
      pageNum: number,
      qv: string,
      cv: string,
      xv: string,
      tv: string
    ) => {
      setLoading(true);
      setUnavailable(false);
      setLoadError(null);
      setSearched(true);
      try {
        const params = new URLSearchParams({
          endpoint: "templates",
          page: String(pageNum),
          limit: String(LIMIT),
        });
        if (qv.trim()) params.set("q", qv.trim());
        if (cv) params.set("category", cv);
        if (xv) params.set("complexity", xv);
        if (tv) params.set("triggerType", tv);

        const res = await fetch(`/api/v1/n8n?${params.toString()}`);
        const data = await res.json().catch(() => null);
        if (data?.ok === false) {
          if (data?.error?.code === "N8N_UNAVAILABLE") {
            setUnavailable(true);
            setTemplates([]);
          } else {
            throw new Error(data?.error?.message || "Search failed");
          }
        } else {
          const list = data?.data?.templates;
          setTemplates(Array.isArray(list) ? list : []);
          const pg = data?.data?.pagination;
          setTotalPages(Number(pg?.totalPages) || 1);
          setPage(Number(pg?.page) || pageNum);
          setFallbackUsed(Boolean(data?.fallbackUsed));
        }
      } catch {
        setTemplates([]);
        setLoadError(
          "Search failed. Check your connection and try again in a moment."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/v1/n8n?endpoint=categories");
        const data = await res.json().catch(() => null);
        const raw = data?.data?.categories ?? data?.data;
        if (alive && Array.isArray(raw)) {
          setCategories(raw.map(String).filter(Boolean));
        }
      } catch {
        /* categories stay empty; "All categories" remains */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    runSearch(1, "", "", "", "");
  }, [runSearch]);

  const onSearch = () => runSearch(1, q, category, complexity, trigger);
  const goPage = (p: number) => {
    if (p < 1 || p > totalPages || p === page) return;
    runSearch(p, q, category, complexity, trigger);
    document
      .getElementById("n8n-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="card p-6 md:p-8">
        <label className="field-label" htmlFor="n8n-q">
          Search workflows
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="n8n-q"
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
            placeholder="e.g. slack notifications, gmail to sheets…"
            autoComplete="off"
          />
          <button
            className="btn btn-primary"
            onClick={onSearch}
            disabled={loading}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-5">
          <div>
            <label className="field-label" htmlFor="n8n-cat">
              Category
            </label>
            <select
              id="n8n-cat"
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="n8n-complexity">
              Complexity
            </label>
            <select
              id="n8n-complexity"
              className="select"
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
            >
              {COMPLEXITIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="n8n-trigger">
              Trigger type
            </label>
            <select
              id="n8n-trigger"
              className="select"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
            >
              {TRIGGERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div id="n8n-results" className="mt-8 scroll-mt-24">
        {unavailable && (
          <div className="notice notice-warn">
            <strong>The n8n directory is temporarily unreachable.</strong>{" "}
            Browse workflows directly at{" "}
            <a
              href="https://n8n.io/workflows"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              n8n.io/workflows
            </a>{" "}
            and try this search again in a few minutes.
          </div>
        )}

        {loadError && !unavailable && (
          <div className="notice notice-warn">
            <strong>Something went wrong.</strong> {loadError}
          </div>
        )}

        {loading && (
          <div className="result-box text-center">
            <p className="font-bold">Searching workflows…</p>
          </div>
        )}

        {!loading && !unavailable && !loadError && searched && (
          <>
            {templates.length > 0 && (
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span
                  className="font-mono2 text-xs uppercase tracking-wider"
                  style={{ color: "var(--muted)" }}
                >
                  {templates.length} result{templates.length === 1 ? "" : "s"}
                </span>
                {fallbackUsed && (
                  <>
                    <span className="badge badge-green">
                      snapshot — refreshed weekly
                    </span>
                    <span
                      className="font-mono2 text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      Weekly snapshot — brand-new templates may lag a few days.
                    </span>
                  </>
                )}
              </div>
            )}

            {templates.length === 0 ? (
              <div className="result-box text-center">
                <p className="font-bold">No workflows matched your search.</p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--muted)" }}
                >
                  Try a broader keyword like "slack",
                  "sheets", or "email" — or clear the
                  filters.
                </p>
              </div>
            ) : (
              <div className="tool-grid">
                {templates.map((t, i) => (
                  <div
                    key={t.id || `${t.name}-${i}`}
                    className="card card-hover p-5 flex flex-col"
                  >
                    <h3 className="font-bold text-lg leading-snug mb-2">
                      {t.name || "Untitled workflow"}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {t.category && (
                        <span className="badge badge-blue">
                          {t.category}
                        </span>
                      )}
                      {t.complexity && (
                        <span className="badge badge-purple">
                          {t.complexity}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm leading-relaxed mb-4 line-clamp-3"
                      style={{ color: "var(--text2)" }}
                    >
                      {t.description || "No description provided."}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <span
                        className="font-mono2 text-xs"
                        style={{ color: "var(--muted)" }}
                      >
                        {typeof t.nodeCount === "number"
                          ? `${t.nodeCount} node${t.nodeCount === 1 ? "" : "s"}`
                          : ""}
                      </span>
                      {t.downloadUrl && (
                        <a
                          href={t.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm"
                        >
                          Get workflow
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  className="btn btn-sm"
                  onClick={() => goPage(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </button>
                <span
                  className="font-mono2 text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn-sm"
                  onClick={() => goPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
