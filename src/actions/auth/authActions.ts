import http from "@/lib/httpUtils";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

export const authActions = {
  login: (body: LoginBodyType) =>
    http.post<LoginResType, LoginBodyType>("/api/login", body),
};
