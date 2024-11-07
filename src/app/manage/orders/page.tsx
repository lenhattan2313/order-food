import OrderTable from '@/app/manage/orders/components/OrderTable';
import { Page } from '@/components/_client/Page';
import { OrderProvider } from '@/context/orderContext';
import { getTranslations } from 'next-intl/server';

import { Suspense } from 'react';

export default async function OrderPage() {
  const t = await getTranslations('order');
  return (
    <Page title={t('title')} description={t('description')}>
      <Suspense>
        <OrderProvider>
          <OrderTable />
        </OrderProvider>
      </Suspense>
    </Page>
  );
}
