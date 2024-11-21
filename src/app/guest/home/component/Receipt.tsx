'use client';
import { ServiceDrawer } from '@/app/guest/home/component/ServiceDrawer';
import { Option, RadioGroup } from '@/components/_client/RadioGroup';
import { CreditCard, Receipt, Smartphone } from 'lucide-react';
import { useState } from 'react';
const paymentOptions: Option[] = [
  { id: 'cash', label: 'Tiền mặt', icon: Receipt, iconColor: 'green-600' },
  {
    id: 'card',
    label: 'Thẻ ngân hàng',
    icon: CreditCard,
    iconColor: 'orange-500',
  },
  {
    id: 'app',
    label: 'Ứng dụng điện thoại',
    icon: Smartphone,
    iconColor: 'blue-500',
  },
];
export const ReceiptService = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  return (
    <ServiceDrawer
      icon={Receipt}
      title="Gọi thanh toán"
      buttonText="Gọi thanh toán"
      buttonColor="bg-orange-500"
    >
      <p className="text-muted-foreground mb-4">Bạn muốn thanh toán bằng?</p>
      <RadioGroup
        options={paymentOptions}
        value={paymentMethod}
        onValueChange={setPaymentMethod}
      />
    </ServiceDrawer>
  );
};
