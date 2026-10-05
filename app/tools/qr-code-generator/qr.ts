/* Minimal QR Code encoder — byte mode, versions 1–10, EC levels L/M/Q/H.
 * Self-contained (no dependencies). Implements ISO/IEC 18004 essentials:
 * byte-mode data coding, Reed–Solomon EC over GF(256), function patterns,
 * zigzag data placement, all 8 mask patterns with penalty-based selection,
 * format info (BCH 15,5) and version info (BCH 18,6). */

export type QrEcc = "L" | "M" | "Q" | "H";

export const ECC_LABEL: Record<QrEcc, string> = {
  L: "Low (7%)",
  M: "Medium (15%)",
  Q: "Quartile (25%)",
  H: "High (30%)",
};

/** Max UTF-8 bytes encodable per (version, level). */
export const MAX_BYTES: Record<QrEcc, number> = { L: 271, M: 213, Q: 151, H: 119 };

interface BlockSpec {
  ecc: number; // EC codewords per block
  g1n: number; g1d: number; // group 1: block count, data codewords per block
  g2n: number; g2d: number; // group 2
}

/* Block layout per version (index 0 = version 1). Cross-checked against the
 * QR spec tables: total codewords = [26,44,70,100,134,172,196,242,292,346]. */
const BLOCKS: Record<QrEcc, BlockSpec[]> = {
  L: [
    { ecc: 7, g1n: 1, g1d: 19, g2n: 0, g2d: 0 },
    { ecc: 10, g1n: 1, g1d: 34, g2n: 0, g2d: 0 },
    { ecc: 15, g1n: 1, g1d: 55, g2n: 0, g2d: 0 },
    { ecc: 20, g1n: 1, g1d: 80, g2n: 0, g2d: 0 },
    { ecc: 26, g1n: 1, g1d: 108, g2n: 0, g2d: 0 },
    { ecc: 18, g1n: 2, g1d: 68, g2n: 0, g2d: 0 },
    { ecc: 20, g1n: 2, g1d: 78, g2n: 0, g2d: 0 },
    { ecc: 24, g1n: 2, g1d: 97, g2n: 0, g2d: 0 },
    { ecc: 30, g1n: 2, g1d: 116, g2n: 0, g2d: 0 },
    { ecc: 18, g1n: 2, g1d: 68, g2n: 2, g2d: 69 },
  ],
  M: [
    { ecc: 10, g1n: 1, g1d: 16, g2n: 0, g2d: 0 },
    { ecc: 16, g1n: 1, g1d: 28, g2n: 0, g2d: 0 },
    { ecc: 26, g1n: 1, g1d: 44, g2n: 0, g2d: 0 },
    { ecc: 18, g1n: 2, g1d: 32, g2n: 0, g2d: 0 },
    { ecc: 24, g1n: 2, g1d: 43, g2n: 0, g2d: 0 },
    { ecc: 16, g1n: 4, g1d: 27, g2n: 0, g2d: 0 },
    { ecc: 18, g1n: 4, g1d: 31, g2n: 0, g2d: 0 },
    { ecc: 22, g1n: 2, g1d: 38, g2n: 2, g2d: 39 },
    { ecc: 22, g1n: 3, g1d: 36, g2n: 2, g2d: 37 },
    { ecc: 26, g1n: 4, g1d: 43, g2n: 1, g2d: 44 },
  ],
  Q: [
    { ecc: 13, g1n: 1, g1d: 13, g2n: 0, g2d: 0 },
    { ecc: 22, g1n: 1, g1d: 22, g2n: 0, g2d: 0 },
    { ecc: 18, g1n: 2, g1d: 17, g2n: 0, g2d: 0 },
    { ecc: 26, g1n: 2, g1d: 24, g2n: 0, g2d: 0 },
    { ecc: 18, g1n: 2, g1d: 15, g2n: 2, g2d: 16 },
    { ecc: 24, g1n: 4, g1d: 19, g2n: 0, g2d: 0 },
    { ecc: 18, g1n: 2, g1d: 14, g2n: 4, g2d: 15 },
    { ecc: 22, g1n: 4, g1d: 18, g2n: 2, g2d: 19 },
    { ecc: 20, g1n: 4, g1d: 16, g2n: 4, g2d: 17 },
    { ecc: 24, g1n: 6, g1d: 19, g2n: 2, g2d: 20 },
  ],
  H: [
    { ecc: 17, g1n: 1, g1d: 9, g2n: 0, g2d: 0 },
    { ecc: 28, g1n: 1, g1d: 16, g2n: 0, g2d: 0 },
    { ecc: 22, g1n: 2, g1d: 13, g2n: 0, g2d: 0 },
    { ecc: 16, g1n: 4, g1d: 9, g2n: 0, g2d: 0 },
    { ecc: 22, g1n: 2, g1d: 11, g2n: 2, g2d: 12 },
    { ecc: 28, g1n: 4, g1d: 15, g2n: 0, g2d: 0 },
    { ecc: 26, g1n: 4, g1d: 13, g2n: 1, g2d: 14 },
    { ecc: 26, g1n: 4, g1d: 14, g2n: 2, g2d: 15 },
    { ecc: 24, g1n: 4, g1d: 12, g2n: 4, g2d: 13 },
    { ecc: 28, g1n: 6, g1d: 15, g2n: 2, g2d: 16 },
  ],
};

