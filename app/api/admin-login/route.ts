import { NextResponse } from "next/server";

const SESSION_MARKER = "pyh_admin_ok";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const submitted = ((body.password as string) ?? "").trim();
  const expected  = (process.env.ADMIN_PASSWORD ?? "").trim();

  // Debug: log what we see (remove after confirming it works)
  console.log("[admin-login] expected length:", expected.length, "| submitted length:", submitted.length, "| match:", submitted === expected);

  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set on this server. Add it to your environment variables." },
      { status: 500 }
    );
  }

  if (!submitted || submitted !== expected) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("pyh_admin", SESSION_MARKER, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("pyh_admin", "", { maxAge: 0, path: "/" });
  return res;
}
