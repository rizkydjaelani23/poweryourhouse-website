/**
 * POST /api/generate
 *
 * Body (multipart/form-data):
 *   imageFile  — the product / room photo
 *   colourHex  — target hex colour e.g. "#5b3a8b"
 *   colourName — optional name e.g. "Navy Blue"
 *   swatchFile — optional swatch image (hex extracted from it instead)
 *   maskFile   — optional B&W PNG mask (white = recolour area)
 *
 * Uses Sharp tint blend. 1 credit per generation.
 *
 * Guest path (no auth, x-guest-token header):
 *   - Max 2 generations per token
 *   - Tracked in saas_guest_usage table
 *   - Output stored at guest/{token}/{genId}.jpg in R2
 */

import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
import { createAdminClient } from "../../utils/supabase/server";
import { getBalance, deductCredit } from "../../utils/credits";
import { uploadToR2 } from "../../utils/r2";
import { recolourFabric } from "../../utils/recolour";
import { v4 as uuid } from "uuid";
import sharp from "sharp";

export const runtime    = "nodejs";
export const maxDuration = 120;

const GUEST_LIMIT = 2;

// ── Helpers ────────────────────────────────────────────────────────────────

/** Representative hex from a swatch — stored on the generation record for
 *  display/history. The actual recolour uses the full swatch image (colour +
 *  texture) via recolourFabric, not just this single value. */
async function extractHexFromSwatch(swatchBuffer: Buffer): Promise<string> {
  const stats = await sharp(swatchBuffer).resize(50, 50, { fit: "cover" }).stats();
  const { r, g, b } = stats.dominant;
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
    if (!imageFile) return NextResponse.json({ error: "imageFile is required" }, { status: 400 });

    // Read buffers (needed by both paths)
    const inputBuffer  = Buffer.from(await imageFile.arrayBuffer());
    const maskBuffer   = maskFile   ? Buffer.from(await maskFile.arrayBuffer())   : null;
    const swatchBuffer = swatchFile ? Buffer.from(await swatchFile.arrayBuffer()) : null;

    // If a swatch was uploaded, derive a representative hex for the record.
    // (The recolour itself uses the whole swatch — colour + texture.)
    if (swatchBuffer) {
      colourHex = await extractHexFromSwatch(swatchBuffer);
    }

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
      const outputBuffer = await recolourFabric({ inputBuffer, maskBuffer, swatchBuffer, hex: colourHex });

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
      outputBuffer = await recolourFabric({ inputBuffer, maskBuffer, swatchBuffer, hex: colourHex });
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
