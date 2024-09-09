import { IPaginationParams } from "@/interface/common";

export const REFRESH_TOKEN_TIMEOUT = 1000;
export const defaultPagination: IPaginationParams = {
  page: 1,
  pageSize: 10,
} as const;
