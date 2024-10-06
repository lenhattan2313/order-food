import { Role } from "@/constants/type";
import z from "zod";
import { useTranslations } from "next-intl";

export const useLoginSchema = () => {
  const t = useTranslations("form");
  return z
    .object({
      email: z.string().email(t("emailInvalid")),
      password: z.string().min(6, t("passwordInvalid")).max(100),
    })
    .strict();
};
export type LoginBodyType = z.infer<ReturnType<typeof useLoginSchema>>;

export const LoginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    account: z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      role: z.enum([Role.Owner, Role.Employee]),
    }),
  }),
  message: z.string(),
});

export type LoginResType = z.TypeOf<typeof LoginRes>;

export const RefreshTokenBody = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type RefreshTokenBodyType = z.TypeOf<typeof RefreshTokenBody>;

export const RefreshTokenRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
  message: z.string(),
});

export type RefreshTokenResType = z.TypeOf<typeof RefreshTokenRes>;

export const LogoutBody = z
  .object({
    refreshToken: z.string(),
  })
  .strict();

export type LogoutBodyType = z.TypeOf<typeof LogoutBody>;
