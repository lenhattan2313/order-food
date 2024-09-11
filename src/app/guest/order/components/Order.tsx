"use client";

import OrderItem from "@/app/guest/order/components/OrderItem";
import { Spinner } from "@/components/_client/Spinner";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { useGuestGetOrder } from "@/queries/useGuest";
import { useMemo } from "react";

export default function Order() {
  const { data, isPending } = useGuestGetOrder();
  const orders = useMemo(() => data?.data || [], [data]);
  const totalPrice = useMemo(
    () =>
      orders.reduce((acc, cur) => {
        return acc + cur.dishSnapshot.price * cur.quantity;
      }, 0),
    [orders]
  );
  const totalCount = useMemo(
    () =>
      orders.reduce((acc, cur) => {
        return acc + cur.quantity;
      }, 0),
    [orders]
  );

  return (
    <>
      {isPending && <Spinner />}
      {orders.map((order) => {
        return <OrderItem order={order} key={order.id} />;
      })}
      <div className="sticky bottom-0">
        <Button className="w-full justify-between">
          <span>{totalCount} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
