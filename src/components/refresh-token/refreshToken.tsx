"use client";

import { authActions } from "@/actions/auth/authActions";
import { REFRESH_TOKEN_TIMEOUT } from "@/constants/common";
import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import { UNAUTHORIZED_URL } from "@/constants/url";
import { localStorageUtil } from "@/lib/storageUtils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
//Do not allow accessToken expired, using interval to check
export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHORIZED_URL.includes(pathname)) return;
    let intervalId: ReturnType<typeof setInterval> | undefined = undefined;
    const checkAccessTokenExpire = async () => {
      const accessToken =
        localStorageUtil.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN) ?? "";
      const refreshToken =
        localStorageUtil.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN) ?? "";
      if (!accessToken) return;
      const now = Date.now() / 1000;
      const refreshTokenExpired =
        (jwt.decode(refreshToken) as JwtPayload).exp ?? 0;
      //check refreshToken expired first
      if (refreshTokenExpired <= now) return;
      const { iat = 0, exp = 0 } = jwt.decode(accessToken) as JwtPayload;
      //example: expired 10s, 2/3 of 10s = 6s, => 6s will call api refreshToken
      //exp - now: thời gian còn lại
      //exp - iat: thời gian hết hạn
      if (exp - now < (exp - iat) / 3) {
        try {
          const {
            data: { accessToken, refreshToken },
          } = await authActions.refreshToken();
          localStorageUtil.set(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
          localStorageUtil.set(LOCAL_STORAGE_KEY.REFRESH_TOKEN, refreshToken);
        } catch (error) {
          clearInterval(intervalId);
        }
      }
    };

    intervalId = setInterval(checkAccessTokenExpire, REFRESH_TOKEN_TIMEOUT);

    return () => {
      clearInterval(intervalId);
    };
  }, [pathname]);
  return null;
}
