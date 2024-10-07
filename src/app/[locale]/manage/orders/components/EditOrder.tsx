'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  UpdateOrderBody,
  UpdateOrderBodyType,
} from '@/schemaValidations/order.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { OrderStatus, OrderStatusValues } from '@/constants/type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DishesDialog } from '@/app/[locale]/manage/orders/components/DishesDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { DishListResType } from '@/schemaValidations/dish.schema';
import { getVietnameseOrderStatus } from '@/app/[locale]/manage/orders/utils/orderUtils';
import { useOrderContext } from '@/context/orderContext';
import { useGetOrderDetail, useUpdateOrder } from '@/queries/useOrder';
import { handleApiError } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Spinner } from '@/components/_client/Spinner';

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
      toast({ description: message });
    } catch (error) {
      handleApiError(error, setError);
    }
  };

  const handleReset = () => {
    setOrderIdEdit(undefined);
  };

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
          <DialogTitle>Cập nhật đơn hàng</DialogTitle>
        </DialogHeader>
        {isPending && <Spinner type="box" className="w-full" />}
        {!isPending && (
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
                          <AvatarImage src={selectedDish?.image} />
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

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="quantity">Số lượng</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="quantity"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="w-16 text-center"
                            {...field}
                            value={field.value}
                            onChange={(e) => {
                              let value = e.target.value;
                              const numberValue = Number(value);
                              if (isNaN(numberValue)) {
                                return;
                              }
                              field.onChange(numberValue);
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <FormLabel>Trạng thái</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl className="col-span-3">
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OrderStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseOrderStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}
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