const ALIGN_POS: number[][] = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

/* ---------- GF(256) arithmetic (primitive polynomial x^8+x^4+x^3+x^2+1) ---------- */
const EXP = new Array<number>(512);
const LOG = new Array<number>(256);
(function initGf() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

/* ---------- Reed–Solomon ---------- */
function rsGenerator(degree: number): number[] {
  // Returns coefficients in DESCENDING order: [x^degree, ..., x^0].
  // (The product loop below naturally builds ascending order, so reverse at the end.)
  let poly = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array<number>(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gfMul(poly[j], EXP[i]);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  return poly.reverse();
}

function rsRemainder(data: number[], gen: number[]): number[] {
  const res = data.slice();
  for (let i = 0; i < data.length; i++) {
    const coef = res[i];
    if (coef !== 0) {
      for (let j = 1; j < gen.length; j++) res[i + j] ^= gfMul(gen[j], coef);
    }
  }
  return res.slice(data.length);
}

/* ---------- Mask patterns ---------- */
const MASKS: ((r: number, c: number) => boolean)[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => (r * c) % 2 + ((r * c) % 3) === 0,
  (r, c) => ((r * c) % 2 + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

/* ---------- Mask penalty (ISO 18004 §8.8) ---------- */
function penaltyScore(grid: boolean[][]): number {
  const size = grid.length;
  let result = 0;
  // Rule 1: runs of 5+ same-colour modules in rows and columns
  for (let r = 0; r < size; r++) {
    let runLen = 1;
    for (let c = 1; c < size; c++) {
      if (grid[r][c] === grid[r][c - 1]) runLen++;
      else {
        if (runLen >= 5) result += 3 + (runLen - 5);
        runLen = 1;
      }
    }
    if (runLen >= 5) result += 3 + (runLen - 5);
  }
  for (let c = 0; c < size; c++) {
    let runLen = 1;
    for (let r = 1; r < size; r++) {
      if (grid[r][c] === grid[r - 1][c]) runLen++;
      else {
        if (runLen >= 5) result += 3 + (runLen - 5);
        runLen = 1;
      }
    }
    if (runLen >= 5) result += 3 + (runLen - 5);
  }
  // Rule 2: 2x2 blocks of one colour
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = grid[r][c];
      if (v === grid[r][c + 1] && v === grid[r + 1][c] && v === grid[r + 1][c + 1]) result += 3;
    }
  }
  // Rule 3: finder-like patterns
  const pat1 = [true, false, true, true, true, false, true, false, false, false, false];
  const pat2 = [false, false, false, false, true, false, true, true, true, false, true];
  const scan = (get: (i: number) => boolean) => {
    for (let i = 0; i <= size - 11; i++) {
      let m1 = true;
      let m2 = true;
      for (let k = 0; k < 11; k++) {
        if (get(i + k) !== pat1[k]) m1 = false;
        if (get(i + k) !== pat2[k]) m2 = false;
      }
      if (m1 || m2) result += 40;
    }
  };
  for (let r = 0; r < size; r++) scan((i) => grid[r][i]);
  for (let c = 0; c < size; c++) scan((i) => grid[i][c]);
  // Rule 4: dark-module proportion
  let dark = 0;
  for (const row of grid) for (const v of row) if (v) dark++;
  const total = size * size;
  const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
  result += k * 10;
  return result;
}

/* ---------- Format & version info ---------- */
const EC_BITS: Record<QrEcc, number> = { L: 0b01, M: 0b00, Q: 0b11, H: 0b10 };

function formatBits(ecc: QrEcc, mask: number): number {
  const data = (EC_BITS[ecc] << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  return ((data << 10) | rem) ^ 0x5412; // 15 bits
}

function versionBits(version: number): number {
  let rem = version;
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
  return (version << 12) | rem; // 18 bits
}

/* ---------- Main encode ---------- */
export interface QrResult {
  version: number;
  size: number; // modules per side (excludes quiet zone)
  modules: boolean[][]; // true = dark
}

export function encodeQr(text: string, ecc: QrEcc): QrResult {
  const bytes = new TextEncoder().encode(text);
  for (let version = 1; version <= 10; version++) {
    const spec = BLOCKS[ecc][version - 1];
    const totalData = spec.g1n * spec.g1d + spec.g2n * spec.g2d;
    const countBits = version <= 9 ? 8 : 16;
    if (4 + countBits + bytes.length * 8 <= totalData * 8) {
      return build(version, ecc, spec, bytes);
    }
  }
  throw new Error(`Text too long: max ${MAX_BYTES[ecc]} bytes at ${ECC_LABEL[ecc]} error correction.`);
}

function build(version: number, ecc: QrEcc, spec: BlockSpec, data: Uint8Array): QrResult {
  const totalData = spec.g1n * spec.g1d + spec.g2n * spec.g2d;

  // 1. Byte-mode bit stream
  const bits: number[] = [];
  const push = (val: number, n: number) => {
    for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };
  push(0b0100, 4); // byte mode
  push(data.length, version <= 9 ? 8 : 16);
  for (const b of data) push(b, 8);
  const capacity = totalData * 8;
  push(0, Math.min(4, capacity - bits.length)); // terminator
  while (bits.length % 8 !== 0) bits.push(0);
  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let w = 0;
    for (let j = 0; j < 8; j++) w = (w << 1) | bits[i + j];
    codewords.push(w);
  }
  for (let pad = 0xec; codewords.length < totalData; pad ^= 0xec ^ 0x11) codewords.push(pad);

  // 2. Split into blocks, compute EC, interleave
  const blocks: number[][] = [];
  let off = 0;
  const take = (n: number, d: number) => {
    for (let k = 0; k < n; k++) {
      blocks.push(codewords.slice(off, off + d));
      off += d;
    }
  };
  take(spec.g1n, spec.g1d);
  take(spec.g2n, spec.g2d);
  const gen = rsGenerator(spec.ecc);
  const ecBlocks = blocks.map((b) => rsRemainder(b, gen));
  const finalBits: number[] = [];
  const pushByte = (v: number) => {
    for (let i = 7; i >= 0; i--) finalBits.push((v >>> i) & 1);
  };
  const maxData = Math.max(spec.g1d, spec.g2d);
  for (let i = 0; i < maxData; i++) for (const b of blocks) if (i < b.length) pushByte(b[i]);
  for (let i = 0; i < spec.ecc; i++) for (const b of ecBlocks) pushByte(b[i]);

  // 3. Matrix + function patterns
  const size = version * 4 + 17;
  const modules: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const isFunc: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const setFunc = (r: number, c: number, dark: boolean) => {
    modules[r][c] = dark;
    isFunc[r][c] = true;
  };

  // Timing patterns first (finder patterns drawn after will overwrite overlaps)
  for (let i = 0; i < size; i++) {
    setFunc(6, i, i % 2 === 0);
    setFunc(i, 6, i % 2 === 0);
  }

  const finder = (cr: number, cc: number) => {
    for (let dr = -4; dr <= 4; dr++) {
      for (let dc = -4; dc <= 4; dc++) {
        const r = cr + dr;
        const c = cc + dc;
        if (r < 0 || c < 0 || r >= size || c >= size) continue;
        const dist = Math.max(Math.abs(dr), Math.abs(dc));
        setFunc(r, c, dist !== 2 && dist !== 4);
      }
    }
  };
  finder(3, 3);
  finder(3, size - 4);
  finder(size - 4, 3);

  const apos = ALIGN_POS[version - 1];
  const last = apos[apos.length - 1];
  for (const ar of apos) {
    for (const ac of apos) {
      if ((ar === 6 && ac === 6) || (ar === 6 && ac === last) || (ar === last && ac === 6)) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          setFunc(ar + dr, ac + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
        }
      }
    }
  }

  // Reserve format-info areas (drawn after masking).
  // Layout: copy 1 in column 8 (rows 0-7) + row 8 (cols 0-8);
  // copy 2 in row 8 (cols size-8..size-1) + column 8 (rows size-7..size-1).
  for (let i = 0; i <= 5; i++) isFunc[i][8] = true; // bits 0-5
  isFunc[7][8] = true; // bit 6
  isFunc[8][8] = true; // bit 7
  isFunc[8][7] = true; // bit 8
  for (let i = 9; i < 15; i++) isFunc[8][14 - i] = true; // bits 9-14 at (8, 5..0)
  for (let i = 0; i < 8; i++) isFunc[8][size - 1 - i] = true; // bits 0-7 at (8, size-1..size-8)
  for (let i = 8; i < 15; i++) isFunc[size - 15 + i][8] = true; // bits 8-14 at (size-7..size-1, 8)
  isFunc[size - 8][8] = true; // dark module

  if (version >= 7) {
    for (let i = 0; i < 18; i++) {
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      isFunc[a][b] = true;
      isFunc[b][a] = true;
    }
  }

  // 4. Data placement (zigzag, skipping column 6)
  let bi = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const c = right - j;
        const upward = ((right + 1) & 2) === 0;
        const r = upward ? size - 1 - vert : vert;
        if (!isFunc[r][c] && bi < finalBits.length) {
          modules[r][c] = finalBits[bi] === 1;
          bi++;
        }
      }
    }
  }

  // 5. Choose best mask
  let bestMask = 0;
  let bestScore = Infinity;
  for (let m = 0; m < 8; m++) {
    const trial = modules.map((row) => row.slice());
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!isFunc[r][c] && MASKS[m](r, c)) trial[r][c] = !trial[r][c];
      }
    }
    const s = penaltyScore(trial);
    if (s < bestScore) {
      bestScore = s;
      bestMask = m;
    }
  }
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!isFunc[r][c] && MASKS[bestMask](r, c)) modules[r][c] = !modules[r][c];
    }
  }

  // 6. Format info + version info + dark module
  const fmt = formatBits(ecc, bestMask);
  const fbit = (i: number) => ((fmt >>> i) & 1) === 1;
  for (let i = 0; i <= 5; i++) setFunc(i, 8, fbit(i));
  setFunc(7, 8, fbit(6));
  setFunc(8, 8, fbit(7));
  setFunc(8, 7, fbit(8));
  for (let i = 9; i < 15; i++) setFunc(8, 14 - i, fbit(i));
  for (let i = 0; i < 8; i++) setFunc(8, size - 1 - i, fbit(i));
  for (let i = 8; i < 15; i++) setFunc(size - 15 + i, 8, fbit(i));

  if (version >= 7) {
    const vb = versionBits(version);
    for (let i = 0; i < 18; i++) {
      const v = ((vb >>> i) & 1) === 1;
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFunc(a, b, v);
      setFunc(b, a, v);
    }
  }
  setFunc(size - 8, 8, true); // dark module

  return { version, size, modules };
}

