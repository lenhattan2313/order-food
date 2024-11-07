import { getVietnameseDishStatus } from '@/app/manage/dishes/utils/dishesUtils';
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
import { DishItem } from '@/context/dishContext';
import { useTable } from '@/hooks/useTable';
import { formatCurrency } from '@/lib/currency';
import { simpleMatchText } from '@/lib/utils';
import { useGetDishList } from '@/queries/useDish';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { useMemo, useState } from 'react';

export const useColumns = (): ColumnDef<DishItem>[] => {
  return [
    {
      id: 'dishName',
      header: 'Món ăn',
      cell: ({ row }) => (
        <div className="flex items-center space-x-4">
          <Image
            src={row.original.image}
            alt={row.original.name}
            width={50}
            height={50}
            className="rounded-md object-cover w-[50px] h-[50px]"
          />
          <span>{row.original.name}</span>
        </div>
      ),
      filterFn: (row, columnId, filterValue: string) => {
        if (filterValue === undefined) return true;
        return simpleMatchText(String(row.original.name), String(filterValue));
      },
    },
    {
      accessorKey: 'price',
      header: 'Gía',
      cell: ({ row }) => (
        <div className="capitalize">
          {formatCurrency(row.getValue('price'))}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: ({ row }) => (
        <div>{getVietnameseDishStatus(row.getValue('status'))}</div>
      ),
    },
  ];
};

export function DishesDialog({
  onChoose,
}: {
  onChoose: (dish: DishItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data, isPending } = useGetDishList();
  const dishes = useMemo(() => data?.data ?? [], [data]);

  const columns = useColumns();
  const table = useTable({
    isPending,
    data: dishes,
    columns,
  });

  const choose = (dish: DishItem) => {
    onChoose(dish);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Thay đổi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chọn món ăn</DialogTitle>
        </DialogHeader>
        <div>
          <div className="w-full">
            <div className="flex items-center py-4">
              <Input
                placeholder="Lọc tên"
                value={
                  (table.getColumn('dishName')?.getFilterValue() as string) ??
                  ''
                }
                onChange={(event) =>
                  table
                    .getColumn('dishName')
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            </div>
            <DataTable table={table} onRowClick={choose} />
            <DataTable
              table={table}
              onRowClick={choose}
              dataTestId="dialog-dishes"
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
