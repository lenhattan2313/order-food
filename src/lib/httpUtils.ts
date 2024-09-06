import envConfig from "@/config";
import { HTTP_METHOD, IHttpOptions } from "@/interface/http";
import { EntityError, HttpError } from "@/lib/error";
import { localStorageUtil } from "@/lib/storageUtils";
import { isClient, normalizeUrl } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { StatusCodes } from "http-status-codes";
import { redirect } from "next/navigation";

//this file is using in server and client
let logoutRequest: (() => Promise<Response>) | null = null;
const request = async <T = Response>(
  method: HTTP_METHOD,
  url: string,
  options?: IHttpOptions
): Promise<T> => {
  const body = options?.body ?? undefined;
  const bodyParams = body
    ? body instanceof FormData
      ? body
      : JSON.stringify(body)
    : undefined;
  //handle URL
  //empty baseURL => nextjs server, baseUrl => backend server
  const { baseUrl = "", ...restOption } = options ?? {};
  const baseHeader: Record<string, string> =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  if (isClient) {
    const accessToken = localStorageUtil.get("accessToken");
    if (accessToken) {
      baseHeader.Authorization = `Bearer ${accessToken}`;
    }
  }

  const baseOptions: RequestInit = {
    ...restOption,
    body: bodyParams,
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
      if (isClient) {
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
        const accessToken =
          typeof baseOptions?.headers === "object" &&
          "Authorization" in baseOptions.headers
            ? baseOptions.headers.Authorization.split("Bearer ")[1]
            : "";

        accessToken && redirect(`/login?accessToken=${accessToken}`);
      }
    }
    throw new HttpError(data);
  }
  const data: T = await response.json();

  if (isClient) {
    if (normalizeUrl(url) === "api/auth/login") {
      const {
        data: { accessToken, refreshToken },
      } = data as LoginResType;
      localStorageUtil.set("accessToken", accessToken);
      localStorageUtil.set("refreshToken", refreshToken);
    } else if (normalizeUrl(url) === "api/auth/logout") {
      localStorageUtil.remove("accessToken");
      localStorageUtil.remove("refreshToken");
    }
  }
  return data;
};

const http = {
  get<T>(url: string, options?: IHttpOptions) {
    return request<T>("GET", url, options);
  },
  post<T, K>(url: string, body?: K, options?: IHttpOptions) {
    return request<T>("POST", url, {
      ...options,
      body,
    });
  },
  put<T, K>(url: string, body?: K, options?: IHttpOptions) {
    return request<T>("PUT", url, {
      ...options,
      body,
    });
  },
};

export default http;
