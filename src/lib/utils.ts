import { authActions } from "@/actions/auth/authActions";
import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import { toast } from "@/hooks/use-toast";
import { HttpError } from "@/lib/error";
import {
  clearTokenFromLocalStorage,
  localStorageUtil,
} from "@/lib/storageUtils";
import { clsx, type ClassValue } from "clsx";
import jwt, { JwtPayload } from "jsonwebtoken";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function normalizeUrl(url: string) {
  return url.startsWith("/") ? url.slice(1) : url;
}
export const isClient = typeof window !== "undefined";

export function handleApiError<T extends FieldValues>(
  error: unknown,
  setError?: UseFormSetError<T>
) {
  if (error instanceof HttpError && setError) {
    error.errors.forEach(({ field, message }: FieldValues) => {
      setError(field, {
        message,
        type: "server",
      });
    });
  } else {
    toast({
      description: (error as Error).message,
    });
  }
}

export const checkAccessTokenExpire = async (
  params?: Partial<{
    onError: () => void;
    onSuccess: () => void;
  }>
) => {
  const accessToken =
    localStorageUtil.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN) ?? "";
  const refreshToken =
    localStorageUtil.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN) ?? "";
  if (!accessToken) return;
  const now = Date.now() / 1000;
  const refreshTokenExpired = (jwt.decode(refreshToken) as JwtPayload).exp ?? 0;
  //check refreshToken expired first, logout if expired
  const { iat = 0, exp = 0 } = jwt.decode(accessToken) as JwtPayload;
  if (refreshTokenExpired > now) {
    //example: expired 10s, 2/3 of 10s = 6s, => 6s will call api refreshToken
    //exp - now: thời gian còn lại
    //exp - iat: thời gian hết hạn
    if (exp - now < (exp - iat) / 3) {
      try {
        const {
          data: { accessToken, refreshToken },
        } = await authActions.refreshToken();
        localStorageUtil.set(LOCAL_STORAGE_KEY.ACCESS_TOKEN, accessToken);
        localStorageUtil.set(LOCAL_STORAGE_KEY.REFRESH_TOKEN, refreshToken);
        params?.onSuccess && params.onSuccess();
      } catch (error) {
        params?.onError && params.onError();
      }
    }
    return;
  }
  if (exp < now - 1) {
    clearTokenFromLocalStorage();
    return params?.onError && params.onError();
  }
};
