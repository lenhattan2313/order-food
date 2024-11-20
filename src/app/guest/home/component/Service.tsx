'use client';
import { ServiceDrawer } from '@/app/guest/home/component/ServiceDrawer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  CreditCard,
  MessageSquare,
  Receipt,
  Smartphone,
  User2,
  Utensils,
} from 'lucide-react';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export const Service = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [staffRequest, setStaffRequest] = useState('');
  const [rating, setRating] = useState('5');

  return (
    <div className="m-4 max-w-md mx-auto grid gap-4">
      <div className="grid grid-cols-3 gap-2">
        <ServiceDrawer
          icon={Receipt}
          title="Gọi thanh toán"
          buttonText="Gọi thanh toán"
          buttonColor="orange"
        >
          <p className="text-muted-foreground mb-4">
            Bạn muốn thanh toán bằng?
          </p>
          <RadioGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            className="grid gap-4"
          >
            <Label
              htmlFor="cash"
              className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex items-center gap-3">
                <Receipt className="h-5 w-5 text-green-600" />
                <div className="space-y-1">
                  <p>Tiền mặt</p>
                </div>
              </div>
              <RadioGroupItem value="cash" id="cash" />
            </Label>
            <Label
              htmlFor="card"
              className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <div className="space-y-1">
                  <p>Thẻ ngân hàng</p>
                </div>
              </div>
              <RadioGroupItem value="card" id="card" />
            </Label>
            <Label
              htmlFor="app"
              className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-blue-500" />
                <div className="space-y-1">
                  <p>Ứng dụng điện thoại</p>
                </div>
              </div>
              <RadioGroupItem value="app" id="app" />
            </Label>
          </RadioGroup>
        </ServiceDrawer>

        {/* Staff Call Drawer */}
        <ServiceDrawer
          icon={User2}
          title="Gọi nhân viên"
          buttonText="Gọi nhân viên"
          buttonColor="blue"
        >
          <p className="text-muted-foreground mb-4">
            Bạn muốn yêu cầu nhân viên làm gì?
          </p>
          <Textarea
            placeholder="Nhập yêu cầu của bạn..."
            value={staffRequest}
            onChange={(e) => setStaffRequest(e.target.value)}
            className="min-h-[100px]"
          />
        </ServiceDrawer>

        {/* Review Drawer */}
        <ServiceDrawer
          icon={MessageSquare}
          title="Đánh giá"
          buttonText="Đánh giá"
          buttonColor="green"
        >
          <p className="text-muted-foreground mb-4">
            Hãy cho chúng tôi biết ý kiến của bạn
          </p>
          <RadioGroup
            value={rating}
            onValueChange={setRating}
            className="grid grid-cols-5 gap-4 py-4"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <Label
                key={value}
                htmlFor={`rating-${value}`}
                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <span className="text-2xl">{'⭐'.repeat(value)}</span>
                <RadioGroupItem
                  value={value.toString()}
                  id={`rating-${value}`}
                  className="sr-only"
                />
              </Label>
            ))}
          </RadioGroup>
          <Textarea
            placeholder="Nhập đánh giá của bạn..."
            className="min-h-[100px] mt-4"
          />
        </ServiceDrawer>
      </div>

      <Button
        variant="ghost"
        className="flex items-center gap-4 bg-red-500 hover:bg-red-600 text-white h-auto p-4 rounded-xl"
      >
        <div className="w-10 h-10 flex items-center justify-center bg-red-600 rounded-sm">
          <Utensils className="w-6 h-6" />
        </div>
        <span className="text-lg font-medium">Xem Menu - Gọi món</span>
      </Button>
    </div>
  );
};
