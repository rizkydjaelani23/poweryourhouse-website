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

/** Standard recolour: tint preserving luminance via sharp's built-in tint() */
async function standardRecolour(inputBuffer: Buffer, hex: string): Promise<Buffer> {
  const { r, g, b } = hexToRgb(hex);

  // sharp.tint() maps the image to greyscale then tints toward the target colour,
  // preserving texture and luminance — exactly what we want for a colour remake.
  const result = await sharp(inputBuffer)
    .tint({ r, g, b })
    .jpeg({ quality: 92 })
    .toBuffer();

  return result;
}

/** HD recolour: FLUX.1 Kontext via fal.ai */
async function hdRecolour(inputBuffer: Buffer, hex: string, colourName: string): Promise<Buffer> {
  const { fal } = await import("@fal-ai/client");
  fal.config({ credentials: process.env.FAL_KEY! });

  // Upload input to fal.ai storage
  const uploadedUrl = await fal.storage.upload(
    new File([new Uint8Array(inputBuffer)], "input.jpg", { type: "image/jpeg" })
  );

  const prompt =
    `Change the colour to ${colourName || hex} (${hex}). ` +
    `Keep the shape, structure, background, lighting and shadows completely identical. ` +
    `Only the surface colour and texture changes. Photorealistic product photography.`;

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
    const form      = await request.formData();
    const imageFile = form.get("imageFile") as File | null;
    const swatchFile = form.get("swatchFile") as File | null;
    const type      = (form.get("type") as string | null)?.toUpperCase() === "HD" ? "HD" : "STANDARD";
    let   colourHex = (form.get("colourHex") as string | null) || "#808080";
    const colourName = (form.get("colourName") as string | null) || "";

    if (!imageFile) return NextResponse.json({ error: "imageFile is required" }, { status: 400 });

    // Extract hex from swatch if provided
    if (swatchFile) {
      const swatchBuf = Buffer.from(await swatchFile.arrayBuffer());
      colourHex = await extractHexFromSwatch(swatchBuf);
    }

    // Check + deduct credit (atomic-ish via ledger)
    const balance = await getBalance(user.id, type);
    if (balance < 1) {
      return NextResponse.json(
        { error: `No ${type} credits remaining. Top up to continue.`, insufficientCredits: true },
        { status: 402 }
      );
    }

    // Create generation record
    const admin = await createAdminClient();
    const genId = uuid();
    const inputBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Upload input image
    const { publicUrl: inputUrl } = await uploadToR2({
      path:        `${user.id}/inputs/${genId}.jpg`,
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
      outputBuffer = await hdRecolour(inputBuffer, colourHex, colourName);
    } else {
      outputBuffer = await standardRecolour(inputBuffer, colourHex);
    }

    // Upload output
    const { publicUrl: outputUrl } = await uploadToR2({
      path:        `${user.id}/outputs/${genId}.jpg`,
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
