import type { ReactNode } from "react";

/** Section header: red eyebrow label + strong heading + optional sub-copy. */
export default function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
}) {
  return (
    <div className="mb-8">
      <p className="sec-label">{eyebrow}</p>
      <h2 className="sec-title">{title}</h2>
      {sub ? <p className="sec-sub">{sub}</p> : null}
    </div>
  );
}
