import AccountTable from '@/app/[locale]/manage/accounts/components/AccountTable';
import { Page } from '@/components/_client/Page';
import { Suspense } from '@/components/_client/Suspense';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';

export default async function AccountPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('accounts');
  return (
    <Page title={t('title')} description={t('description')}>
      <Suspense>
        <AccountTable />
      </Suspense>
    </Page>
  );
}
