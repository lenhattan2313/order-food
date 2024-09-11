import { PREFIX_URL } from "@/constants/url";
import http from "@/lib/httpUtils";
import {
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";
import {
  GuestLoginBodyType,
  GuestLoginResType,
} from "@/schemaValidations/guest.schema";

export const guestActions = {
  refreshTokenRequest: null as Promise<RefreshTokenResType> | null,
  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType, GuestLoginBodyType>(
      `${PREFIX_URL.GUEST}/auth/login`,
      body
    ),
  //set cookies
  sLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType, GuestLoginBodyType>(
      `api/guest/auth/login`,
      body,
      { baseUrl: "" }
    ),

  logout: ({
    refreshToken,
    accessToken,
  }: LogoutBodyType & { accessToken: string }) =>
    http.post<MessageResType, LogoutBodyType>(
      `${PREFIX_URL.GUEST}/auth/logout`,
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
  //remove cookies
  sLogout: () =>
    http.post<MessageResType>(`api/guest/auth/logout`, undefined, {
      baseUrl: "",
    }),

  refreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType, RefreshTokenBodyType>(
      `${PREFIX_URL.GUEST}/auth/refresh-token`,
      body
    ),
  //update cookies
  sRefreshToken: async function () {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<
      RefreshTokenResType,
      RefreshTokenBodyType
    >(`api/guest/auth/refresh-token`, undefined, { baseUrl: "" });
    const response = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return response;
  },
};
