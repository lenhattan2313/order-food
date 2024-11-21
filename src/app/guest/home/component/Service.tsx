'use client';
import { Feedback } from '@/app/guest/home/component/Feedback';
import { ReceiptService } from '@/app/guest/home/component/Receipt';
import { StaffRequest } from '@/app/guest/home/component/StaffRequest';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';

export const Service = () => {
  return (
    <div className="m-4 max-w-md mx-auto grid gap-4">
      <div className="grid grid-cols-3 gap-2">
        <ReceiptService />
        <StaffRequest />
        <Feedback />
      </div>

      <Button
        variant="ghost"
        className="flex items-center gap-4 bg-red-500 hover:bg-red-600 text-white h-auto p-6 rounded-xl"
      >
        <div className="w-10 h-10 flex items-center justify-center bg-red-600 rounded-sm">
          <Utensils className="w-6 h-6" />
        </div>
        <span className="text-lg font-medium">Xem Menu - Gọi món</span>
      </Button>
    </div>
  );
};
