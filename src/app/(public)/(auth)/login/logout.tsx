"use client";
import { useAuth } from "@/components/provider/auth-provider";
import { localStorageUtil } from "@/lib/storageUtils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useSearchParams } from "next/navigation";
import { Suspense, memo, useEffect, useRef } from "react";

const Logout = () => {
  const { setIsAuth } = useAuth();
  const { mutateAsync } = useLogoutMutation();
  const searchParams = useSearchParams();
  const ref = useRef(false);
  const accessToken = searchParams.get("accessToken") ?? "";
  const refreshToken = searchParams.get("refreshToken") ?? "";

  useEffect(() => {
    if (
      (refreshToken === localStorageUtil.get("refreshToken") ||
        accessToken === localStorageUtil.get("accessToken")) &&
      !ref.current
    ) {
      ref.current = true;
      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = true;
        }, 1000);
      });
    } else {
      setIsAuth(false);
    }
  }, [mutateAsync, refreshToken, accessToken]);
  return null;
};
export default memo(function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  );
});
