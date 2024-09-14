import { OrderStatusValues } from "@/constants/type";
import { GetOrdersResType } from "@/schemaValidations/order.schema";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

export type OrderObjectByGuestID = Record<number, GetOrdersResType["data"]>;
export type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>;
export type IChangeStatusType = {
  orderId: number;
  dishId: number;
  status: (typeof OrderStatusValues)[number];
  quantity: number;
};
const OrderContext = createContext<{
  setOrderIdEdit: (value?: number) => void;
  orderIdEdit?: number;
  changeStatus: (value: IChangeStatusType) => void;
  setOrderObjectByGuestId: (value?: OrderObjectByGuestID) => void;
  orderObjectByGuestId?: OrderObjectByGuestID;
}>({
  setOrderIdEdit: (value?: number) => {},
  orderIdEdit: undefined,
  changeStatus: (body: IChangeStatusType) => {},
  setOrderObjectByGuestId: (value?: OrderObjectByGuestID) => {},
  orderObjectByGuestId: undefined,
});
export const OrderProvider: FC<PropsWithChildren> = ({ children }) => {
  const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();
  const [orderObjectByGuestId, setOrderObjectByGuestId] = useState<
    OrderObjectByGuestID | undefined
  >();
  const changeStatus = async (body: {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number];
    quantity: number;
  }) => {};
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
