import { UpdateOrderType, orderActions } from "@/actions/order/orderActions";
import { QUERY_KEYS } from "@/constants/queryKeys";
import {
  CreateOrdersBodyType,
  GetOrdersQueryParamsType,
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetOrderList = (queryParams?: GetOrdersQueryParamsType) =>
  useQuery({
    queryKey: [QUERY_KEYS.ORDERS, queryParams],
    queryFn: () => orderActions.getList(queryParams),
  });

export const useGetOrderDetail = (orderId?: number) =>
  useQuery({
    queryKey: [QUERY_KEYS.ORDERS, orderId],
    queryFn: () => orderActions.getDetail({ orderId: orderId! }),
    enabled: Boolean(orderId),
  });
export const useCreateOrder = () =>
  useMutation({
    mutationFn: (payload: CreateOrdersBodyType) => orderActions.create(payload),
  });

export const useUpdateOrder = () =>
  useMutation({
    mutationFn: (payload: UpdateOrderType) => orderActions.update(payload),
  });
