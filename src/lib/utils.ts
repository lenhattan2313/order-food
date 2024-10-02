import { authActions } from "@/apiRequest/auth/authActions";
import { guestActions } from "@/apiRequest/guest/guestActions";
import envConfig from "@/config";
import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import { Role } from "@/constants/type";
import { toast } from "@/hooks/use-toast";
import { TokenPayload } from "@/interface/IAuth";
import { HttpError } from "@/lib/error";
import {
  clearTokenFromLocalStorage,
  localStorageUtil,
} from "@/lib/storageUtils";
import { clsx, type ClassValue } from "clsx";
import { jwtDecode } from "jwt-decode";
import { FieldValues, UseFormSetError } from "react-hook-form";
import slugify from "slugify";
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
  if (error instanceof HttpError && setError && error.errors.length) {
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
    force: boolean;
  }>
) => {
  const accessToken =
    localStorageUtil.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN) ?? "";
  const refreshToken =
    localStorageUtil.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN) ?? "";
  if (!accessToken) return;
  const now = Date.now() / 1000;
  const refreshTokenExpired = decodeJWT(refreshToken)?.exp ?? 0;
  //check refreshToken expired first, logout if expired
  const { iat = 0, exp = 0, role } = decodeJWT(accessToken) ?? {};
  if (refreshTokenExpired > now) {
    //example: expired 10s, 2/3 of 10s = 6s, => 6s will call api refreshToken
    //exp - now: thời gian còn lại
    //exp - iat: thời gian hết hạn
    if (exp - now < (exp - iat) / 3 || params?.force) {
      try {
        const {
          data: { accessToken, refreshToken },
        } =
          role === Role.Guest
            ? await guestActions.sRefreshToken()
            : await authActions.sRefreshToken();
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

export function decodeJWT<T extends TokenPayload>(token: string): T | null {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode<T>(token);
    return decoded;
  } catch (error) {
    console.error("Invalid JWT token:", error);
    return null;
  }
}

export function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  );
};

export const generateSlugUrl = ({ name, id }: { name: string; id: number }) => {
  return `${slugify(name)}-i.${id}`;
};

export const getIdFromSlugUrl = (slug: string) => {
  return Number(slug.split("-i.")[1]);
};
export const createImagePathS3 = (name: string, prefix = "") => {
  return [envConfig.NEXT_PUBLIC_AWS_S3_IMAGE_SOURCE, prefix, name]
    .filter(Boolean)
    .join("/");
};
export const getImagePathS3 = (name: string) => {
  return `${envConfig.NEXT_PUBLIC_AWS_S3_IMAGE_SOURCE}/${name}`;
};
