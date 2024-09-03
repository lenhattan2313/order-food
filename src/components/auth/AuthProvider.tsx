"use client";
import { sessionClient } from "@/actions/auth/token";
import { AccessToken } from "@/interface/IAuth";
import { isClient } from "@/lib/utils";
import { FC, PropsWithChildren, useState } from "react";

export const AuthProvider: FC<
  PropsWithChildren<{ initialSessionToken: AccessToken }>
> = ({ children, initialSessionToken }) => {
  useState(() => {
    if (isClient()) {
      sessionClient.set({
        accessToken: initialSessionToken.accessToken,
        refreshToken: initialSessionToken.refreshToken,
      });
    }
  });
  return <>{children}</>;
};
