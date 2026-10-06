"use client";

import { useMemo, useState } from "react";
import type { ToolDef } from "@/lib/site";
import { searchTools } from "@/lib/tool-search";
import ToolCard from "./ToolCard";
import ToolSearchBar from "./ToolSearchBar";

/** Category tabs shown above the grid. `match` is the real ToolCategory in lib/site.ts. */
const TABS: { label: string; match: string | null }[] = [
  { label: "All", match: null },
  { label: "PDF", match: "Screenshots & PDF" },
  { label: "Audio", match: "Audio & Speech" },
  { label: "Urdu", match: "Urdu Tools" },
  { label: "Developer", match: "Developer Tools" },
  { label: "AI", match: "AI Tools" },
  { label: "Utilities", match: "Everyday Utilities" },
];

/** Searchable + filterable tool grid. Search matches names, keywords,
    descriptions and synonyms ("insta downloader" finds Universal Downloader);
    category tabs narrow the results further. */
export default function ToolsExplorer({ tools }: { tools: ToolDef[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;

  const searched = useMemo(
    () => (searching ? searchTools(query) : tools),
    [query, searching, tools]
  );

  const visible =
    active === null ? searched : searched.filter((t) => t.category === active);

  return (
    <div>
      <ToolSearchBar
        value={query}
        onChange={setQuery}
        resultCount={searching ? visible.length : null}
      />
      <div
        role="tablist"
        aria-label="Filter tools by category"
        className="mb-6 flex flex-wrap gap-2"
      >
        {TABS.map((tab) => {
          const base =
            tab.match === null
              ? searched
              : searched.filter((t) => t.category === tab.match);
          const isActive = active === tab.match;
          return (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.match)}
              className={`tab${isActive ? " tab-active" : ""}`}
            >
              {tab.label}
              <span className="count">{base.length}</span>
            </button>
          );
        })}
      </div>
      {visible.length > 0 ? (
        <div className="tool-grid">
          {visible.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: "40px 24px", textAlign: "center" }}>
          <p className="sec-title mb-2">No tools match</p>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            {searching
              ? `Nothing found for “${query.trim()}”${
                  active ? " in this category" : ""
                }. Try fewer words, or clear the search to browse everything.`
              : "Nothing in this category yet."}
          </p>
          {searching && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setQuery("");
                setActive(null);
              }}
            >
              Show all 74 tools
            </button>
          )}
        </div>
      )}
    </div>
  );
}
