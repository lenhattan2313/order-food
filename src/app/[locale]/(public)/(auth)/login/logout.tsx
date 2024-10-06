"use client";
import { useAuth } from "@/components/provider/auth-provider";
import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import { localStorageUtil } from "@/lib/storageUtils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useSearchParams } from "next/navigation";
import { Suspense, memo, useEffect, useRef } from "react";

const Logout = () => {
  const { setRole } = useAuth();
  const { mutateAsync } = useLogoutMutation();
  const searchParams = useSearchParams();
  const ref = useRef(false);
  const accessToken = searchParams.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN) ?? "";
  const refreshToken = searchParams.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN) ?? "";

  useEffect(() => {
    if (
      (refreshToken === localStorageUtil.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN) ||
        accessToken === localStorageUtil.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN)) &&
      !ref.current
    ) {
      ref.current = true;
      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = true;
        }, 1000);
      });
    } else {
      setRole(undefined);
    }
  }, [mutateAsync, refreshToken, accessToken, setRole]);
  return null;
};
export default memo(function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  );
});
