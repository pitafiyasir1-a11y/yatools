/* YATools video-converter ffmpeg loader (owned by the video-converter worker).
 *
 * Thin wrapper over the shared CDN-based loader at app/tools/ffmpeg-loader.ts.
 * The SINGLE-THREADED ffmpeg core (@ffmpeg/core 0.12.x) loads from the
 * jsDelivr CDN (CORS `*`) — no cross-origin-isolation headers needed, and no
 * binaries are stored in `public/` (the 32MB wasm can never ship through the
 * text-only push API).
 *
 * This lives at app/tools/_vidconv/ (not the shared path) to avoid file
 * collisions with other workers using @ffmpeg/ffmpeg in the same repo.
 */
"use client";

export {
  loadFFmpeg,
  onFFmpegProgress,
  writeInputFile,
  readOutputBlob,
  cleanupFFmpeg,
  formatBytes,
  FFMPEG_FIRST_RUN_NOTE,
} from "../ffmpeg-loader";

export type ProgressCb = (label: string, pct: number | null, detail: string) => void;

/** A small honest progress readout for the ffmpeg engine (self-contained). */
export function EngineProgress({
  label,
  pct,
  detail,
  firstRun,
}: {
  label: string;
  pct: number | null;
  detail: string;
  firstRun: boolean;
}) {
  return (
    <div className="notice" style={{ marginBottom: 16 }} aria-live="polite">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <strong>{label}</strong>
        {pct !== null && (
          <span className="font-mono2" style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}>
            {detail ? `${detail} (${pct}%)` : `${pct}%`}
          </span>
        )}
      </div>
      <div
        style={{
          height: 14,
          border: "1px solid var(--line)",
          borderRadius: 8,
          marginTop: 10,
          overflow: "hidden",
          background: "var(--surface2)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: pct !== null ? `${pct}%` : "45%",
            background: "var(--red)",
            borderRadius: 6,
            transition: "width 0.3s ease",
            animation: pct !== null ? undefined : "ff-slide 1.2s ease-in-out infinite",
          }}
        />
      </div>
      <style>{`@keyframes ff-slide { 0% { transform: translateX(-100%);} 100% { transform: translateX(220%);} }`}</style>
      {firstRun && (
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
          First run loads the video engine (~30 MB) — once, then it&apos;s instant for
          the rest of your visit. Your file never leaves this browser.
        </p>
      )}
    </div>
  );
}