/** Render modules to an SVG string (quiet zone of 4 modules included). */
export function qrToSvg(qr: QrResult, fg = "#141210", bg = "#ffffff"): string {
  const n = qr.size;
  const q = 4;
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.modules[r][c]) d += `M${c + q} ${r + q}h1v1h-1z`;
    }
  }
  const dim = n + q * 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" shape-rendering="crispEdges"><rect width="${dim}" height="${dim}" fill="${bg}"/><path d="${d}" fill="${fg}"/></svg>`;
}

/* ---------- Styled rendering (dot styles, eye styles, logo, quiet zone) ---------- */

export type QrDotStyle = "square" | "rounded" | "dots";
export type QrEyeStyle = "square" | "rounded" | "circle";

export interface QrStyle {
  fg?: string;
  bg?: string;
  /** Quiet zone in modules (0–8). Standard is 4; smaller can hurt scannability. */
  quiet?: number;
  dotStyle?: QrDotStyle;
  eyeStyle?: QrEyeStyle;
  /** Logo image (canvas only). Auto-sized to ≤ 20% of the code width. */
  logo?: HTMLImageElement | null;
  /** Fraction of the code width the logo may cover (default 0.2). */
  logoScale?: number;
  /** Logo as data URL (SVG downloads only). */
  logoDataUrl?: string | null;
}

