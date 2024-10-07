'use client';

import DashboardMain from '@/app/[locale]/manage/dashboard/components/DashboardMain';
import { Page } from '@/components/_client/Page';
import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const t = useTranslations('dashboard');
  return (
    <Page title={t('title')} description={t('description')}>
      <DashboardMain />
    </Page>
  );
}
