import type { ReactNode } from "react";

/** Section header: eyebrow pill + Bangers title + optional sub-copy. */
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
      <span className="eyebrow">
        <span className="dot" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 className="sec-title mt-4">{title}</h2>
      {sub ? <p className="sec-sub">{sub}</p> : null}
    </div>
  );
}