/** The three 7×7 finder-eye origins: top-left, top-right, bottom-left. */
function eyeOrigins(size: number): [number, number][] {
  return [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ];
}

/** True for any module inside the 8×8 eye zones (finder + separators) — those are drawn by drawEye instead. */
function inEyeZone(r: number, c: number, size: number): boolean {
  const z = 8;
  return (r < z && c < z) || (r < z && c >= size - z) || (r >= size - z && c < z);
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawEyeCanvas(
  ctx: CanvasRenderingContext2D,
  er: number,
  ec: number,
  s: number,
  style: QrEyeStyle,
  fg: string,
  bg: string
) {
  const X = (m: number) => ec + m * s;
  const Y = (m: number) => er + m * s;
  if (style === "circle") {
    const cx = X(3.5);
    const cy = Y(3.5);
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.arc(cx, cy, 1.5 * s, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const r = style === "rounded" ? 1.4 * s : 0;
    ctx.fillStyle = fg;
    roundRectPath(ctx, X(0), Y(0), 7 * s, 7 * s, r);
    ctx.fill();
    ctx.fillStyle = bg;
    roundRectPath(ctx, X(1), Y(1), 5 * s, 5 * s, r * 0.7);
    ctx.fill();
    ctx.fillStyle = fg;
    roundRectPath(ctx, X(2), Y(2), 3 * s, 3 * s, r * 0.5);
    ctx.fill();
  }
}

/** Draw a styled QR code onto a canvas. Canvas is resized to `px × px`. */
export function drawQrToCanvas(
  canvas: HTMLCanvasElement,
  qr: QrResult,
  px: number,
  opts: QrStyle = {}
): void {
  const fg = opts.fg ?? "#141210";
  const bg = opts.bg ?? "#ffffff";
  const quiet = opts.quiet ?? 4;
  const dotStyle = opts.dotStyle ?? "square";
  const eyeStyle = opts.eyeStyle ?? "square";
  const n = qr.size;
  const dim = n + quiet * 2;
  const s = px / dim;

  canvas.width = px;
  canvas.height = px;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, px, px);

  const ox = quiet * s;
  const oy = quiet * s;

  // Data modules (eyes handled separately).
  ctx.fillStyle = fg;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!qr.modules[r][c] || inEyeZone(r, c, n)) continue;
      const x = ox + c * s;
      const y = oy + r * s;
      if (dotStyle === "dots") {
        ctx.beginPath();
        ctx.arc(x + s / 2, y + s / 2, s * 0.46, 0, Math.PI * 2);
        ctx.fill();
      } else if (dotStyle === "rounded") {
        roundRectPath(ctx, x + s * 0.04, y + s * 0.04, s * 0.92, s * 0.92, s * 0.32);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, s, s);
      }
    }
  }

  // Eyes.
  for (const [er, ec] of eyeOrigins(n)) {
    drawEyeCanvas(ctx, oy + er * s, ox + ec * s, s, eyeStyle, fg, bg);
  }

  // Logo: white rounded backdrop + image, covering ≤ logoScale of the code.
  if (opts.logo && opts.logo.naturalWidth > 0) {
    const codePx = n * s;
    const logoSide = codePx * (opts.logoScale ?? 0.2);
    const pad = s * 1.2;
    const backSide = logoSide + pad * 2;
    const cx = px / 2;
    const cy = px / 2;
    ctx.fillStyle = "#ffffff";
    roundRectPath(ctx, cx - backSide / 2, cy - backSide / 2, backSide, backSide, pad * 0.6);
    ctx.fill();
    // Fit logo with "contain" behaviour.
    const iw = opts.logo.naturalWidth;
    const ih = opts.logo.naturalHeight;
    const fit = Math.min(logoSide / iw, logoSide / ih);
    const dw = iw * fit;
    const dh = ih * fit;
    ctx.drawImage(opts.logo, cx - dw / 2, cy - dh / 2, dw, dh);
  }
}

