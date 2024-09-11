import http from "@/lib/httpUtils";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
} from "@/schemaValidations/auth.schema";

export const authActions = {
  refreshTokenRequest: null as Promise<LoginResType> | null,
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResType, LoginBodyType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  login: (body: LoginBodyType) =>
    http.post<LoginResType, LoginBodyType>("/auth/login", body),
  sLogout: () => http.post("/api/auth/logout", undefined, { baseUrl: "" }),
  logout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post<Response, LogoutBodyType>(
      "/auth/logout",
      { refreshToken: body.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  sRefreshToken: async function () {
    //only call 1 time
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<LoginResType, undefined>(
      "/api/auth/refresh-token",
      undefined,
      { baseUrl: "" }
    );
    const result = await this.refreshTokenRequest;

    this.refreshTokenRequest = null;

    return result;
  },
  refreshToken: (body: RefreshTokenBodyType) =>
    http.post<LoginResType, RefreshTokenBodyType>("/auth/refresh-token", body),
};
