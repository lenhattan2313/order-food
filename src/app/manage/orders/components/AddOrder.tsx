'use client';
import Quantity from '@/app/guest/menu/components/Quantity';
import GuestsDialog from '@/app/manage/orders/components/GuestsDialog';
import { TablesDialog } from '@/app/manage/orders/components/TablesDialog';
import { FormInput } from '@/components/_client/Form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DishStatus } from '@/constants/type';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';
import { cn, handleApiError } from '@/lib/utils';
import { useCreateGuest } from '@/queries/useAccount';
import { useGetDishList } from '@/queries/useDish';
import { useCreateOrder } from '@/queries/useOrder';
import { GetListGuestsResType } from '@/schemaValidations/account.schema';
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from '@/schemaValidations/guest.schema';
import { CreateOrdersBodyType } from '@/schemaValidations/order.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
const initialData = {
  name: '',
  tableNumber: 0,
};
export default function AddOrder() {
  const [open, setOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<
    GetListGuestsResType['data'][0] | null
  >(null);
  const [isNewGuest, setIsNewGuest] = useState(true);
  const [orders, setOrders] = useState<CreateOrdersBodyType['orders']>([]);
  const { data } = useGetDishList();
  const dishes = useMemo(() => data?.data ?? [], [data]);

  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: initialData,
  });

  const handleQuantityChange = (dishId: number, quantity: number) => {
    //TODO create utils guest and others
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };
  const { mutateAsync: createOrder, isPending: isCreateOrderPending } =
    useCreateOrder();
  const { mutateAsync: createGuest, isPending: isCreateGuestPending } =
    useCreateGuest();
  const handleOrder = async () => {
    try {
      let guestId = selectedGuest?.id;
      if (!guestId) {
        const {
          data: { id },
        } = await createGuest({
          name: form.getValues('name'),
          tableNumber: form.getValues('tableNumber'),
        });
        guestId = id;
      }
      if (!guestId) {
        toast({
          description: 'Hãy chọn một khách hàng',
        });
        return;
      }
      const payload: CreateOrdersBodyType = {
        orders,
        guestId,
      };
      const { message } = await createOrder(payload);
      reset();
      toast({ description: message });
    } catch (error) {
      handleApiError<GuestLoginBodyType>(error, form.setError);
    }
  };
  function reset() {
    form.reset();
    setSelectedGuest(null);
    setIsNewGuest(true);
    setOrders([]);
    setOpen(false);
  }
  return (
    <Dialog
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
        setOpen(value);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Tạo đơn hàng
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Tạo đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
          <Label htmlFor="isNewGuest">Khách Hàng mới</Label>
          <div className="col-span-3 flex items-center">
            <Switch
              id="isNewGuest"
              checked={isNewGuest}
              onCheckedChange={setIsNewGuest}
              aria-label="isNewGuest"
            />
          </div>
        </div>
        {isNewGuest && (
          <Form {...form}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="add-employee-form"
            >
              <div className="grid gap-4 py-4">
                <FormInput
                  name="name"
                  label="Tên Khách Hàng"
                  required
                  data-testid="name"
                />

                <FormField
                  control={form.control}
                  name="tableNumber"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="tableNumber">Chọn bàn</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <div className="flex items-center gap-4">
                            <div>{field.value}</div>
                            <TablesDialog
                              onChoose={(table) => {
                                field.onChange(table.number);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}
        {!isNewGuest && (
          <GuestsDialog
            onChoose={(guest) => {
              setSelectedGuest(guest);
            }}
          />
        )}
        {!isNewGuest && selectedGuest && (
          <div className="grid grid-cols-4 items-center justify-items-start gap-4">
            <Label htmlFor="selectedGuest">Khách đã chọn</Label>
            <div className="col-span-3 w-full gap-4 flex items-center">
              <div>
                {selectedGuest.name} (#{selectedGuest.id})
              </div>
              <div>Bàn: {selectedGuest.tableNumber}</div>
            </div>
          </div>
        )}
        {dishes
          .filter((dish) => dish.status !== DishStatus.Hidden)
          .map((dish) => (
            <div
              key={dish.id}
              className={cn('flex gap-4', {
                'pointer-events-none': dish.status === DishStatus.Unavailable,
              })}
            >
              <div className="flex-shrink-0 relative">
                {dish.status === DishStatus.Unavailable && (
                  <span className="absolute inset-0 flex items-center justify-center text-sm">
                    Hết hàng
                  </span>
                )}
                <Image
                  src={dish.image}
                  alt={dish.name}
                  height={100}
                  width={100}
                  quality={80}
                  className="object-cover w-[80px] h-[80px] rounded-md"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm">{dish.name}</h3>
                <p className="text-xs">{dish.description}</p>
                <p className="text-xs font-semibold">
                  {formatCurrency(dish.price)}
                </p>
              </div>
              <div className="flex-shrink-0 ml-auto flex justify-center items-center">
                <Quantity
                  onChange={(value) => handleQuantityChange(dish.id, value)}
                  value={
                    orders.find((order) => order.dishId === dish.id)
                      ?.quantity ?? 0
                  }
                />
              </div>
            </div>
          ))}
        <DialogFooter>
          <Button
            className="w-full justify-between"
            onClick={handleOrder}
            disabled={orders.length === 0}
            isLoading={isCreateOrderPending || isCreateGuestPending}
          >
            <span>Đặt hàng · {orders.length} Món</span>
            <span>{formatCurrency(totalPrice)}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
