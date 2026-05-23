import { NextResponse } from "next/server";

// Session marker stored in the cookie — never the raw password
const SESSION_MARKER = "pyh_admin_ok";

export async function POST(req: Request) {
  const { password } = await req.json();
  const expected = (process.env.ADMIN_PASSWORD ?? "").trim();

  if (!expected) {
    return NextResponse.json({ error: "ADMIN_PASSWORD env var is not set" }, { status: 500 });
  }

  if (!password || (password as string).trim() !== expected) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("pyh_admin", SESSION_MARKER, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("pyh_admin", "", { maxAge: 0, path: "/" });
  return res;
}
