import OrderTable from '@/app/manage/orders/components/OrderTable';
import { Page } from '@/components/_client/Page';
import { OrderProvider } from '@/context/orderContext';

import { Suspense } from 'react';

export default function OrderPage() {
  return (
    <Page title="Đơn hàng" description="Quản lý đơn hàng">
      <Suspense>
        <OrderProvider>
          <OrderTable />
        </OrderProvider>
      </Suspense>
    </Page>
  );
}
