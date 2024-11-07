'use client';
import { DishesDialog } from '@/app/manage/orders/components/DishesDialog';
import { FormInput, FormSelect } from '@/components/_client/Form';
import { Spinner } from '@/components/_client/Spinner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { OrderStatus, OrderStatusValues } from '@/constants/type';
import { useOrderContext } from '@/context/orderContext';
import { toast } from '@/hooks/use-toast';
import { handleApiError } from '@/lib/utils';
import { useGetOrderDetail, useUpdateOrder } from '@/queries/useOrder';
import { DishListResType } from '@/schemaValidations/dish.schema';
import {
  UpdateOrderBody,
  UpdateOrderBodyType,
} from '@/schemaValidations/order.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function EditOrder() {
  const [selectedDish, setSelectedDish] = useState<
    DishListResType['data'][0] | undefined
  >();
  const { setOrderIdEdit, orderIdEdit } = useOrderContext();
  const { data: orderDetail, isPending } = useGetOrderDetail(orderIdEdit);
  const form = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBody),
    defaultValues: {
      status: OrderStatus.Pending,
      dishId: 0,
      quantity: 1,
    },
  });
  const { reset, setError } = form;
  useEffect(() => {
    if (!orderDetail) {
      return;
    }
    const {
      data: {
        status,
        dishSnapshot: { dishId },
        quantity,
      },
    } = orderDetail;
    reset((preState) => ({ ...preState, status, dishId: dishId!, quantity }));
    setSelectedDish(orderDetail.data.dishSnapshot);
  }, [orderDetail, reset]);
  const { mutateAsync, isPending: isUpdatePending } = useUpdateOrder();
  const onSubmit = async (values: UpdateOrderBodyType) => {
    if (!orderIdEdit) {
      return;
    }
    try {
      const { message } = await mutateAsync({
        ...values,
        orderId: orderIdEdit,
      });
      handleReset();
      toast({ description: message });
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  const handleReset = () => {
    setOrderIdEdit(undefined);
  };

  const options = useMemo(
    () =>
      OrderStatusValues.map((status) => ({
        value: status,
        label: status,
      })),
    [],
  );
  return (
    <Dialog
      open={Boolean(orderIdEdit)}
      onOpenChange={(value) => {
        if (!value) {
          handleReset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa đơn hàng</DialogTitle>
        </DialogHeader>
        {isPending && <Spinner className="w-full" />}
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-order-form"
            onSubmit={form.handleSubmit(onSubmit, console.log)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="dishId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FormLabel>Món ăn</FormLabel>
                    <div className="flex items-center col-span-2 space-x-4">
                      <Avatar className="aspect-square w-[50px] h-[50px] rounded-md object-cover">
                        <AvatarImage
                          src={selectedDish?.image}
                          alt="dish-image"
                        />
                        <AvatarFallback className="rounded-none">
                          {selectedDish?.name}
                        </AvatarFallback>
                      </Avatar>
                      <div>{selectedDish?.name}</div>
                    </div>

                    <DishesDialog
                      onChoose={(dish) => {
                        field.onChange(dish.id);
                        setSelectedDish(dish);
                      }}
                    />
                  </FormItem>
                )}
              />
              <FormInput
                name="quantity"
                label="Số lượng"
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  let value = e.target.value;
                  const numberValue = Number(value);
                  if (isNaN(numberValue)) {
                    return;
                  }
                  form.setValue('quantity', numberValue, {
                    shouldValidate: true,
                  });
                }}
                data-testid="quantity"
                className=""
              />
              <FormSelect
                name="status"
                label="Trạng thái"
                data-testid="select"
                options={options}
                placeholder="Trạng thái"
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-order-form"
            isLoading={isUpdatePending}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
