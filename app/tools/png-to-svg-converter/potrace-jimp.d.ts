/* Minimal ambient types for the potrace + jimp browser pipeline (png-to-svg).
 * potrace and jimp 0.14 ship no TypeScript declarations; these cover only
 * what the tracer actually uses. */

declare module "potrace" {
  export class Potrace {
    constructor(options?: {
      threshold?: number;
      turdSize?: number;
      optCurve?: boolean;
      color?: string;
      background?: string;
      blackOnWhite?: boolean;
    });
    loadImage(target: unknown, cb: (err: Error | null) => void): void;
    getSVG(): string;
  }
  export function trace(
    file: unknown,
    options: unknown,
    cb: (err: Error | null, svg: string) => void
  ): void;
}

declare module "jimp" {
  interface JimpImage {
    bitmap: { width: number; height: number; data: Uint8Array };
    scan(
      x: number,
      y: number,
      w: number,
      h: number,
      cb: (x: number, y: number, idx: number) => void
    ): void;
  }
  const Jimp: {
    read(data: ArrayBuffer | Uint8Array): Promise<JimpImage>;
  };
  export default Jimp;
}
