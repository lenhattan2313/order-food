"use client";

import { useAuth } from "@/components/provider/auth-provider";
import { REFRESH_TOKEN_TIMEOUT } from "@/constants/common";
import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import { SOCKET_EVENT } from "@/constants/socket";
import { UNAUTHORIZED_URL } from "@/constants/url";
import { socket } from "@/lib/socket";
import { localStorageUtil } from "@/lib/storageUtils";
import { checkAccessTokenExpire, decodeJWT } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
//Do not allow accessToken expired, using interval to check
export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter();
  const { setRole } = useAuth();
  useEffect(() => {
    if (UNAUTHORIZED_URL.includes(pathname)) return;
    let intervalId: ReturnType<typeof setInterval> | undefined = undefined;
    function onRefreshToken(force = false) {
      return checkAccessTokenExpire({
        onError: () => {
          clearInterval(intervalId);
          router.push("/login");
        },
        force,
      });
    }
    intervalId = setInterval(onRefreshToken, REFRESH_TOKEN_TIMEOUT);

    //socket
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      console.log(socket.id);
    }
    function onDisconnect() {
      console.log("disconnect socket");
    }
    async function onRefreshTokenSocket() {
      await onRefreshToken(true);
      const accessToken =
        localStorageUtil.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN) ?? "";
      const role = decodeJWT(accessToken)?.role;
      role && setRole(role);
    }
    //Lắng nghe sự kiến
    socket.on(SOCKET_EVENT.CONNECT, onConnect);
    socket.on(SOCKET_EVENT.DISCONNECT, onDisconnect);
    socket.on(SOCKET_EVENT.REFRESH_TOKEN, onRefreshTokenSocket);
    return () => {
      clearInterval(intervalId);
      //huỷ lắng nghe sự kiện
      socket.off(SOCKET_EVENT.CONNECT, onConnect);
      socket.off(SOCKET_EVENT.DISCONNECT, onConnect);
      socket.off(SOCKET_EVENT.REFRESH_TOKEN, onRefreshTokenSocket);
    };
  }, [pathname, router]);
  return null;
}
