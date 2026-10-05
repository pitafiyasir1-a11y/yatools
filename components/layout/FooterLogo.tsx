"use client";

import { useState } from "react";

/**
 * Footer brand lockup. Tries the owner's full logo (/logo-full.png, uploaded
 * separately via GitHub web UI); falls back to the text lockup if absent.
 * Never renders a broken image.
 */
export default function FooterLogo() {
  const [logoOk, setLogoOk] = useState(true);

  if (!logoOk) {
    return (
      <div className="mb-3 flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="font-display inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-xl text-white"
          style={{ background: "var(--red)", lineHeight: 1 }}
        >
          Y
        </span>
        <span className="font-display text-[1.35rem]" style={{ color: "var(--text)", lineHeight: 1 }}>
          YATools
        </span>
      </div>
    );
  }

  return (
    <img
      src="/logo-full.png"
      alt="YATools — All Tools, One Place"
      width={190}
      height={56}
      className="mb-3 h-auto w-auto"
      style={{ maxWidth: 190, display: "block" }}
      onError={() => setLogoOk(false)}
    />
  );
}
