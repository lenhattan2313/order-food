import { Role } from '@/constants/type';
import { getTokenCookies } from '@/lib/serverUtils';
import { decodeJWT } from '@/lib/utils';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
const basePaths = {
  guest: ['/guest'],
  manage: ['/manage'],
  owner: ['/manage/accounts'],
  unAuth: ['/login', '/register', '/tables'],
  root: [''],
};
const guestPaths = basePaths.guest;
const managePaths = basePaths.manage;
const ownerPaths = basePaths.owner;
const unAuthPaths = basePaths.unAuth;
const rootPaths = basePaths.root;

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const { accessToken, refreshToken } = getTokenCookies();
  const isUnAuthPaths = unAuthPaths.some(
    (route) => pathname.includes(route) && !pathname.includes('/manage'),
  );
  const isRootRoutes = rootPaths.some((route) => pathname.includes(route));
  //when not log in or accessToken expired
  if (!accessToken) {
    if ((isUnAuthPaths && refreshToken) || pathname === '/') {
      return NextResponse.redirect(new URL(`/`, request.url));
    }
    if (!isUnAuthPaths && !isRootRoutes) {
      let url = new URL(`/login`, request.url);
      if (refreshToken) {
        url = new URL(`/refresh-token`, request.url);
        url.searchParams.set('refreshToken', refreshToken);
        url.searchParams.set('redirect', pathname);
      } else {
        url.searchParams.set('clearToken', 'true'); //access private route but all token expired
      }
      return NextResponse.redirect(url);
    }
  }

  //try to navigate unAuthRoute when already logged in
  if (accessToken) {
    if (isUnAuthPaths) {
      const params = searchParams.get('accessToken');
      if (params) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL(`/`, request.url));
    }
    //try to access path without permission
    const role = decodeJWT(accessToken)?.role;
    const isGuestPaths = guestPaths.some((route) => pathname.startsWith(route));
    const isManagePaths = managePaths.some((route) =>
      pathname.startsWith(route),
    );
    const isOwnerPaths = ownerPaths.some((route) => pathname.startsWith(route));
    if (
      role &&
      ((role === Role.Guest && isManagePaths) ||
        (role !== Role.Guest && isGuestPaths) ||
        (role !== Role.Owner && isOwnerPaths))
    ) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/manage/:path*',
    '/guest/:path*',
    '/tables/:path*',
  ],
};
