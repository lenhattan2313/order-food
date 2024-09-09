import { PREFIX_URL } from "@/constants/url";
import http from "@/lib/httpUtils";
import {
  AccountIdParamType,
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
type IUpdateAccountType = AccountIdParamType & UpdateEmployeeAccountBodyType;
export const accountActions = {
  getMe: () => http.get<AccountResType>(`${PREFIX_URL.ACCOUNT}/me`),
  sGetMe: (accessToken: string) =>
    http.get<AccountResType>(`${PREFIX_URL.ACCOUNT}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType, UpdateMeBodyType>(
      `${PREFIX_URL.ACCOUNT}/me`,
      body
    ),
  changePassword: (body: ChangePasswordBodyType) =>
    http.put<AccountResType, ChangePasswordBodyType>(
      "/accounts/change-password",
      body
    ),

  //account page
  getList: () => http.get<AccountListResType>(`${PREFIX_URL.ACCOUNT}`),
  createEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType, CreateEmployeeAccountBodyType>(
      `${PREFIX_URL.ACCOUNT}`,
      body
    ),

  getEmployeeDetail: ({ id }: AccountIdParamType) =>
    http.get<AccountResType>(`${PREFIX_URL.ACCOUNT}/detail/${id}`),
  updateEmployee: ({ id, ...body }: IUpdateAccountType) =>
    http.put<AccountResType, UpdateEmployeeAccountBodyType>(
      `${PREFIX_URL.ACCOUNT}/detail/${id}`,
      body
    ),
  deleteEmployee: ({ id }: AccountIdParamType) =>
    http.delete<AccountResType>(`${PREFIX_URL.ACCOUNT}/${id}`),
};
