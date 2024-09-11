import { Role } from "@/constants/type";
import { getTokenCookies } from "@/lib/serverUtils";
import { decodeJWT } from "@/lib/utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const guestPaths = ["/guest"];
const managePaths = ["/manage"];
const unAuthRoutes = ["/login", "/register"];
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const { accessToken, refreshToken } = getTokenCookies();
  const isPublicRoutes = unAuthRoutes.some((route) => route.includes(pathname));
  //when not log in or accessToken expired
  if (!accessToken) {
    if (isPublicRoutes && refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (!isPublicRoutes) {
      let url = new URL("/login", request.url);
      if (refreshToken) {
        url = new URL("/refresh-token", request.url);
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
    if (isPublicRoutes) {
      const params = searchParams.get("accessToken");
      if (params) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/", request.url));
    }
    //try to access path without permission
    const role = decodeJWT(accessToken)?.role;
    const isGuestPaths = guestPaths.some((route) => pathname.includes(route));
    const isManagePaths = managePaths.some((route) => pathname.includes(route));
    if (
      role &&
      ((role === Role.Guest && !isGuestPaths) ||
        (role === Role.Owner && !isManagePaths))
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/manage/:path*", "/guest/:path*"],
};
