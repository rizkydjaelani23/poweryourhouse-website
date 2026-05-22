/**
 * POST /api/download-zip
 * Body: { urls: string[], filename?: string }
 * Fetches each image server-side, zips them, and streams back the zip.
 */
import { NextResponse } from "next/server";
import { createClient } from "../../utils/supabase/server";
import JSZip from "jszip";

export const runtime  = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  // Auth check — only logged-in users can bulk-download
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { urls, filename = "recoloured-images" } = await request.json() as {
    urls: string[];
    filename?: string;
  };

  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
  }

  const zip = new JSZip();

  await Promise.all(
    urls.map(async (url, i) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const buffer = Buffer.from(await res.arrayBuffer());
        zip.file(`${filename}-${i + 1}.jpg`, buffer);
      } catch {
        // Skip failed images rather than aborting the whole zip
      }
    })
  );

  const content = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });

  return new NextResponse(content as unknown as BodyInit, {
    headers: {
      "Content-Type":        "application/zip",
      "Content-Disposition": `attachment; filename="${filename}.zip"`,
    },
  });
}
