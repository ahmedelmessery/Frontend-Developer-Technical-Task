import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy (middleware) — auth route guards only.
 * Authenticated users are redirected away from login/register back to home.
 */

const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("routemisr_token")?.value;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect already-authenticated users away from login/register
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};
