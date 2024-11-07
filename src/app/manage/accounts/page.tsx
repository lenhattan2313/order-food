import AccountTable from '@/app/manage/accounts/components/AccountTable';
import { Page } from '@/components/_client/Page';
import { Suspense } from '@/components/_client/Suspense';
import { getTranslations } from 'next-intl/server';

export default async function AccountPage() {
  const t = await getTranslations('accounts');
  return (
    <Page title={t('title')} description={t('description')}>
      <Suspense>
        <AccountTable />
      </Suspense>
    </Page>
  );
}
