/**
 * GET /api/fastspring/health?key=ADMIN_PASSWORD
 *
 * Confirms every FastSpring env var is set on Railway WITHOUT leaking any
 * values. Returns a boolean per variable so you can verify config in one
 * browser visit before running a test order.
 *
 * Gated by ADMIN_PASSWORD so the integration map isn't public.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

const REQUIRED = [
  // Client (popup) — must be NEXT_PUBLIC_ to reach the browser
  "NEXT_PUBLIC_FS_STORE",
  "NEXT_PUBLIC_FS_PRODUCT_STARTER",
  "NEXT_PUBLIC_FS_PRODUCT_PRO",
  "NEXT_PUBLIC_FS_PRODUCT_BUSINESS",
  "NEXT_PUBLIC_FS_PRODUCT_STANDARD_PACK",
  "NEXT_PUBLIC_FS_PRODUCT_HD_PACK",
  // Server (webhook)
  "FASTSPRING_WEBHOOK_SECRET",
  "FS_PRODUCT_STARTER",
  "FS_PRODUCT_PRO",
  "FS_PRODUCT_BUSINESS",
  "FS_PRODUCT_STANDARD_PACK",
  "FS_PRODUCT_HD_PACK",
];

const OPTIONAL_SERVICES = [
  "NEXT_PUBLIC_FS_PRODUCT_SOCIAL_STARTER",
  "NEXT_PUBLIC_FS_PRODUCT_SOCIAL_GROWTH",
  "NEXT_PUBLIC_FS_PRODUCT_SOCIAL_MAINTENANCE",
  "NEXT_PUBLIC_FS_PRODUCT_SOCIAL_FIX",
  "NEXT_PUBLIC_FS_PRODUCT_SOCIAL_REFRESH",
  "FS_PRODUCT_SOCIAL_STARTER",
  "FS_PRODUCT_SOCIAL_GROWTH",
  "FS_PRODUCT_SOCIAL_MAINTENANCE",
  "FS_PRODUCT_SOCIAL_FIX",
  "FS_PRODUCT_SOCIAL_REFRESH",
];

export async function GET(request: Request) {
  const key      = new URL(request.url).searchParams.get("key") ?? "";
  const expected = (process.env.ADMIN_PASSWORD ?? "").trim();
  if (!expected || key.trim() !== expected) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const set = (name: string) => Boolean((process.env[name] ?? "").trim());

  const required = Object.fromEntries(REQUIRED.map((n) => [n, set(n)]));
  const services = Object.fromEntries(OPTIONAL_SERVICES.map((n) => [n, set(n)]));

  const missingRequired = REQUIRED.filter((n) => !set(n));

  return NextResponse.json({
    ok: missingRequired.length === 0,
    missingRequired,
    note: missingRequired.length === 0
      ? "All required FastSpring env vars are set. Safe to run a test order."
      : `Missing ${missingRequired.length} required var(s) — the popup or webhook will fail until these are set on Railway.`,
    required,
    services,
    // First few chars only, so you can sanity-check the store value without leaking it
    storePreview: (process.env.NEXT_PUBLIC_FS_STORE ?? "").slice(0, 24) || "(not set)",
  });
}
