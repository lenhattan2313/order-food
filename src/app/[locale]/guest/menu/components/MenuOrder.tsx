'use client';

import MenuOrderItem from '@/app/[locale]/guest/menu/components/MenuOrderItem';
import { Spinner } from '@/components/_client/Spinner';
import { Button } from '@/components/ui/button';
import { DishStatus } from '@/constants/type';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';
import { handleApiError } from '@/lib/utils';
import { useRouter } from '@/navigation';
import { useGetDishList } from '@/queries/useDish';
import { useGuestOrderMutation } from '@/queries/useGuest';
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema';
import { useMemo, useState } from 'react';

export default function MenuOrder() {
  const router = useRouter();
  const { data, isPending } = useGetDishList();
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const dishes = useMemo(
    () => data?.data.filter((item) => item.status !== DishStatus.Hidden) || [],
    [data],
  );
  const totalPrice = useMemo(
    () =>
      orders.reduce((acc, cur) => {
        const dish = dishes.find((item) => item.id === cur.dishId);
        if (!dish) {
          return acc;
        }
        return acc + dish.price * cur.quantity;
      }, 0),
    [orders, dishes],
  );
  const totalCount = useMemo(
    () =>
      orders.reduce((acc, cur) => {
        return acc + cur.quantity;
      }, 0),
    [orders],
  );
  function handleChange(dishId: number, quantity: number) {
    setOrders((preState) => {
      const index = preState.findIndex((item) => item.dishId === dishId);
      if (index === -1) {
        return [...preState, { dishId, quantity }];
      }
      if (quantity === 0) {
        return preState.filter((item) => item.dishId !== dishId);
      }
      const newOrders = [...preState];
      newOrders[index] = { ...preState[index], quantity };
      return newOrders;
    });
  }
  const { mutateAsync, isPending: isCreatePending } = useGuestOrderMutation();
  async function handleOrder() {
    try {
      const { message } = await mutateAsync(orders);
      toast({ description: message });
      router.push('/guest/order');
    } catch (error) {
      handleApiError(error);
    }
  }
  return (
    <>
      {isPending && <Spinner />}
      {dishes.map((dish) => {
        const quantity =
          orders.find((item) => item.dishId === dish.id)?.quantity ?? 0;
        return (
          <MenuOrderItem
            dish={dish}
            key={dish.id}
            onChange={handleChange}
            quantity={quantity}
          />
        );
      })}
      <div className="sticky bottom-0">
        <Button
          className="w-full justify-between"
          onClick={handleOrder}
          isLoading={isCreatePending}
        >
          <span>Đặt · {totalCount} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
