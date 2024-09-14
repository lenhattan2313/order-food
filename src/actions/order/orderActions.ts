import { PREFIX_URL } from "@/constants/url";
import http from "@/lib/httpUtils";
import {
  GetOrdersQueryParamsType,
  GetOrdersResType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";

export const orderActions = {
  getList: (queryParams?: GetOrdersQueryParamsType) => {
    const params = queryParams
      ? {
          fromDate: queryParams.fromDate?.toJSON() ?? "",
          toDate: queryParams.toDate?.toJSON() ?? "",
        }
      : {};
    return http.get<GetOrdersResType>(
      `${PREFIX_URL.ORDER}?${queryString.stringify(params ?? {})}`
    );
  },
};
