"use client";

import { useState } from "react";

/**
 * Brand image with graceful degradation: renders nothing if the file
 * hasn't been uploaded yet (owner uploads PNGs via GitHub web UI).
 */
export default function BrandImage({
  src,
  alt,
  width,
  height,
  className,
  style,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ display: "block", ...style }}
      onError={() => setOk(false)}
    />
  );
}
