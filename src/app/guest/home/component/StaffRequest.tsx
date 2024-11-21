'use client';
import { ServiceDrawer } from '@/app/guest/home/component/ServiceDrawer';
import { Textarea } from '@/components/ui/textarea';
import { User2 } from 'lucide-react';
import { useState } from 'react';

export const StaffRequest = () => {
  const [staffRequest, setStaffRequest] = useState('');

  return (
    <ServiceDrawer
      icon={User2}
      title="Gọi nhân viên"
      buttonText="Gọi nhân viên"
      buttonColor="bg-blue-500"
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
  );
};
