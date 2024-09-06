import envConfig from "@/config";
import http from "@/lib/httpUtils";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
} from "@/schemaValidations/auth.schema";

export const authActions = {
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
};
