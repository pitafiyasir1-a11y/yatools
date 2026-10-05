import Link from "next/link";
import type { ToolDef } from "@/lib/site";

/** Server tool card: neu-card with badge, tagline, endpoint footer and arrow. */
export default function ToolCard({ tool }: { tool: ToolDef }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="neu-card neu-card-hover flex flex-col gap-3 p-5 no-underline"
    >
      <div className="flex items-start justify-between">
        <span
          aria-hidden="true"
          className="font-display inline-flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
          style={{
            border: "2.5px solid var(--ink)",
            background: "var(--red-tint)",
            color: "var(--red-dark)",
            lineHeight: 1,
            paddingTop: "4px",
          }}
        >
          {tool.name.charAt(0)}
        </span>
        <span className={`neu-badge neu-badge-${tool.badgeColor}`}>{tool.badge}</span>
      </div>
      <div>
        <h3 className="m-0 mb-1 text-lg font-extrabold" style={{ color: "var(--text)" }}>
          {tool.name}
        </h3>
        <p className="m-0 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {tool.tagline}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-mono2 text-xs" style={{ color: "var(--muted)" }}>
          {tool.api ?? "100% in-browser"}
        </span>
        <span aria-hidden="true" className="text-lg font-bold" style={{ color: "var(--red)" }}>
          &rarr;
        </span>
      </div>
    </Link>
  );
}
