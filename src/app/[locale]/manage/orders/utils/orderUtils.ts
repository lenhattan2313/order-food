import { OrderStatus } from '@/constants/type';
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react';

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};
