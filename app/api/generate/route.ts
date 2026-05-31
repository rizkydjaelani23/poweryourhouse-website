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
 *
 * Guest path (no auth, x-guest-token header):
 *   - STANDARD only, max 2 generations per token
 *   - Tracked in saas_guest_usage table
 *   - Output stored at guest/{token}/{genId}.jpg in R2
 */

import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { createAdminClient } from "../../utils/supabase/server";
import { getBalance, deductCredit } from "../../utils/credits";
import { uploadToR2 } from "../../utils/r2";
import { v4 as uuid } from "uuid";
import sharp from "sharp";

export const runtime    = "nodejs";
export const maxDuration = 120;

const GUEST_LIMIT = 2;

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
 *
 *  We normalise EXIF orientation first (.rotate() with no args reads the EXIF
 *  tag and bakes the rotation into pixels, then strips the tag).  This ensures
 *  the image dimensions on the server always match what the browser showed when
 *  the user drew the mask — preventing coordinate misalignment on portrait /
 *  rotated phone photos.
 */
async function standardRecolour(inputBuffer: Buffer, hex: string, maskBuffer?: Buffer): Promise<Buffer> {
  const { r, g, b } = hexToRgb(hex);

  // Normalise EXIF orientation so pixel-space matches the browser display
  const normalised = await sharp(inputBuffer).rotate().toBuffer();

  if (!maskBuffer) {
    return sharp(normalised).tint({ r, g, b }).jpeg({ quality: 92 }).toBuffer();
  }

  const tinted = await sharp(normalised).tint({ r, g, b }).png().toBuffer();

  // Dimensions after EXIF normalisation (portrait photos are now portrait)
  const meta = await sharp(normalised).metadata();
  const w = meta.width  || 800;
  const h = meta.height || 600;
  const mask = await sharp(maskBuffer).resize(w, h, { fit: "fill" }).greyscale().png().toBuffer();

  const tintedMasked = await sharp(tinted)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(normalised)
    .composite([{ input: tintedMasked, blend: "over" }])
    .jpeg({ quality: 92 })
    .toBuffer();
}

/** HD recolour: FLUX.1 Kontext Max via fal.ai
 *
 *  Key parameters:
 *  - kontext/max:  better instruction-following than the base kontext model
 *  - guidance_scale 4.0: tells the model to adhere closely to the prompt
 *  - num_inference_steps 35: more steps → sharper, more accurate colour
 *  - randomised seed: each run explores the colour space differently
 *
 *  Prompt strategy:
 *  - If a swatch was uploaded the hex is real → include it for accuracy
 *  - If no swatch (hex is the default #808080) → rely on userPrompt only,
 *    don't mention a grey hex that would conflict with the description
 */
