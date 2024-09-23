import { LOCAL_STORAGE_KEY } from "@/constants/localStorage";
import { cookies } from "next/headers";
import "server-only";
export const getTokenCookies = () => {
  const cookieStore = cookies();

  // Get access token and refresh token from cookies
  const accessToken =
    cookieStore.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN)?.value ?? "";
  const refreshToken =
    cookieStore.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN)?.value ?? "";

  return {
    accessToken,
    refreshToken,
  };
};
export const wrapServerApi = async <T>(fn: () => Promise<T>) => {
  let data: T | null = null;
  try {
    data = await fn();
    return data;
  } catch (error: any) {
    if (error.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
  }
  return data;
};
