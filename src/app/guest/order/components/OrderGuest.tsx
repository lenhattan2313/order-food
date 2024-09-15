"use client";

import OrderItem from "@/app/guest/order/components/OrderGuestItem";
import { Spinner } from "@/components/_client/Spinner";
import { Button } from "@/components/ui/button";
import { SOCKET_EVENT } from "@/constants/socket";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/currency";
import { socket } from "@/lib/socket";
import { useGuestGetOrder } from "@/queries/useGuest";
import { GuestGetOrdersResType } from "@/schemaValidations/guest.schema";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import { useEffect, useMemo, useState } from "react";

export default function Order() {
  const [orders, setOrders] = useState<GuestGetOrdersResType["data"]>([]);
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket.id);
    }

    function onDisconnect() {
      console.log(SOCKET_EVENT.DISCONNECT);
    }

    function handleRefetchStatus() {
      refetch();
      toast({ description: "Trạng thái được cập nhật" });
    }
    socket.on(SOCKET_EVENT.CONNECT, onConnect);
    socket.on(SOCKET_EVENT.DISCONNECT, onDisconnect);
    socket.on(SOCKET_EVENT.UPDATE_ORDER, (data: UpdateOrderResType["data"]) => {
      // const foundIndex = orders.findIndex((order) => data.id === order.id);
      // if (foundIndex === -1) {
      //   return;
      // }
      // const order = { ...orders[foundIndex] };
      // order.status = data.status;
      // setOrders((prev) =>
      //   prev.map((item) => (item.id === data.id ? order : item))
      // );
      handleRefetchStatus();
    });
    return () => {
      socket.off(SOCKET_EVENT.CONNECT, onConnect);
      socket.off(SOCKET_EVENT.DISCONNECT, onDisconnect);
      socket.off(SOCKET_EVENT.UPDATE_ORDER, handleRefetchStatus);
    };
  }, []);
  const { data, isPending, refetch } = useGuestGetOrder();
  useMemo(() => {
    if (data) {
      setOrders(data.data);
    }
  }, [data]);
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
