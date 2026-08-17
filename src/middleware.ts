import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail, isSafeRedirectPath } from "@/lib/validation";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";
  const isProtectedPublicRoute = pathname.startsWith("/account") || pathname === "/checkout";
  const isPublicLoginPage = pathname === "/login" || pathname === "/register";
  const isAdmin = !!user && isAdminEmail(user.email);

  // /admin/:path* — being authenticated is not enough; the session must belong to an
  // ADMIN_EMAILS-listed account, since public customer registration exists now too.
  if (isAdminRoute && !isAdminLoginPage && !isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirected", "true");
    return NextResponse.redirect(url);
  }

  if (isAdminLoginPage && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Public site: /account/:path* and /checkout require a logged-in customer.
  if (isProtectedPublicRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    if (isSafeRedirectPath(pathname)) {
      url.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(url);
  }

  // /login and /register redirect an already-logged-in customer straight to /account.
  if (isPublicLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAdminRoute) {
    supabaseResponse.headers.set("X-Frame-Options", "DENY");
    supabaseResponse.headers.set("X-Content-Type-Options", "nosniff");
    supabaseResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    supabaseResponse.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
    supabaseResponse.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co;",
    );
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout", "/login", "/register"],
};
