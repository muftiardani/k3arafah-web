import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/navigation";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes chunks
  const protectedRoutes = ["/dashboard", "/students", "/registrants", "/users", "/gallery"];

  // Helper to remove locale from path to check against protected routes
  let pathWithoutLocale = pathname.replace(/^\/(id|en)/, "") || "/";
  if (pathWithoutLocale.length > 1 && pathWithoutLocale.endsWith("/")) {
    pathWithoutLocale = pathWithoutLocale.slice(0, -1);
  }

  const isProtected = protectedRoutes.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  // Exclude login itself (redundant if using positive list logic above but safe)
  const isLoginPage = pathWithoutLocale === "/login";

  if (isProtected && !isLoginPage && !token) {
    // Redirect to login page, preserving locale if present
    const localeMatch = pathname.match(/^\/(id|en)/);
    const locale = localeMatch ? localeMatch[0] : "/id";

    // Ensure locale doesn't have double slash if it was empty string
    const normalizedLocale = locale === "/" ? "/id" : locale;

    const loginUrl = new URL(`${normalizedLocale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
