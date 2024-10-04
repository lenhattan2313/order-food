"use client";
import AddOrder from "@/app/[locale]/manage/orders/components/AddOrder";
import EditOrder from "@/app/[locale]/manage/orders/components/EditOrder";
import orderTableColumns from "@/app/[locale]/manage/orders/components/OrderColumns";
import OrderStatics from "@/app/[locale]/manage/orders/components/OrderStatics";
import { useOrderService } from "@/app/[locale]/manage/orders/hooks/useOrderService";
import { Input } from "@/components/ui/input";
import { OrderStatusValues } from "@/constants/type";
import {
  CreateOrdersResType,
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getVietnameseOrderStatus } from "@/app/[locale]/manage/orders/utils/orderUtils";
import { DataTable } from "@/components/_client/Table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { dateRangeDefault } from "@/constants/common";
import { SOCKET_EVENT } from "@/constants/socket";
import { toast } from "@/hooks/use-toast";
import { useTable } from "@/hooks/useTable";
import { socket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useGetOrderList } from "@/queries/useOrder";
import { useGetTableList } from "@/queries/useTable";
import { format } from "date-fns";

export type StatusCountObject = Record<
  (typeof OrderStatusValues)[number],
  number
>;
export type Statics = {
  status: StatusCountObject;
  table: Record<number, Record<number, StatusCountObject>>;
};

export default function OrderTable() {
  const [openStatusFilter, setOpenStatusFilter] = useState(false);
  const [fromDate, setFromDate] = useState(dateRangeDefault.fromDate);
  const [toDate, setToDate] = useState(dateRangeDefault.toDate);

  const {
    data: orders,
    refetch: refetchGetOrderList,
    isPending,
  } = useGetOrderList({
    fromDate,
    toDate,
  });
  const { data: tables } = useGetTableList();
  const orderList = useMemo(() => orders?.data ?? [], [orders]);
  const tableList = useMemo(
    () => (tables?.data ?? []).sort((a, b) => a.number - b.number),
    [tables]
  );

  const { statics, servingGuestByTableNumber } = useOrderService(orderList);

  const table = useTable({
    isPending,
    data: orderList,
    columns: orderTableColumns,
    skeleton: {
      width: 40,
      height: 30,
    },
  });

  const resetDateFilter = () => {
    setFromDate(dateRangeDefault.fromDate);
    setToDate(dateRangeDefault.toDate);
  };

  useEffect(() => {
    function handleUpdateOrder(data: UpdateOrderResType["data"]) {
      refetchGetOrderList();
      toast({
        description: `Bàn số ${data.tableNumber} vừa được cập nhật bởi ${data.orderHandler?.name}`,
      });
    }
    function getInfoTableOrder(data: CreateOrdersResType["data"]) {
      const tables = data.reduce((acc: Record<string, number>, cur) => {
        if (!cur.tableNumber) {
          return acc;
        }
        const tableNumber = cur.tableNumber.toString();
        acc[tableNumber] = cur.quantity + (acc?.[tableNumber] ?? 0);
        return acc;
      }, {});

      return tables;
    }
    function handleNewOrder(data: CreateOrdersResType["data"]) {
      refetchGetOrderList();
      const tables = getInfoTableOrder(data);
      const description = Object.entries(tables).map(
        ([tableNumber, dishCount]) => (
          <p key={tableNumber}>
            Bàn số <Badge>{tableNumber}</Badge> vừa đặt
            <Badge>{dishCount}</Badge> món
          </p>
        )
      );

      toast({ description });
    }
    function handlePayment(response: PayGuestOrdersResType["data"]) {
      const data = response[0];
      refetchGetOrderList();
      toast({
        description: `Bàn số ${data.tableNumber} vừa thanh toán thành công`,
      });
    }
    socket.on(SOCKET_EVENT.UPDATE_ORDER, handleUpdateOrder);
    socket.on(SOCKET_EVENT.NEW_ORDER, handleNewOrder);
    socket.on(SOCKET_EVENT.PAYMENT, handlePayment);

    return () => {
      socket.off(SOCKET_EVENT.UPDATE_ORDER, handleUpdateOrder);
      socket.off(SOCKET_EVENT.NEW_ORDER, handleNewOrder);
      socket.off(SOCKET_EVENT.PAYMENT, handlePayment);
    };
  }, []);
  return (
    <div className="w-full">
      <EditOrder />
      <div className=" flex items-center">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <span className="mr-2">Từ</span>
            <Input
              type="datetime-local"
              placeholder="Từ ngày"
              className="text-sm"
              value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
              onChange={(event) => setFromDate(new Date(event.target.value))}
            />
          </div>
          <div className="flex items-center">
            <span className="mr-2">Đến</span>
            <Input
              type="datetime-local"
              placeholder="Đến ngày"
              value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
              onChange={(event) => setToDate(new Date(event.target.value))}
            />
          </div>
          <Button className="" variant={"outline"} onClick={resetDateFilter}>
            Reset
          </Button>
        </div>
        <div className="ml-auto">
          <AddOrder />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 py-4">
        <Input
          placeholder="Tên khách"
          value={
            (table.getColumn("guestName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("guestName")?.setFilterValue(event.target.value)
          }
          className="max-w-[100px]"
        />
        <Input
          placeholder="Số bàn"
          value={
            (table.getColumn("tableNumber")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("tableNumber")?.setFilterValue(event.target.value)
          }
          className="max-w-[80px]"
        />
        <Popover open={openStatusFilter} onOpenChange={setOpenStatusFilter}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStatusFilter}
              className="w-[150px] text-sm justify-between"
            >
              {table.getColumn("status")?.getFilterValue()
                ? getVietnameseOrderStatus(
                    table
                      .getColumn("status")
                      ?.getFilterValue() as (typeof OrderStatusValues)[number]
                  )
                : "Trạng thái"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandGroup>
                <CommandList>
                  {OrderStatusValues.map((status) => (
                    <CommandItem
                      key={status}
                      value={status}
                      onSelect={(currentValue) => {
                        table
                          .getColumn("status")
                          ?.setFilterValue(
                            currentValue ===
                              table.getColumn("status")?.getFilterValue()
                              ? ""
                              : currentValue
                          );
                        setOpenStatusFilter(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          table.getColumn("status")?.getFilterValue() === status
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {getVietnameseOrderStatus(status)}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <OrderStatics
        statics={statics}
        tableList={tableList}
        servingGuestByTableNumber={servingGuestByTableNumber}
      />
      <DataTable table={table} />
    </div>
  );
}
