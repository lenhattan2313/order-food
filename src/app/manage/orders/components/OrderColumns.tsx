'use client';

import OrderGuestDetail from '@/app/manage/orders/components/OrderGuestDetail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderStatus, OrderStatusValues } from '@/constants/type';
import { useOrderContext } from '@/context/orderContext';
import { formatCurrency } from '@/lib/currency';
import { formatDateTimeToLocaleString } from '@/lib/dateUtils';
import { simpleMatchText } from '@/lib/utils';
import { GetOrdersResType } from '@/schemaValidations/order.schema';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type OrderItem = GetOrdersResType['data'][0];
export const useOrderTableColumns = (): ColumnDef<OrderItem>[] => {
  const t = useTranslations();
  return [
    {
      accessorKey: 'tableNumber',
      header: t('common.tableNumber'),
      cell: ({ row }) => <div>{row.getValue('tableNumber')}</div>,
      filterFn: (row, columnId, filterValue: string) => {
        if (filterValue === undefined) return true;
        return simpleMatchText(
          String(row.getValue(columnId)),
          String(filterValue),
        );
      },
    },
    {
      id: 'guestName',
      header: t('common.guest'),
      cell: function Cell({ row }) {
        const { orderObjectByGuestId } = useOrderContext();
        const guest = row.original.guest;
        return (
          <div>
            {!guest && t('order.hasBeenDeleted')}
            {guest && (
              <Popover>
                <PopoverTrigger>
                  <div>
                    <span>{guest.name}</span>
                    <span className="font-semibold">(#{guest.id})</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[320px] sm:w-[440px]">
                  <OrderGuestDetail
                    guest={guest}
                    orders={orderObjectByGuestId?.[guest.id] ?? []}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      },
      filterFn: (row, filterValue: string) => {
        if (!filterValue) return true;
        return simpleMatchText(
          row.original.guest?.name ?? t('order.hasBeenDeleted'),
          String(filterValue),
        );
      },
    },
    {
      id: 'dishName',
      header: t('common.dish'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Image
                src={row.original.dishSnapshot.image}
                alt={row.original.dishSnapshot.name}
                width={50}
                height={50}
                className="rounded-md object-cover w-[50px] h-[50px] cursor-pointer"
              />
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-wrap gap-2">
                <Image
                  src={row.original.dishSnapshot.image}
                  alt={row.original.dishSnapshot.name}
                  width={100}
                  height={100}
                  className="rounded-md object-cover w-[100px] h-[100px]"
                />
                <div className="space-y-1 text-sm">
                  <h3 className="font-semibold">
                    {row.original.dishSnapshot.name}
                  </h3>
                  <div className="italic">
                    {formatCurrency(row.original.dishSnapshot.price)}
                  </div>
                  <div>{row.original.dishSnapshot.description}</div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span>{row.original.dishSnapshot.name}</span>
              <Badge className="px-1" variant={'secondary'}>
                x{row.original.quantity}
              </Badge>
            </div>
            <span className="italic">
              {formatCurrency(
                row.original.dishSnapshot.price * row.original.quantity,
              )}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: t('common.status'),
      cell: function Cell({ row }) {
        const { changeStatus } = useOrderContext();
        const changeOrderStatus = async (
          status: (typeof OrderStatusValues)[number],
        ) => {
          changeStatus({
            orderId: row.original.id,
            dishId: row.original.dishSnapshot.dishId!,
            status: status,
            quantity: row.original.quantity,
          });
        };
        return (
          <Select
            onValueChange={(value: (typeof OrderStatusValues)[number]) => {
              changeOrderStatus(value);
            }}
            defaultValue={OrderStatus.Pending}
            value={row.getValue('status')}
          >
            <SelectTrigger className="w-[140px]" aria-label="status">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {OrderStatusValues.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`order.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      id: 'orderHandlerName',
      header: t('order.handler'),
      cell: ({ row }) => row.original.orderHandler?.name ?? '',
    },
    {
      accessorKey: 'createdAt',
      header: t('order.createdUpdatedAt'),
      cell: ({ row }) => (
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-4">
            {formatDateTimeToLocaleString(row.getValue('createdAt'))}
          </div>
          <div className="flex items-center space-x-4">
            {formatDateTimeToLocaleString(
              row.original.updatedAt as unknown as string,
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'actions',
      header: t('common.actions'),
      enableHiding: false,
      cell: function Actions({ row }) {
        const { setOrderIdEdit } = useOrderContext();
        const openEditOrder = () => {
          setOrderIdEdit(row.original.id);
        };

        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                aria-label="Open menu"
              >
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openEditOrder}>
                {t('common.edit')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