async function hdRecolour(
  inputBuffer: Buffer,
  hex: string,
  colourName: string,
  userPrompt?: string,
): Promise<Buffer> {
  const { fal } = await import("@fal-ai/client");
  fal.config({ credentials: process.env.FAL_KEY! });

  // Normalise EXIF orientation before uploading — fal.ai does not read EXIF
  const normalised = await sharp(inputBuffer).rotate().jpeg({ quality: 95 }).toBuffer();

  const uploadedUrl = await fal.storage.upload(
    new File([new Uint8Array(normalised)], "input.jpg", { type: "image/jpeg" })
  );

  // Detect "no colour specified" state (default hex with no name means the
  // user is relying purely on the text prompt to describe the colour).
  const hasRealColour = hex !== "#808080" || colourName.trim() !== "";

  let prompt: string;
  if (hasRealColour) {
    // Swatch or named colour provided — use the hex for maximum accuracy
    const colourRef = colourName.trim() || hex;
    const hexNote   = colourName.trim() ? ` (exact hex: ${hex})` : "";
    const base =
      `Change only the surface colour of this product to ${colourRef}${hexNote}. ` +
      `Preserve everything else exactly: shape, silhouette, background, lighting, ` +
      `shadows, highlights, texture detail, and perspective. ` +
      `Photorealistic product photography, professional studio quality.`;
    prompt = userPrompt?.trim()
      ? `${base} Additional styling: ${userPrompt.trim()}`
      : base;
  } else {
    // No colour selected — the description IS the colour instruction
    const base =
      `Recolour this product exactly as described below. ` +
      `Preserve the original shape, silhouette, background, lighting, shadows, ` +
      `highlights, texture detail, and perspective completely unchanged. ` +
      `Only the surface colour and finish of the product changes. ` +
      `Photorealistic product photography, professional studio quality.`;
    prompt = userPrompt?.trim()
      ? `${base} Description: ${userPrompt.trim()}`
      : base;
  }

  // Randomise seed so each run produces genuinely different results
  const seed = Math.floor(Math.random() * 2_147_483_647);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await (fal as any).subscribe("fal-ai/flux-pro/kontext/max", {
    input: {
      image_url:           uploadedUrl,
      prompt,
      num_inference_steps: 35,
      guidance_scale:      4.0,
      safety_tolerance:    "6",
      seed,
    },
    logs: false,
  });

  console.log(`[hdRecolour] seed=${seed} model=kontext/max guidance=4.0 steps=35`);

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
    // ── Auth check ─────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Guest token (provided by client when not logged in)
    const guestToken = request.headers.get("x-guest-token");

    // Must have either a user session or a guest token
    if (!user && !guestToken) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // ── Parse form ─────────────────────────────────────────────────────────
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

    // Read buffers (needed by both paths)
    const inputBuffer = Buffer.from(await imageFile.arrayBuffer());
    const maskBuffer  = maskFile ? Buffer.from(await maskFile.arrayBuffer()) : null;

    // ── GUEST PATH ─────────────────────────────────────────────────────────
    if (!user && guestToken) {
      // Guests: STANDARD only
      if (type === "HD") {
        return NextResponse.json(
          {
            error: "HD generation requires a free account. Sign up — it takes 10 seconds and you get 5 standard + 1 HD free!",
            guestHdBlocked: true,
          },
          { status: 403 }
        );
      }

      const admin = await createAdminClient();

      // Extract client IP for secondary rate-limiting (so clearing localStorage
      // doesn't bypass the limit — both token AND IP are checked)
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";
      const ipKey = `ip:${ip}`;

      // Check token-based usage
      const { data: tokenRow, error: tokenErr } = await admin
        .from("saas_guest_usage")
        .select("count")
        .eq("token", guestToken)
        .maybeSingle();

      // Check IP-based usage
      const { data: ipRow, error: ipErr } = await admin
        .from("saas_guest_usage")
        .select("count")
        .eq("token", ipKey)
        .maybeSingle();

      // If DB is unreachable / table missing — log but don't block.
      // Client-side already enforces the limit via localStorage.
      if (tokenErr || ipErr) {
        console.error("[guest] saas_guest_usage query failed:", tokenErr || ipErr);
      }

      const tokenCount = (tokenRow?.count as number) ?? 0;
      const ipCount    = (ipRow?.count   as number) ?? 0;

      // Block if either token OR IP has hit the limit
      if (tokenCount >= GUEST_LIMIT || ipCount >= GUEST_LIMIT) {
        return NextResponse.json(
          {
            error: `You've used your ${GUEST_LIMIT} free generations. Sign up free to get 5 more!`,
            guestLimitReached: true,
          },
          { status: 402 }
        );
      }

      // Generate (STANDARD only, no record in saas_generations for guests)
      const genId = uuid();
      const outputBuffer = await standardRecolour(inputBuffer, colourHex, maskBuffer || undefined);

      const { publicUrl: outputUrl } = await uploadToR2({
        path:        `guest/${guestToken}/${genId}.jpg`,
        buffer:      outputBuffer,
        contentType: "image/jpeg",
      });

      const now = new Date().toISOString();

      // Increment token usage
      if (tokenRow) {
        await admin
          .from("saas_guest_usage")
          .update({ count: tokenCount + 1, last_used: now })
          .eq("token", guestToken);
      } else {
        await admin
          .from("saas_guest_usage")
          .insert({ token: guestToken, count: 1, last_used: now });
      }

      // Increment IP usage
      if (ipRow) {
        await admin
          .from("saas_guest_usage")
          .update({ count: ipCount + 1, last_used: now })
          .eq("token", ipKey);
      } else {
        await admin
          .from("saas_guest_usage")
          .insert({ token: ipKey, count: 1, last_used: now });
      }

      // ── Abuse tracking ────────────────────────────────────────────────────
      // If this IP has been seen before (ipRow exists) but with a DIFFERENT
      // token (tokenRow is null = fresh token), the user is cycling tokens
      // (private mode / localStorage clear / VPN). Track it so you can review.
      if (!tokenRow && ipRow) {
        const abuseKey = `abuse:${ip}`;
        const { data: abuseRow } = await admin
          .from("saas_guest_usage")
          .select("count")
          .eq("token", abuseKey)
          .maybeSingle();

        if (abuseRow) {
          await admin
            .from("saas_guest_usage")
            .update({ count: (abuseRow.count as number) + 1, last_used: now })
            .eq("token", abuseKey);
        } else {
          await admin
            .from("saas_guest_usage")
            .insert({ token: abuseKey, count: 1 });
        }
      }

      return NextResponse.json({
        ok:           true,
        outputUrl,
        generationId: genId,
        guestUsed:    tokenCount + 1,
        guestLimit:   GUEST_LIMIT,
      });
    }

    // ── AUTHENTICATED PATH ─────────────────────────────────────────────────
    const balance = await getBalance(user!.id, type);
    if (balance < 1) {
      const label = type === "HD" ? "HD" : "standard";
      return NextResponse.json(
        { error: `You've run out of ${label} credits. Top up to keep generating.`, insufficientCredits: true },
        { status: 402 }
      );
    }

    const admin = await createAdminClient();
    const genId = uuid();

    // Upload input image
    const { publicUrl: inputUrl } = await uploadToR2({
      path:        `saas/${user!.id}/inputs/${genId}.jpg`,
      buffer:      inputBuffer,
      contentType: "image/jpeg",
    });

    const { error: insertErr } = await admin.from("saas_generations").insert({
      id:              genId,
      user_id:         user!.id,
      type,
      input_image_url: inputUrl,
      colour_hex:      colourHex,
      status:          "processing",
    });
    if (insertErr) {
      console.error("[api/generate] saas_generations insert failed:", insertErr);
      return NextResponse.json({ error: `DB error: ${insertErr.message}` }, { status: 500 });
    }

    // Deduct credit first (prevents double-spend on failure)
    await deductCredit(user!.id, type, genId);

    // Generate output — mark failed in DB if generation throws
    let outputBuffer: Buffer;
    try {
      if (type === "HD") {
        outputBuffer = await hdRecolour(inputBuffer, colourHex, colourName, userPrompt || undefined);
      } else {
        outputBuffer = await standardRecolour(inputBuffer, colourHex, maskBuffer || undefined);
      }
    } catch (genErr) {
      await admin.from("saas_generations").update({ status: "failed", error: String(genErr) }).eq("id", genId);
      throw genErr; // re-throw so the outer catch returns 500
    }

    // Upload output
    const { publicUrl: outputUrl } = await uploadToR2({
      path:        `saas/${user!.id}/outputs/${genId}.jpg`,
      buffer:      outputBuffer,
      contentType: "image/jpeg",
    });

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
