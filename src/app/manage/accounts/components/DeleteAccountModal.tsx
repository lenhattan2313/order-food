import { Dialog } from '@/components/_client/Dialog';
import { Button } from '@/components/ui/button';
import { useAccountContext } from '@/context/accountContext';
import { toast } from '@/hooks/use-toast';
import { handleApiError } from '@/lib/utils';
import { useDeleteEmployee } from '@/queries/useAccount';
import { useTranslations } from 'next-intl';
export function DeleteAccountModal() {
  const t = useTranslations('accounts');
  const tb = useTranslations('button');
  const { setEmployeeDelete, employeeDelete } = useAccountContext();
  const { mutateAsync, isPending } = useDeleteEmployee();

  async function handleDelete() {
    if (!employeeDelete) return;
    try {
      const { message } = await mutateAsync({ id: employeeDelete.id });
      toast({ description: message });
      setEmployeeDelete(null);
    } catch (error) {
      handleApiError(error);
    }
  }
  return (
    <Dialog
      title={t('deleteTitle')}
      description={
        <>
          <span className="bg-foreground text-primary-foreground rounded px-1">
            {employeeDelete?.name}
          </span>{' '}
          {t('deleteDesc')}
        </>
      }
      footer={[
        <Button onClick={handleDelete} isLoading={isPending} key="continue">
          {tb('continue')}
        </Button>,
      ]}
      open={Boolean(employeeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeDelete(null);
        }
      }}
    />
  );
}
