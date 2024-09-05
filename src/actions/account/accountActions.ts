import envConfig from "@/config";
import http from "@/lib/httpUtils";
import {
  AccountResType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { cookies } from "next/headers";
export const accountActions = {
  getMe: () =>
    http.get<AccountResType>("/accounts/me", {
      baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
    }),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType, UpdateMeBodyType>("/accounts/me", body, {
      baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
    }),
};
