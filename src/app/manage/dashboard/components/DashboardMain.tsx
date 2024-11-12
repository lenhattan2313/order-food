'use client';
import { DishBarChart } from '@/app/manage/dashboard/components/BarChart';
import { CardItem } from '@/app/manage/dashboard/components/CardItem';
import { RevenueLineChart } from '@/app/manage/dashboard/components/LineChart';
import { Spinner } from '@/components/_client/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dateRangeDefault } from '@/constants/common';
import { formatCurrency } from '@/lib/currency';
import { useGetIndicatorDashboard } from '@/queries/useIndicator';
import { format } from 'date-fns';
import { DollarSign, HandPlatter, Salad, User } from 'lucide-react';
import { useMemo, useState } from 'react';
const initialValue = {
  revenue: 0,
  guestCount: 0,
  orderCount: 0,
  servingTableCount: 0,
  dishIndicator: [],
  revenueByDate: [],
};
export default function DashboardMain() {
  const [fromDate, setFromDate] = useState(dateRangeDefault.fromDate);
  const [toDate, setToDate] = useState(dateRangeDefault.toDate);
  const resetDateFilter = () => {
    setFromDate(dateRangeDefault.fromDate);
    setToDate(dateRangeDefault.toDate);
  };

  const { data, isPending } = useGetIndicatorDashboard({ fromDate, toDate });
  const {
    revenue,
    guestCount,
    orderCount,
    servingTableCount,
    dishIndicator,
    revenueByDate,
  } = useMemo(() => data?.data ?? initialValue, [data]);
  if (isPending) {
    return <Spinner />;
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <span className="mr-2">Từ</span>
          <Input
            type="datetime-local"
            placeholder="Từ"
            className="text-sm"
            value={format(fromDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
            onChange={(event) => setFromDate(new Date(event.target.value))}
          />
        </div>
        <div className="flex items-center">
          <span className="mr-2">Đến</span>
          <Input
            type="datetime-local"
            placeholder="Đến"
            value={format(toDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
            onChange={(event) => setToDate(new Date(event.target.value))}
          />
        </div>
        <Button className="" variant={'outline'} onClick={resetDateFilter}>
          Reset
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardItem
          key="total-revenue"
          title="Tổng doanh thu"
          value={formatCurrency(revenue)}
          icon={DollarSign}
        />
        <CardItem key="client" title="Khách" value={guestCount} icon={User} />
        <CardItem
          key="order"
          title="Đơn hàng"
          value={orderCount}
          icon={Salad}
        />
        <CardItem
          key="table"
          title="Bàn phục vụ"
          value={servingTableCount}
          icon={HandPlatter}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueLineChart revenueByDate={revenueByDate} />
        </div>
        <div className="lg:col-span-3">
          <DishBarChart dishIndicator={dishIndicator} />
        </div>
      </div>
    </div>
  );
}