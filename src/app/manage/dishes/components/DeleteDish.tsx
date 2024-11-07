import { useDishContext } from '@/context/dishContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { handleApiError } from '@/lib/utils';
import { useDeleteDish } from '@/queries/useDish';
export function DeleteDish() {
  const { setDishDelete, dishDelete } = useDishContext();
  const { mutateAsync, isPending } = useDeleteDish();

  async function handleDelete() {
    if (!dishDelete) return;
    try {
      const { message } = await mutateAsync({ id: dishDelete.id });
      toast({ description: message });
    } catch (error) {
      handleApiError(error);
    }
  }
  return (
    <AlertDialog
      open={Boolean(dishDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setDishDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa món ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Món{' '}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {dishDelete?.name}
            </span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
