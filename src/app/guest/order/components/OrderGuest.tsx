"use client";

import OrderItem from "@/app/guest/order/components/OrderGuestItem";
import { calculateTotals } from "@/app/guest/order/utils/guestOrderUtils";
import { Spinner } from "@/components/_client/Spinner";
import { SOCKET_EVENT } from "@/constants/socket";
import { OrderStatus } from "@/constants/type";
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
    function handlePayment() {
      refetch();
      toast({ description: "Bạn đã thanh toán thành công" });
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
    socket.on(SOCKET_EVENT.PAYMENT, handlePayment);

    return () => {
      socket.off(SOCKET_EVENT.CONNECT, onConnect);
      socket.off(SOCKET_EVENT.DISCONNECT, onDisconnect);
      socket.off(SOCKET_EVENT.UPDATE_ORDER, handleRefetchStatus);
      socket.off(SOCKET_EVENT.PAYMENT, handlePayment);
    };
  }, []);
  const { data, isPending, refetch } = useGuestGetOrder();
  useMemo(() => {
    if (data) {
      setOrders(data.data);
    }
  }, [data]);

  const paid = useMemo(
    () => calculateTotals(orders, (cur) => cur.status === OrderStatus.Paid),
    [orders]
  );

  const unPaid = useMemo(
    () =>
      calculateTotals(
        orders,
        (cur) =>
          cur.status !== OrderStatus.Paid && cur.status !== OrderStatus.Rejected
      ),
    [orders]
  );
  return (
    <>
      {isPending && <Spinner />}
      {orders.map((order) => {
        return <OrderItem order={order} key={order.id} />;
      })}
      <div className="sticky bottom-0">
        <div className="sticky bottom-0 ">
          <div className="w-full flex space-x-4 text-xl font-semibold">
            <span>Đơn chưa thanh toán · {unPaid.count} món</span>
            <span>{formatCurrency(unPaid.price)}</span>
          </div>
        </div>
        {paid.count > 0 && (
          <div className="sticky bottom-0 ">
            <div className="w-full flex space-x-4 text-xl font-semibold">
              <span>Đơn đã thanh toán · {paid.count} món</span>
              <span>{formatCurrency(paid.price)}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
