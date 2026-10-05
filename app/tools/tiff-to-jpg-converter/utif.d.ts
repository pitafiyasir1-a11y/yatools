/* Minimal ambient types for UTIF.js (tiff-to-jpg). The utif package ships
 * no TypeScript declarations; these cover only what the converter uses. */

declare module "utif" {
  export interface UTIFImage {
    width: number;
    height: number;
    [tag: string]: unknown;
  }
  export function decode(buff: ArrayBuffer): UTIFImage[];
  export function decodeImage(buff: ArrayBuffer, img: UTIFImage): void;
  export function toRGBA8(img: UTIFImage): Uint8Array;
  const UTIF: {
    decode: typeof decode;
    decodeImage: typeof decodeImage;
    toRGBA8: typeof toRGBA8;
  };
  export default UTIF;
}
