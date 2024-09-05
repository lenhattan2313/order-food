import { StatusCodes } from "http-status-codes";
export type HTTP_METHOD = "POST" | "GET" | "PUT" | "DELETE";
export type IHttpOptions = Omit<RequestInit, "method" | "body"> & {
  baseUrl?: string;
  body?: unknown;
};
export type EntityErrorPayload = {
  message: string;
  errors: IFieldError[];
  status: StatusCodes;
};

export type IFieldError = {
  field: string;
  message: string;
};
