import envConfig from "@/config";
export type HTTP_METHOD = "POST" | "GET" | "PUT" | "DELETE";
export type HTTP_OPTIONS = Omit<RequestInit, "method"> & {
  baseUrl?: string;
};
export type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};
