"use client";
import { useAuth } from "@/components/provider/auth-provider";
import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import { localStorageUtil } from "@/lib/storageUtils";
import { checkAccessTokenExpire } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, memo, useEffect } from "react";

function RefreshToken() {
  const { setIsAuth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") ?? "/";
  const refreshTokenUrl =
    searchParams.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN) ?? "/";
  useEffect(() => {
    const refreshToken = localStorageUtil.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN);
    if (refreshToken !== refreshTokenUrl) {
      setIsAuth(false);
      return;
    }
    checkAccessTokenExpire({
      onSuccess: () => {
        router.push(redirectPath);
      },
    });
  }, [pathname, refreshTokenUrl, setIsAuth, router, redirectPath]);
  return null;
}

export default memo(function RefreshTokenPage() {
  return (
    <Suspense>
      <RefreshToken />
    </Suspense>
  );
});
