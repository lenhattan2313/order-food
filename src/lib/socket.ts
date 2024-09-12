"use client";

import envConfig from "@/config";
import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import { localStorageUtil } from "@/lib/storageUtils";
import { io } from "socket.io-client";

export const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
  auth: {
    Authorization: `Bearer ${localStorageUtil.get(
      LOCAL_STORAGE_KEY.ACCESS_TOKEN
    )}`,
  },
});
