import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/navigation";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes (regex to match with or without locale)
  // Matches: /admin, /en/admin, /psb/registrants, /ar/psb/registrants
  const protectedPaths = ["/admin", "/psb/registrants"];

  // Helper to remove locale from path to check against protected routes
  const pathWithoutLocale = pathname.replace(/^\/(id|en|ar)/, "") || "/";

  const isProtected = protectedPaths.some((route) => pathWithoutLocale.startsWith(route));

  // Exclude login page from protection
  const isLoginPage = pathWithoutLocale === "/admin/login";

  if (isProtected && !isLoginPage && !token) {
    // Redirect to login page, preserving locale if present
    const localeMatch = pathname.match(/^\/(id|en|ar)/);
    const locale = localeMatch ? localeMatch[0] : "/id";

    // Ensure locale doesn't have double slash if it was empty string (though regex above prevents it)
    const normalizedLocale = locale === "/" ? "/id" : locale;

    const loginUrl = new URL(`${normalizedLocale}/admin/login`, request.url);
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
