import { GuestGetOrdersResType } from "@/schemaValidations/guest.schema";

export const calculateTotals = (
  orders: GuestGetOrdersResType["data"],
  filterFn: (order: GuestGetOrdersResType["data"][0]) => boolean
) => {
  return orders.reduce(
    (acc, cur) => {
      if (filterFn(cur)) {
        return {
          ...acc,
          count: acc.count + cur.quantity,
          price: acc.price + cur.dishSnapshot.price * cur.quantity,
        };
      }
      return acc;
    },
    {
      count: 0,
      price: 0,
    }
  );
};