/** Build a styled SVG string (used for preview + SVG download). */
export function qrToStyledSvg(qr: QrResult, opts: QrStyle = {}): string {
  const fg = opts.fg ?? "#141210";
  const bg = opts.bg ?? "#ffffff";
  const quiet = opts.quiet ?? 4;
  const dotStyle = opts.dotStyle ?? "square";
  const eyeStyle = opts.eyeStyle ?? "square";
  const n = qr.size;
  const dim = n + quiet * 2;
  const q = quiet;

  let body = "";

  // Data modules.
  const shapes: string[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!qr.modules[r][c] || inEyeZone(r, c, n)) continue;
      const x = (c + q).toFixed(3);
      const y = (r + q).toFixed(3);
      if (dotStyle === "dots") {
        shapes.push(`<circle cx="${(+x + 0.5).toFixed(3)}" cy="${(+y + 0.5).toFixed(3)}" r="0.46"/>`);
      } else if (dotStyle === "rounded") {
        shapes.push(`<rect x="${(+x + 0.04).toFixed(3)}" y="${(+y + 0.04).toFixed(3)}" width="0.92" height="0.92" rx="0.32"/>`);
      } else {
        shapes.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
      }
    }
  }
  if (shapes.length > 0) body += `<g fill="${fg}">${shapes.join("")}</g>`;

  // Eyes.
  const eye = (er: number, ec: number) => {
    const x = ec + q;
    const y = er + q;
    if (eyeStyle === "circle") {
      const cx = (x + 3.5).toFixed(3);
      const cy = (y + 3.5).toFixed(3);
      return `<circle cx="${cx}" cy="${cy}" r="3.5" fill="${fg}"/><circle cx="${cx}" cy="${cy}" r="2.5" fill="${bg}"/><circle cx="${cx}" cy="${cy}" r="1.5" fill="${fg}"/>`;
    }
    const r = eyeStyle === "rounded" ? 1.4 : 0;
    return `<rect x="${x}" y="${y}" width="7" height="7" rx="${r}" fill="${fg}"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx="${(r * 0.7).toFixed(2)}" fill="${bg}"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="${(r * 0.5).toFixed(2)}" fill="${fg}"/>`;
  };
  for (const [er, ec] of eyeOrigins(n)) body += eye(er, ec);

  // Logo: white rounded backdrop + embedded image.
  const logoUrl = opts.logoDataUrl;
  if (logoUrl) {
    const logoSide = n * (opts.logoScale ?? 0.2);
    const pad = 1.2;
    const backSide = logoSide + pad * 2;
    const cx = dim / 2;
    const cy = dim / 2;
    body += `<rect x="${(cx - backSide / 2).toFixed(3)}" y="${(cy - backSide / 2).toFixed(3)}" width="${backSide.toFixed(3)}" height="${backSide.toFixed(3)}" rx="${(pad * 0.6).toFixed(3)}" fill="#ffffff"/>`;
    body += `<image href="${logoUrl}" x="${(cx - logoSide / 2).toFixed(3)}" y="${(cy - logoSide / 2).toFixed(3)}" width="${logoSide.toFixed(3)}" height="${logoSide.toFixed(3)}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" shape-rendering="geometricPrecision"><rect width="${dim}" height="${dim}" fill="${bg}"/>${body}</svg>`;
}

/* ---------- Colour contrast (WCAG relative luminance) ---------- */

function lum(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 0;
  const v = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}

/** WCAG contrast ratio between two hex colours (1–21). */
export function contrastRatio(a: string, b: string): number {
  const l1 = lum(a);
  const l2 = lum(b);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
