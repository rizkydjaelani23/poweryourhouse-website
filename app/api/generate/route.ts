/**
 * POST /api/generate
 *
 * Body (multipart/form-data):
 *   imageFile  — the product / room photo
 *   colourHex  — target hex colour e.g. "#5b3a8b"
 *   swatchFile — optional swatch image (hex extracted from it instead)
 *   type       — "STANDARD" | "HD"
 *
 * Standard: Sharp tint blend (fast, uses 1 STANDARD credit)
 * HD:       FLUX.1 Kontext via fal.ai (photorealistic, uses 1 HD credit)
 */

import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { createAdminClient } from "../../utils/supabase/server";
import { getBalance, deductCredit } from "../../utils/credits";
import { uploadToR2 } from "../../utils/r2";
import { v4 as uuid } from "uuid";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 120;

// ── Helpers ────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

async function extractHexFromSwatch(swatchBuffer: Buffer): Promise<string> {
  const stats = await sharp(swatchBuffer).resize(50, 50, { fit: "cover" }).stats();
  const { r, g, b } = stats.dominant;
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Standard recolour: tint preserving luminance via sharp's built-in tint()
 *  If a mask (B&W PNG) is provided, only the white areas are tinted.
 */
async function standardRecolour(inputBuffer: Buffer, hex: string, maskBuffer?: Buffer): Promise<Buffer> {
  const { r, g, b } = hexToRgb(hex);

  if (!maskBuffer) {
    // No mask — tint the whole image
    return sharp(inputBuffer).tint({ r, g, b }).jpeg({ quality: 92 }).toBuffer();
  }

  // Tint a full copy of the image
  const tinted = await sharp(inputBuffer).tint({ r, g, b }).png().toBuffer();

  // Resize mask to match input
  const meta = await sharp(inputBuffer).metadata();
  const w = meta.width  || 800;
  const h = meta.height || 600;
  const mask = await sharp(maskBuffer).resize(w, h, { fit: "fill" }).greyscale().png().toBuffer();

  // Apply mask as alpha to the tinted layer, then composite over original
  const tintedMasked = await sharp(tinted)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const result = await sharp(inputBuffer)
    .composite([{ input: tintedMasked, blend: "over" }])
    .jpeg({ quality: 92 })
    .toBuffer();

  return result;
}

/** HD recolour: FLUX.1 Kontext via fal.ai */
async function hdRecolour(inputBuffer: Buffer, hex: string, colourName: string, userPrompt?: string): Promise<Buffer> {
  const { fal } = await import("@fal-ai/client");
  fal.config({ credentials: process.env.FAL_KEY! });

  // Upload input to fal.ai storage
  const uploadedUrl = await fal.storage.upload(
    new File([new Uint8Array(inputBuffer)], "input.jpg", { type: "image/jpeg" })
  );

  const baseInstruction =
    `Change the colour to ${colourName || hex} (${hex}). ` +
    `Keep the shape, structure, background, lighting and shadows completely identical. ` +
    `Only the surface colour and texture changes. Photorealistic product photography.`;

  const prompt = userPrompt
    ? `${baseInstruction} Additional detail: ${userPrompt}`
    : baseInstruction;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (fal as any).subscribe("fal-ai/flux-pro/kontext", {
    input: {
      image_url:           uploadedUrl,
      prompt,
      num_inference_steps: 28,
      guidance_scale:      2.5,
      safety_tolerance:    "6",
      seed:                42,
    },
    logs: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generatedUrl: string = (result as any)?.data?.images?.[0]?.url;
  if (!generatedUrl) throw new Error("fal.ai returned no image URL");

  const res = await fetch(generatedUrl);
  if (!res.ok) throw new Error("Failed to download generated image");
  return Buffer.from(await res.arrayBuffer());
}

// ── Route handler ──────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    // Auth
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

    // Parse multipart form
    const form       = await request.formData();
    const imageFile  = form.get("imageFile")  as File | null;
    const swatchFile = form.get("swatchFile") as File | null;
    const maskFile   = form.get("maskFile")   as File | null;
    const type       = (form.get("type") as string | null)?.toUpperCase() === "HD" ? "HD" : "STANDARD";
    let   colourHex  = (form.get("colourHex")  as string | null) || "#808080";
    const colourName = (form.get("colourName") as string | null) || "";
    const userPrompt = (form.get("prompt")     as string | null) || "";

    if (!imageFile) return NextResponse.json({ error: "imageFile is required" }, { status: 400 });

    // Extract hex from swatch if provided
    if (swatchFile) {
      const swatchBuf = Buffer.from(await swatchFile.arrayBuffer());
      colourHex = await extractHexFromSwatch(swatchBuf);
    }

    // Check + deduct credit
    const balance = await getBalance(user.id, type);
    if (balance < 1) {
      const label = type === "HD" ? "HD" : "standard";
      return NextResponse.json(
        { error: `You've run out of ${label} credits. Top up to keep generating.`, insufficientCredits: true },
        { status: 402 }
      );
    }

    // Create generation record
    const admin = await createAdminClient();
    const genId = uuid();
    const inputBuffer = Buffer.from(await imageFile.arrayBuffer());
    const maskBuffer  = maskFile ? Buffer.from(await maskFile.arrayBuffer()) : null;

    // Upload input image
    const { publicUrl: inputUrl } = await uploadToR2({
      path:        `saas/${user.id}/inputs/${genId}.jpg`,
      buffer:      inputBuffer,
      contentType: "image/jpeg",
    });

    await admin.from("saas_generations").insert({
      id:              genId,
      user_id:         user.id,
      type,
      input_image_url: inputUrl,
      colour_hex:      colourHex,
      status:          "processing",
    });

    // Deduct credit
    await deductCredit(user.id, type, genId);

    // Generate output
    let outputBuffer: Buffer;
    if (type === "HD") {
      outputBuffer = await hdRecolour(inputBuffer, colourHex, colourName, userPrompt || undefined);
    } else {
      outputBuffer = await standardRecolour(inputBuffer, colourHex, maskBuffer || undefined);
    }

    // Upload output
    const { publicUrl: outputUrl } = await uploadToR2({
      path:        `saas/${user.id}/outputs/${genId}.jpg`,
      buffer:      outputBuffer,
      contentType: "image/jpeg",
    });

    // Update generation record
    await admin.from("saas_generations").update({
      output_image_url: outputUrl,
      status:           "done",
    }).eq("id", genId);

    return NextResponse.json({ ok: true, outputUrl, generationId: genId });

  } catch (err) {
    console.error("[api/generate]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
