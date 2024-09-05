import envConfig from "@/config";
import http from "@/lib/httpUtils";
import { AccountResType } from "@/schemaValidations/account.schema";
import { cookies } from "next/headers";
export const accountActions = {
  getProfile: (token: string) =>
    http.get("/accounts/me", {
      baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getMe: () =>
    http.get<AccountResType>("/accounts/me", {
      baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
    }),
};
