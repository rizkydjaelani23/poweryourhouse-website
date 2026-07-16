/**
 * Material-aware fabric recolour (the "V2 swatch engine").
 *
 * Two techniques, both pure deterministic pixel maths (no AI, no drift, repeatable):
 *   1. LAB colour transfer — adopt the swatch's exact colour character
 *      (undertone via a/b direction + chroma magnitude) while keeping the
 *      product's own shading (highlights, panel seams, shadows).
 *   2. Real swatch texture — extract the fabric grain from the swatch and
 *      overlay it on the recoloured area, modulated by the product's lighting.
 *
 * If no swatch image is supplied (colour-picker / multi-colour mode) it falls
 * back to a LAB transfer toward the target hex, without texture.
 *
 * Only pixels white in the mask are changed. No mask → whole image.
 */

import sharp from "sharp";

// ── colour space ─────────────────────────────────────────────────────────────
const clamp255 = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

function rgb2lab(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722);
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = x > 0.008856 ? Math.cbrt(x) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116;
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
function lab2rgb(L: number, a: number, b: number): [number, number, number] {
  let y = (L + 16) / 116, x = a / 500 + y, z = y - b / 200;
  const f = (t: number) => (t * t * t > 0.008856 ? t * t * t : (t - 16 / 116) / 7.787);
  x = 0.95047 * f(x); y = f(y); z = 1.08883 * f(z);
  const r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  const g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  const bb = x * 0.0557 + y * -0.2040 + z * 1.0570;
  const G = (c: number) => (c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c);
  return [clamp255(G(r) * 255), clamp255(G(g) * 255), clamp255(G(bb) * 255)];
}

function hexToLab(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return rgb2lab(
    parseInt(c.slice(0, 2), 16) || 0,
    parseInt(c.slice(2, 4), 16) || 0,
    parseInt(c.slice(4, 6), 16) || 0
  );
}

// Average LAB of the swatch (its true colour character)
async function swatchStats(swatchBuffer: Buffer): Promise<[number, number, number]> {
  const { data, info } = await sharp(swatchBuffer)
    .resize(64, 64, { fit: "cover" }).removeAlpha().raw()
    .toBuffer({ resolveWithObject: true });
  let L = 0, a = 0, b = 0, n = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const [l, aa, bb] = rgb2lab(data[i], data[i + 1], data[i + 2]);
    L += l; a += aa; b += bb; n++;
  }
  return [L / n, a / n, b / n];
}

// Zero-centred fabric grain, tiled by modulo across the target dimensions
async function swatchGrain(swatchBuffer: Buffer): Promise<{ sw: number; sh: number; grain: Int16Array }> {
  const detail = await sharp(swatchBuffer).removeAlpha().greyscale().raw().toBuffer({ resolveWithObject: true });
  const blur   = await sharp(swatchBuffer).removeAlpha().greyscale().blur(6).raw().toBuffer({ resolveWithObject: true });
  const sw = detail.info.width, sh = detail.info.height;
  const grain = new Int16Array(sw * sh);
  for (let i = 0; i < grain.length; i++) grain[i] = detail.data[i] - blur.data[i];
  return { sw, sh, grain };
}

export interface RecolourOptions {
  inputBuffer:   Buffer;
  maskBuffer?:   Buffer | null;
  swatchBuffer?: Buffer | null;
  hex?:          string;          // used when no swatch is supplied
  contrast?:     number;          // texture/shading retention (default 0.95)
  adapt?:        number;          // brightness retarget strength (default 0.85)
  chromaGain?:   number;          // colour intensity (default 1.0)
  texStrength?:  number;          // fabric-grain overlay (default 0.6)
}

export async function recolourFabric(opts: RecolourOptions): Promise<Buffer> {
  const {
    inputBuffer, maskBuffer = null, swatchBuffer = null, hex = "#808080",
    contrast = 0.95, adapt = 0.85, chromaGain = 1.0, texStrength = 0.6,
  } = opts;

  const base = sharp(inputBuffer).rotate();
  const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels } = info;

  // Optional mask → 1 byte/px, resized to match
  let maskData: Buffer | null = null;
  if (maskBuffer) {
    const m = await sharp(maskBuffer).resize(W, H, { fit: "fill" }).greyscale().raw()
      .toBuffer({ resolveWithObject: true });
    maskData = m.data;
  }

  // Target colour: from swatch if present, else from hex
  const [tL, tA, tB] = swatchBuffer ? await swatchStats(swatchBuffer) : hexToLab(hex);
  const Csw = Math.sqrt(tA * tA + tB * tB) || 0.0001;
  const hueA = tA / Csw, hueB = tB / Csw;

  // Texture (swatch only)
  const grain = swatchBuffer ? await swatchGrain(swatchBuffer) : null;

  // Pass 1: mean lightness of the region we're recolouring
  let sum = 0, count = 0;
  for (let p = 0, i = 0; i < data.length; i += channels, p++) {
    if (maskData && maskData[p] < 128) continue;
    sum += rgb2lab(data[i], data[i + 1], data[i + 2])[0];
    count++;
  }
  const Lmean = count ? sum / count : 50;

  // Pass 2: recolour
  const out = Buffer.from(data);
  for (let p = 0, i = 0; i < data.length; i += channels, p++) {
    if (maskData && maskData[p] < 128) continue;

    const L0 = rgb2lab(data[i], data[i + 1], data[i + 2])[0];

    let Lnew = (tL * adapt + Lmean * (1 - adapt)) + (L0 - Lmean) * contrast;
    if (grain) {
      const x = p % W, y = (p / W) | 0;
      Lnew += grain.grain[(y % grain.sh) * grain.sw + (x % grain.sw)] * (100 / 255) * texStrength;
    }
    Lnew = Math.min(100, Math.max(0, Lnew));

    const Ln = Lnew / 100;
    const bell = 4 * Ln * (1 - Ln);                 // 0 at extremes, 1 mid
    const Cmag = Csw * chromaGain * (0.45 + 0.55 * bell);

    const [r, g, bb] = lab2rgb(Lnew, hueA * Cmag, hueB * Cmag);
    out[i] = r; out[i + 1] = g; out[i + 2] = bb;
  }

  return sharp(out, { raw: { width: W, height: H, channels } }).jpeg({ quality: 92 }).toBuffer();
}
