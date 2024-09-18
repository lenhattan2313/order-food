"use client";

import envConfig from "@/config";
import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import { localStorageUtil } from "@/lib/storageUtils";
import { Socket, io } from "socket.io-client";

class WebSocket {
  private socket: Socket | null = null;

  connect() {
    const token = localStorageUtil.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN) ?? "";
    if (!token) {
      console.error("Don't have any access token to establish socket");
      return;
    }
    if (!this.socket) {
      this.socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
        auth: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.socket.on("connect", () => {
        console.log("WebSocket connected:", this.socket?.id);
      });

      this.socket.on("disconnect", () => {
        console.log("WebSocket disconnected");
      });
    }
  }

  on<T>(event: string, callback: (...args: T[]) => void) {
    this.socket?.on(event, callback);
  }

  off<T>(event: string, callback: (...args: T[]) => void) {
    this.socket?.off(event, callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
export const socket = new WebSocket();
