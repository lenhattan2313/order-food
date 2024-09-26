"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTableContext } from "@/context/tableContext";
import { toast } from "@/hooks/use-toast";
import { handleApiError } from "@/lib/utils";
import { useDeleteTable } from "@/queries/useTable";
export function DeleteTable() {
  const { tableDelete, setTableDelete } = useTableContext();
  const { mutateAsync, isPending } = useDeleteTable();

  async function handleDelete() {
    if (!tableDelete) return;
    try {
      const { message } = await mutateAsync({ number: tableDelete.number });
      toast({ description: message });
    } catch (error) {
      handleApiError(error);
    }
  }
  return (
    <AlertDialog
      open={Boolean(tableDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bàn{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {tableDelete?.number}
            </span>{" "}
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
