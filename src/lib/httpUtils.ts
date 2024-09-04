import envConfig from "@/config";
import { HTTP_METHOD, HTTP_OPTIONS } from "@/interface/http";
import { EntityError, HttpError } from "@/lib/error";
import { localStorageUtil } from "@/lib/storageUtils";
import { isClient, normalizeUrl } from "@/lib/utils";
import { StatusCodes } from "http-status-codes";
import { redirect } from "next/navigation";

//this file is using in server and client
let logoutRequest: (() => Promise<Response>) | null = null;
const request = async <T = Response>(
  method: HTTP_METHOD,
  url: string,
  options?: HTTP_OPTIONS
): Promise<T> => {
  //handle URL
  //empty baseURL => nextjs server, baseUrl => backend server
  const { baseUrl = "", ...restOption } = options ?? {};
  const baseHeader: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (isClient()) {
    const accessToken = localStorageUtil.get("accessToken");
    if (accessToken) {
      baseHeader.Authorization = `Bearer ${accessToken}`;
    }
  }

  const baseOptions: RequestInit = {
    ...restOption,
    headers: { ...baseHeader, ...(restOption?.headers ?? {}) },
  };
  const fullUrl = `${baseUrl}/${normalizeUrl(url)}`;
  const response = await fetch(fullUrl, {
    method,
    ...baseOptions,
  });

  //handle error
  if (!response.ok) {
    const data: EntityError = await response.json();

    if (response.status === StatusCodes.UNPROCESSABLE_ENTITY) {
      throw new EntityError(data);
    } else if (response.status === StatusCodes.UNAUTHORIZED) {
      //handle UNAUTHORIZED
      if (isClient()) {
        //handle at client side
        if (!logoutRequest) {
          logoutRequest = () =>
            fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/logout`, {
              method: "POST",
              headers: baseHeader,
              body: JSON.stringify({
                refreshToken: localStorageUtil.get("refreshToken"),
              }),
            });
          await logoutRequest();
          logoutRequest = null;
          localStorageUtil.remove("accessToken");
          localStorageUtil.remove("refreshToken");
          redirect("/login");
        }
      } else {
        //handle at server side
        //TODO
        // const accessToken = baseOptions
      }
    }
    throw new HttpError(data);
  }
  const data: T = await response.json();

  return data;
};

const http = {
  get<T>(url: string, options?: Omit<HTTP_OPTIONS, "body">) {
    return request<T>("GET", url, options);
  },
  post<T, K>(url: string, body?: K, options?: HTTP_OPTIONS) {
    return request<T>("POST", url, {
      ...options,
      body: body ? JSON.stringify(body) : undefined,
    });
  },
};

export default http;
