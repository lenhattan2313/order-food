import { getVietnameseTableStatus } from '@/app/manage/tables/utils/tablesUtils';
import { DataTable } from '@/components/_client/Table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { TableStatus } from '@/constants/type';
import { useTable } from '@/hooks/useTable';
import { simpleMatchText } from '@/lib/utils';
import { useGetTableList } from '@/queries/useTable';
import { TableListResType } from '@/schemaValidations/table.schema';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';

type TableItem = TableListResType['data'][0];

export const useColumns = (): ColumnDef<TableItem>[] => {
  return [
    {
      accessorKey: 'number',
      header: 'Bàn số',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('number')}</div>
      ),
      filterFn: (row, columnId, filterValue: string) => {
        if (filterValue === undefined) return true;
        return simpleMatchText(
          String(row.original.number),
          String(filterValue),
        );
      },
    },
    {
      accessorKey: 'capacity',
      header: 'Sức chứa',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('capacity')}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <div>{getVietnameseTableStatus(row.getValue('status'))}</div>
      ),
    },
  ];
};

export function TablesDialog({
  onChoose,
}: {
  onChoose: (table: TableItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useGetTableList();
  const tables = useMemo(
    () =>
      data?.data.filter((table) => table.status === TableStatus.Available) ??
      [],
    [data],
  );

  const columns = useColumns();
  const table = useTable({
    isPending,
    data: tables,
    columns,
  });

  const choose = (table: TableItem) => {
    onChoose(table);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Thay đổi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-full overflow-auto">
        <DialogHeader>
          <DialogTitle>Chọn bàn</DialogTitle>
        </DialogHeader>
        <div>
          <div className="w-full">
            <div className="flex items-center py-4">
              <Input
                placeholder="Bàn số"
                value={
                  (table.getColumn('number')?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table.getColumn('number')?.setFilterValue(event.target.value)
                }
                className="w-[150px]"
              />
            </div>
            <DataTable
              dataTestId="dialog-tables"
              table={table}
              onRowClick={choose}
              pagination={{
                onClick: (page) => table.setPageIndex(page - 1),
                isButton: true,
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
