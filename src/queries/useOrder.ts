import { orderActions } from "@/actions/order/orderActions";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { GetOrdersQueryParamsType } from "@/schemaValidations/order.schema";
import { useQuery } from "@tanstack/react-query";

export const useGetOrderList = (queryParams?: GetOrdersQueryParamsType) =>
  useQuery({
    queryKey: [QUERY_KEYS.ORDERS, queryParams],
    queryFn: () => orderActions.getList(queryParams),
  });
