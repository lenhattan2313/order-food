import AccountTable from '@/app/manage/accounts/components/AccountTable';
import { Page } from '@/components/_client/Page';
import { Suspense } from '@/components/_client/Suspense';

export default function AccountPage() {
  return (
    <Page title="Tài khoản" description="Quản lý tài khoản nhân viên">
      <Suspense>
        <AccountTable />
      </Suspense>
    </Page>
  );
}
