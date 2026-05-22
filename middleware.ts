import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// /generate is intentionally NOT in this list — guests can access it without auth.
// The generate page and API handle guest vs. auth logic themselves.
const PROTECTED = ["/dashboard", "/bulk"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()          { return request.cookies.getAll(); },
        setAll(cookies) {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookies.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — required for SSR
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path.startsWith(p));

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  // /generate is excluded — guests must be able to reach it freely.
  // Public pages (/, /pricing, /terms, /privacy, /refund, /blog, etc.)
  // run WITHOUT middleware — they are never behind any auth wall.
  matcher: ["/dashboard/:path*", "/bulk/:path*"],
};
