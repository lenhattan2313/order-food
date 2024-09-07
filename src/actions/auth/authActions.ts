import envConfig from "@/config";
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
    http.post<LoginResType, LoginBodyType>("/api/auth/login", body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType, LoginBodyType>("/auth/login", body, {
      baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
    }),
  sLogout: () => http.post("/api/auth/logout", undefined),
  logout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post<Response, LogoutBodyType>(
      "/auth/logout",
      { refreshToken: body.refreshToken },
      {
        baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  refreshToken: async function () {
    //only call 1 time
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<LoginResType, undefined>(
      "/api/auth/refresh-token",
      undefined
    );
    const result = await this.refreshTokenRequest;

    this.refreshTokenRequest = null;

    return result;
  },
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<LoginResType, RefreshTokenBodyType>("/auth/refresh-token", body, {
      baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
    }),
};
