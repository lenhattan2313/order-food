import envConfig from "@/config";
import http from "@/lib/httpUtils";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

export const authActions = {
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResType, LoginBodyType>("/api/auth/login", body),
  login: (body: LoginBodyType) =>
    http.post<LoginResType, LoginBodyType>("/auth/login", body, {
      baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
    }),
};
