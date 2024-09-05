import envConfig from "@/config";
import http from "@/lib/httpUtils";
import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
export const accountActions = {
  getMe: () =>
    http.get<AccountResType>("/accounts/me", {
      baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
    }),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType, UpdateMeBodyType>("/accounts/me", body, {
      baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
    }),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType, ChangePasswordBodyType>(
      "/accounts/change-password",
      body,
      {
        baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT,
      }
    ),
};
