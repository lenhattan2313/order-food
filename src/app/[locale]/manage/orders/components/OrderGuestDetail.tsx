import { OrderStatusIcon } from '@/app/[locale]/manage/orders/utils/orderUtils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '@/constants/type';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';
import {
  formatDateTimeToLocaleString,
  formatDateTimeToTimeString,
} from '@/lib/dateUtils';
import { handleApiError } from '@/lib/utils';
import { usePaymentOrder } from '@/queries/useOrder';

import { GetOrdersResType } from '@/schemaValidations/order.schema';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Fragment } from 'react';

type Guest = GetOrdersResType['data'][0]['guest'];
type Orders = GetOrdersResType['data'];
export default function OrderGuestDetail({
  guest,
  orders,
  onSuccess,
}: {
  guest: Guest;
  orders: Orders;
  onSuccess?: () => void;
}) {
  const t = useTranslations();
  const ordersFilterToPurchase = guest
    ? orders.filter(
        (order) =>
          order.status !== OrderStatus.Paid &&
          order.status !== OrderStatus.Rejected,
      )
    : [];
  const purchasedOrderFilter = guest
    ? orders.filter((order) => order.status === OrderStatus.Paid)
    : [];

  const { mutateAsync, isPending } = usePaymentOrder();
  async function handlePayment() {
    if (!guest?.id) {
      return;
    }
    try {
      const { message } = await mutateAsync({ guestId: guest.id });
      toast({ description: message });
      onSuccess && onSuccess();
    } catch (error) {
      handleApiError(error);
    }
  }
  return (
    <div className="space-y-2 text-sm">
      {guest && (
        <Fragment>
          <div className="space-x-1">
            <span className="font-semibold">{t('common.name')}:</span>
            <span>{guest.name}</span>
            <span className="font-semibold">(#{guest.id})</span>
            <span>|</span>
            <span className="font-semibold">{t('common.tableNumber')}:</span>
            <span>{guest.tableNumber}</span>
          </div>
          <div className="space-x-1">
            <span className="font-semibold">{t('common.createdAt')}:</span>
            <span>{formatDateTimeToLocaleString(guest.createdAt)}</span>
          </div>
        </Fragment>
      )}

      <div className="space-y-1">
        <div className="font-semibold">{t('common.order')}:</div>
        {orders.map((order, index) => {
          return (
            <div key={order.id} className="flex gap-2 items-center text-xs">
              <span className="w-[10px]">{index + 1}</span>
              <span title={t(`order.${order.status}`)}>
                {order.status === OrderStatus.Pending && (
                  <OrderStatusIcon.Pending className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Processing && (
                  <OrderStatusIcon.Processing className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Rejected && (
                  <OrderStatusIcon.Rejected className="w-4 h-4 text-red-400" />
                )}
                {order.status === OrderStatus.Delivered && (
                  <OrderStatusIcon.Delivered className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Paid && (
                  <OrderStatusIcon.Paid className="w-4 h-4 text-yellow-400" />
                )}
              </span>
              <Image
                src={order.dishSnapshot.image}
                alt={order.dishSnapshot.name}
                title={order.dishSnapshot.name}
                width={30}
                height={30}
                className="h-[30px] w-[30px] rounded object-cover"
              />
              <span
                className="truncate w-[70px] sm:w-[100px]"
                title={order.dishSnapshot.name}
              >
                {order.dishSnapshot.name}
              </span>
              <span className="font-semibold" title={`Tổng: ${order.quantity}`}>
                x{order.quantity}
              </span>
              <span className="italic">
                {formatCurrency(order.quantity * order.dishSnapshot.price)}
              </span>
              <span
                className="hidden sm:inline"
                title={`${t('common.createdAt')}: ${formatDateTimeToLocaleString(
                  order.createdAt,
                )} | ${t('common.updatedAt')}: ${formatDateTimeToLocaleString(order.updatedAt)}
          `}
              >
                {formatDateTimeToLocaleString(order.createdAt)}
              </span>
              <span
                className="sm:hidden"
                title={`${t('common.createdAt')}: ${formatDateTimeToLocaleString(
                  order.createdAt,
                )} | ${t('common.updatedAt')}: ${formatDateTimeToLocaleString(order.updatedAt)}
          `}
              >
                {formatDateTimeToTimeString(order.createdAt)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-x-1">
        <span className="font-semibold">{t('order.unpaid')}:</span>
        <Badge>
          <span>
            {formatCurrency(
              ordersFilterToPurchase.reduce((acc, order) => {
                return acc + order.quantity * order.dishSnapshot.price;
              }, 0),
            )}
          </span>
        </Badge>
      </div>
      <div className="space-x-1">
        <span className="font-semibold">{t('order.paid')}:</span>
        <Badge variant={'outline'}>
          <span>
            {formatCurrency(
              purchasedOrderFilter.reduce((acc, order) => {
                return acc + order.quantity * order.dishSnapshot.price;
              }, 0),
            )}
          </span>
        </Badge>
      </div>

      <div>
        <Button
          className="w-full"
          size={'sm'}
          variant={'secondary'}
          disabled={ordersFilterToPurchase.length === 0}
          isLoading={isPending}
          onClick={handlePayment}
        >
          {t('order.paidAll')}: ({ordersFilterToPurchase.length}){' '}
          {t('order.order')}
        </Button>
      </div>
    </div>
  );
}
