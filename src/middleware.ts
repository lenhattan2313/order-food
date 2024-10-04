import { Role } from "@/constants/type";
import { getTokenCookies } from "@/lib/serverUtils";
import { decodeJWT } from "@/lib/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { cookies } from "next/headers";
import { NEXT_LOCALE, defaultLocale } from "@/constants/locale";

const guestPaths = ["/vi/guest", "/en/guest"];
const managePaths = ["/vi/manage", "/en/manage"];
const ownerPaths = ["/vi/manage/accounts", "/en/manage/accounts"];
const unAuthPaths = [
  "/vi/login",
  "/en/login",
  "/vi/register",
  "/en/register",
  "/vi/tables",
  "/en/tables",
];
const rootPaths = ["/vi", "/en"];
export function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);

  const cookieStore = cookies();
  const locale = cookieStore.get(NEXT_LOCALE)?.value ?? defaultLocale;
  const { pathname, searchParams } = request.nextUrl;
  const { accessToken, refreshToken } = getTokenCookies();
  const isUnAuthPaths = unAuthPaths.some((route) => pathname.includes(route));
  const isRootRoutes = rootPaths.some((route) => pathname.includes(route));
  //when not log in or accessToken expired
  if (!accessToken) {
    if (isUnAuthPaths && refreshToken) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    if (!isUnAuthPaths && !isRootRoutes) {
      let url = new URL(`/${locale}/login`, request.url);
      if (refreshToken) {
        url = new URL(`/${locale}/refresh-token`, request.url);
        url.searchParams.set("refreshToken", refreshToken);
        url.searchParams.set("redirect", pathname);
      } else {
        url.searchParams.set("clearToken", "true"); //access private route but all token expired
      }
      return NextResponse.redirect(url);
    }
  }

  //try to navigate unAuthRoute when already logged in
  if (accessToken) {
    if (isUnAuthPaths) {
      const params = searchParams.get("accessToken");
      if (params) {
        return response;
      }
      return NextResponse.redirect(new URL(`/${locale}/`, request.url));
    }
    //try to access path without permission
    const role = decodeJWT(accessToken)?.role;
    const isGuestPaths = guestPaths.some((route) => pathname.startsWith(route));
    const isManagePaths = managePaths.some((route) =>
      pathname.startsWith(route)
    );
    const isOwnerPaths = ownerPaths.some((route) => pathname.startsWith(route));
    if (
      role &&
      ((role === Role.Guest && isManagePaths) ||
        (role !== Role.Guest && isGuestPaths) ||
        (role !== Role.Owner && isOwnerPaths))
    ) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/", "/(vi|en)/:path*"],
};
