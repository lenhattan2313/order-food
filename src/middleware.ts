import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const unAuthRoutes = ["/login", "/register"];
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isPublicRoutes = unAuthRoutes.some((route) => route.includes(pathname));
  //when not log in or accessToken expired
  if (!accessToken) {
    if (isPublicRoutes && refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    let url = new URL("/login", request.url);
    if (refreshToken) {
      url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(url);
  }

  //try to navigate unAuthRoute when already logged in
  if (accessToken && isPublicRoutes) {
    const params = searchParams.get("accessToken");
    if (params) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/manage/:path*"],
};
