import Link from "next/link";
import type { ToolDef } from "@/lib/site";

/** Server tool card: quiet card — icon tile + name + one-line description + footer. */
export default function ToolCard({ tool }: { tool: ToolDef }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card card-hover flex flex-col gap-3 p-5 no-underline"
    >
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden="true" className="tool-icon">
          {tool.name.charAt(0)}
        </span>
        <span className={`badge badge-${tool.badgeColor}`}>{tool.badge}</span>
      </div>
      <div>
        <h3 className="m-0 mb-1 text-[1.05rem] font-bold" style={{ color: "var(--text)" }}>
          {tool.name}
        </h3>
        <p className="m-0 text-sm leading-relaxed" style={{ color: "var(--text2)" }}>
          {tool.tagline}
        </p>
      </div>
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="font-mono2 text-xs" style={{ color: "var(--muted)" }}>
          {tool.api ?? "100% in-browser"}
        </span>
        <span aria-hidden="true" className="text-base font-semibold" style={{ color: "var(--red)" }}>
          &rarr;
        </span>
      </div>
    </Link>
  );
}
