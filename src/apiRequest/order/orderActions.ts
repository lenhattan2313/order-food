import { PREFIX_URL } from '@/constants/url';
import http from '@/lib/httpUtils';
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  OrderParamType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from '@/schemaValidations/order.schema';
import queryString from 'query-string';
export type UpdateOrderType = UpdateOrderBodyType & OrderParamType;
export const orderActions = {
  getList: (queryParams?: GetOrdersQueryParamsType) => {
    const params = queryParams
      ? {
          fromDate: queryParams.fromDate?.toJSON() ?? '',
          toDate: queryParams.toDate?.toJSON() ?? '',
        }
      : {};
    return http.get<GetOrdersResType>(
      `${PREFIX_URL.ORDER}?${queryString.stringify(params ?? {})}`,
    );
  },
  getDetail: ({ orderId }: OrderParamType) =>
    http.get<GetOrderDetailResType>(`${PREFIX_URL.ORDER}/${orderId}`),

  update: ({ orderId, ...body }: UpdateOrderType) =>
    http.put<UpdateOrderResType, UpdateOrderBodyType>(
      `${PREFIX_URL.ORDER}/${orderId}`,
      body,
    ),

  create: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType, CreateOrdersBodyType>(
      PREFIX_URL.ORDER,
      body,
    ),

  payment: (body: PayGuestOrdersBodyType) =>
    http.post<PayGuestOrdersResType, PayGuestOrdersBodyType>(
      `${PREFIX_URL.ORDER}/pay`,
      body,
    ),
};
