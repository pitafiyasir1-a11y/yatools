// Shared conversion helpers for the dedicated image-converter tools.
// Every decode/encode step runs in the visitor's browser — files are never uploaded.

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const v = bytes / 1024 ** i;
  return `${v >= 100 ? v.toFixed(0) : v.toFixed(1)} ${units[i]}`;
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode-failed"));
    img.src = url;
  });
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("encode-failed"))),
      mime,
      quality
    );
  });
}

export type Drawable = HTMLImageElement | ImageBitmap;

export interface DecodedImage {
  drawable: Drawable;
  width: number;
  height: number;
  /** Object URL used for the on-screen preview. */
  previewUrl: string;
  /** Release object URLs / bitmap memory. */
  revoke: () => void;
}

/** Plain raster image (JPG/PNG/WebP/GIF/BMP…) decoded through an <img> element. */
export async function decodeStandard(file: File): Promise<DecodedImage> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    if (!img.naturalWidth || !img.naturalHeight) throw new Error("decode-failed");
    return {
      drawable: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      previewUrl: url,
      revoke: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    throw new Error("decode-failed");
  }
}

/** AVIF: createImageBitmap decodes AVIF reliably in modern browsers; <img> is the fallback. */
export async function decodeAvif(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      const previewUrl = URL.createObjectURL(file);
      return {
        drawable: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        previewUrl,
        revoke: () => {
          bitmap.close();
          URL.revokeObjectURL(previewUrl);
        },
      };
    } catch {
      /* fall through to <img> */
    }
  }
  return decodeStandard(file);
}

/**
 * HEIC/HEIF via the heic2any engine (dynamically imported so the heavy
 * WASM-ish worker only loads for this one tool). Decodes to PNG so the
 * shared canvas pipeline can re-encode at the user's chosen JPG quality.
 * Throws "heic-unsupported" when the variant can't be decoded in-browser.
 */
export async function decodeHeic(file: File): Promise<DecodedImage> {
  let heic2any: unknown;
  try {
    const mod = (await import("heic2any")) as { default?: unknown };
    heic2any = mod.default ?? mod;
  } catch {
    throw new Error("heic-engine-missing");
  }
  if (typeof heic2any !== "function") throw new Error("heic-engine-missing");
  let blob: Blob;
  try {
    const out = await (heic2any as (o: Record<string, unknown>) => Promise<Blob | Blob[]>)({
      blob: file,
      toType: "image/png",
    });
    blob = Array.isArray(out) ? out[0] : out;
    if (!blob || blob.size === 0) throw new Error("empty");
  } catch {
    throw new Error("heic-unsupported");
  }
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    if (!img.naturalWidth || !img.naturalHeight) throw new Error("decode-failed");
    return {
      drawable: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      previewUrl: url,
      revoke: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    throw new Error("heic-unsupported");
  }
}

/** Read the SVG's intrinsic size: width/height attrs, else viewBox, else null. */
export function parseSvgIntrinsicSize(
  svgText: string
): { width: number; height: number } | null {
  const open = svgText.match(/<svg\b[^>]*>/i)?.[0];
  if (!open) return null;
  const attr = (name: string): string | null => {
    const m = open.match(new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, "i"));
    return m ? m[1] : null;
  };
  const num = (v: string | null): number | null => {
    if (!v) return null;
    const m = v.trim().match(/^([\d.]+)(px)?$/i);
    if (!m) return null;
    const n = parseFloat(m[1]);
    return Number.isFinite(n) && n > 0 ? n : null;
  };
  const w = num(attr("width"));
  const h = num(attr("height"));
  if (w && h) return { width: w, height: h };
  const vb = attr("viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  const vbOk =
    vb && vb.length === 4 && vb.every(Number.isFinite) && vb[2] > 0 && vb[3] > 0;
  if (vbOk && vb) {
    if (w && !h) return { width: w, height: (w * vb[3]) / vb[2] };
    if (h && !w) return { width: (h * vb[2]) / vb[3], height: h };
    return { width: vb[2], height: vb[3] };
  }
  if (w || h) {
    const s = (w ?? h) as number;
    return { width: s, height: s };
  }
  return null;
}

export interface SvgDecoded extends DecodedImage {
  intrinsic: { width: number; height: number } | null;
}

/** SVG rasterization: load as an image, then drawImage() rasterizes it at any size. */
export async function decodeSvg(file: File): Promise<SvgDecoded> {
  let svgText: string;
  try {
    svgText = await file.text();
  } catch {
    throw new Error("decode-failed");
  }
  if (!/<svg\b/i.test(svgText)) throw new Error("decode-failed");
  if (!/xmlns\s*=/i.test(svgText)) {
    svgText = svgText.replace(/<svg\b/i, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  const intrinsic = parseSvgIntrinsicSize(svgText);
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    let width = intrinsic?.width ?? img.naturalWidth ?? 0;
    let height = intrinsic?.height ?? img.naturalHeight ?? 0;
    // Browser default for dimension-less SVG is 300x150 — use a square instead.
    if (!intrinsic && width === 300 && height === 150) {
      width = 1024;
      height = 1024;
    }
    if (!width || !height) {
      width = width || 1024;
      height = height || width;
    }
    return {
      drawable: img,
      width: Math.round(width),
      height: Math.round(height),
      previewUrl: url,
      revoke: () => URL.revokeObjectURL(url),
      intrinsic,
    };
  } catch {
    URL.revokeObjectURL(url);
    throw new Error("decode-failed");
  }
}

/** Draw the decoded source onto a canvas and encode it to the target format. */
export async function encodeDrawable(opts: {
  decoded: DecodedImage;
  mime: "image/jpeg" | "image/png" | "image/webp";
  quality?: number; // 0..1 — used for JPEG/WebP, ignored for PNG
  background?: string; // fill behind transparent pixels (JPEG has no alpha)
  outWidth?: number; // override output width, keeps aspect ratio
}): Promise<Blob> {
  const { decoded, mime, quality, background, outWidth } = opts;
  let w = decoded.width;
  let h = decoded.height;
  if (outWidth && outWidth > 0 && Number.isFinite(outWidth)) {
    h = Math.round((h * outWidth) / w);
    w = Math.round(outWidth);
  }
  w = Math.max(1, Math.round(w));
  h = Math.max(1, Math.round(h));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-unavailable");
  if (mime === "image/jpeg") {
    ctx.fillStyle = background || "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(decoded.drawable, 0, 0, w, h);
  return canvasToBlob(canvas, mime, mime === "image/png" ? undefined : quality);
}

/** Extension + MIME check. Browsers often report an empty MIME for .heic, so the extension leads. */
export function validateImageFile(
  f: File,
  exts: string[],
  types: string[],
  label: string
): string | null {
  const name = f.name.toLowerCase();
  const extOk = exts.some((e) => name.endsWith(e));
  const type = (f.type || "").toLowerCase();
  const typeOk = !type || types.includes(type);
  if (!extOk || !typeOk) {
    return `That doesn't look like ${label} — please choose a ${exts.join(" / ")} file.`;
  }
  return null;
}

/** Sensible output name: photo.heic → photo.jpg */
export function outputName(fileName: string, ext: string): string {
  const base = fileName.replace(/\.[^.]+$/, "").trim() || "image";
  return `${base}.${ext}`;
}
