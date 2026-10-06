"use client";

/**
 * Copy text to the clipboard, honestly.
 *
 * Tries the async clipboard API first, then falls back to a hidden textarea +
 * execCommand (which works in non-secure contexts / older browsers where
 * navigator.clipboard is undefined). Returns true on success, false when there
 * is no way to copy — callers must show an honest message in that case.
 */
export async function copyText(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(text);
      return true;
    }
    throw new Error("clipboard API unavailable");
  } catch {
    // Fallback path: works where navigator.clipboard is missing (e.g. plain HTTP).
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "0";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
