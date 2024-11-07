'use client';

import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/currency';
import { GetOrdersResType } from '@/schemaValidations/order.schema';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type IOrderItem = {
  order: GetOrdersResType['data'][0];
};
export default function OrderItem({ order }: IOrderItem) {
  const t = useTranslations('order');
  return (
    <div key={order.id} className="flex gap-4">
      <div className="flex-shrink-0 relative">
        <Image
          src={order.dishSnapshot.image}
          alt={order.dishSnapshot.name}
          height={100}
          width={100}
          quality={100}
          className="object-cover w-[80px] h-[80px] rounded-md"
        />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm">{order.dishSnapshot.name}</h3>
        <div className="flex justify-between gap-1 items-center">
          <p className="text-xs font-semibold">
            {formatCurrency(order.dishSnapshot.price)}
          </p>
          <p className="text-xs ">x</p>
          <Badge>{order.quantity}</Badge>
        </div>
      </div>
      <div className="flex-shrink-0 ml-auto flex justify-center items-center">
        <div className="flex gap-1 ">
          <Badge variant="outline">{t(order.status)}</Badge>
        </div>
      </div>
    </div>
  );
}
