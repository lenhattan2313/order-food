import { StatusCodes } from "http-status-codes";
export type HTTP_METHOD = "POST" | "GET" | "PUT" | "DELETE";
export type HTTP_OPTIONS = Omit<RequestInit, "method"> & {
  baseUrl?: string;
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
