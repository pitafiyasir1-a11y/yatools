"use client";

import { useState } from "react";
import type { ToolDef } from "@/lib/site";
import ToolCard from "./ToolCard";

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

/** Client-side category filter tabs + tool card grid. */
export default function ToolGrid({ tools }: { tools: ToolDef[] }) {
  const [active, setActive] = useState<string | null>(null);

  const visible =
    active === null ? tools : tools.filter((t) => t.category === active);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter tools by category"
        className="mb-6 flex flex-wrap gap-2"
      >
        {TABS.map((tab) => {
          const count =
            tab.match === null
              ? tools.length
              : tools.filter((t) => t.category === tab.match).length;
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
              <span className="count">{count}</span>
            </button>
          );
        })}
      </div>
      <div className="tool-grid">
        {visible.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </div>
  );
}
