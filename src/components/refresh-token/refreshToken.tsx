"use client";

import { REFRESH_TOKEN_TIMEOUT } from "@/constants/common";
import { UNAUTHORIZED_URL } from "@/constants/url";
import { checkAccessTokenExpire } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
//Do not allow accessToken expired, using interval to check
export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHORIZED_URL.includes(pathname)) return;
    let intervalId: ReturnType<typeof setInterval> | undefined = undefined;
    intervalId = setInterval(
      () =>
        checkAccessTokenExpire({ onError: () => clearInterval(intervalId) }),
      REFRESH_TOKEN_TIMEOUT
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [pathname]);
  return null;
}
