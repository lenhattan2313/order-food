import { ConfirmDialog } from '@/components/_client/ConfirmDialog';
import { useAccountContext } from '@/context/accountContext';
import { toast } from '@/hooks/use-toast';
import { handleApiError } from '@/lib/utils';
import { useDeleteEmployee } from '@/queries/useAccount';
import { useTranslations } from 'next-intl';
export function DeleteAccountModal() {
  const t = useTranslations('accounts');
  const { setEmployeeDelete, employeeDelete } = useAccountContext();
  const { mutateAsync, isPending } = useDeleteEmployee();

  async function handleDelete() {
    if (!employeeDelete) return;
    try {
      const { message } = await mutateAsync({ id: employeeDelete.id });
      toast({ description: message });
    } catch (error) {
      handleApiError(error);
    }
  }
  return (
    <ConfirmDialog
      title={t('deleteTitle')}
      description={
        <>
          <span className="bg-foreground text-primary-foreground rounded px-1">
            {employeeDelete?.name}
          </span>{' '}
          {t('deleteDesc')}
        </>
      }
      onClick={handleDelete}
      isPending={isPending}
      open={Boolean(employeeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeDelete(null);
        }
      }}
    />
  );
}
