import { IPaginationParams } from "@/interface/common";
import { endOfDay, startOfDay } from "date-fns";

export const REFRESH_TOKEN_TIMEOUT = 1000;
export const defaultPagination: IPaginationParams = {
  page: 1,
  pageSize: 1,
} as const;
export const dateRangeDefault = {
  fromDate: startOfDay(new Date()),
  toDate: endOfDay(new Date()),
};
