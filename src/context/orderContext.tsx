"use client";
import { UpdateOrderType } from "@/apiRequest/order/orderActions";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils";
import { useUpdateOrder } from "@/queries/useOrder";
import { GetOrdersResType } from "@/schemaValidations/order.schema";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export type OrderObjectByGuestID = Record<number, GetOrdersResType["data"]>;
export type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>;

const OrderContext = createContext<{
  setOrderIdEdit: (value?: number) => void;
  orderIdEdit?: number;
  changeStatus: (value: UpdateOrderType) => void;
  setOrderObjectByGuestId: (value?: OrderObjectByGuestID) => void;
  orderObjectByGuestId?: OrderObjectByGuestID;
}>({
  setOrderIdEdit: (value?: number) => {},
  orderIdEdit: undefined,
  changeStatus: (body: UpdateOrderType) => {},
  setOrderObjectByGuestId: (value?: OrderObjectByGuestID) => {},
  orderObjectByGuestId: undefined,
});
export const OrderProvider: FC<PropsWithChildren> = ({ children }) => {
  const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();
  const [orderObjectByGuestId, setOrderObjectByGuestId] = useState<
    OrderObjectByGuestID | undefined
  >();
  const { mutateAsync } = useUpdateOrder();
  const changeStatus = useCallback(async (body: UpdateOrderType) => {
    try {
      const { message } = await mutateAsync(body);
      toast({ description: message });
    } catch (error) {
      handleApiError(error);
    }
  }, []);
  return (
    <OrderContext.Provider
      value={{
        orderIdEdit,
        setOrderIdEdit,
        changeStatus,
        orderObjectByGuestId,
        setOrderObjectByGuestId,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => useContext(OrderContext);
