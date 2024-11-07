import DashboardMain from '@/app/manage/dashboard/components/DashboardMain';
import { Page } from '@/components/_client/Page';

export default function Dashboard() {
  return (
    <Page title="Bảng điều khiển" description="Phân tích các chỉ số">
      <DashboardMain />
    </Page>
  );
}
