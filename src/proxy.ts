import { NextResponse, type NextRequest } from "next/server";

// Cheap gate in front of the member app and the studio: no session cookie
// means straight to sign-in, with a way back. Layouts still verify the session
// properly on the server; this only saves a render and keeps the return path.

const PUBLIC_PATHS = new Set(["/studio/login", "/studio/register", "/studio/forgot-password", "/app/login", "/app/register"]);
const SESSION_COOKIES = ["authjs.session-token", "__Secure-authjs.session-token"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next();

  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name) || request.cookies.has(`${name}.0`));
  if (hasSession) return NextResponse.next();

  const login = new URL(pathname.startsWith("/studio") ? "/studio/login" : "/login", request.url);
  login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/app/:path*", "/studio/:path*", "/admin/:path*"],
};
