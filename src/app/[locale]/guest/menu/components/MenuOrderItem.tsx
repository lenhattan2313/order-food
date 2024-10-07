'use client';

import Quantity from '@/app/[locale]/guest/menu/components/Quantity';
import { DishStatus } from '@/constants/type';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';
import { DishResType } from '@/schemaValidations/dish.schema';
import Image from 'next/image';

type IOrderItem = {
  dish: DishResType['data'];
  onChange: (dishId: number, quantity: number) => void;
  quantity: number;
};
export default function MenuOrderItem({
  dish,
  onChange,
  quantity,
}: IOrderItem) {
  function handleChange(value: number) {
    onChange(dish.id, value);
  }
  return (
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
          quality={100}
          className="object-cover w-[80px] h-[80px] rounded-md"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm">{dish.name}</h3>
        <p className="text-xs">{dish.description}</p>
        <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
      </div>
      <div className="flex-shrink-0 ml-auto flex justify-center items-center">
        <Quantity value={quantity} onChange={handleChange} />
      </div>
    </div>
  );
}
