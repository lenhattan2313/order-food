import { Dialog } from '@/components/_client/Dialog';
import { Button } from '@/components/ui/button';
import { useAccountContext } from '@/context/accountContext';
import { toast } from '@/hooks/use-toast';
import { handleApiError } from '@/lib/utils';
import { useDeleteEmployee } from '@/queries/useAccount';
export function DeleteAccountModal() {
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
      title="Xoá nhân viên?"
      description={
        <>
          <span className="bg-foreground text-primary-foreground rounded px-1">
            {employeeDelete?.name}
          </span>{' '}
          sẽ bị xoá vĩnh viễn
        </>
      }
      footer={[
        <Button onClick={handleDelete} isLoading={isPending} key="continue">
          Tiếp tục
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
