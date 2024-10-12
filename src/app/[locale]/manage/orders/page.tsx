import OrderTable from '@/app/[locale]/manage/orders/components/OrderTable';
import { Page } from '@/components/_client/Page';
import { OrderProvider } from '@/context/orderContext';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

import { Suspense } from 'react';

export default async function OrderPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
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
