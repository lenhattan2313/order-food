import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/login", "/register"];
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const isPublicRoutes = publicRoutes.some((route) => route.includes(pathname));
  if (!accessToken && !isPublicRoutes) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (accessToken && isPublicRoutes) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/manage/:path*"],
};
