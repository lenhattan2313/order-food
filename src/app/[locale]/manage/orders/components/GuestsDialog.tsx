import { DataTable } from '@/components/_client/Table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { dateRangeDefault } from '@/constants/common';
import { useTable } from '@/hooks/useTable';
import { formatDateTimeToLocaleString } from '@/lib/dateUtils';
import { simpleMatchText } from '@/lib/utils';
import { useGetGuestList } from '@/queries/useAccount';
import { GetListGuestsResType } from '@/schemaValidations/account.schema';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type GuestItem = GetListGuestsResType['data'][0];

export const useColumns = (): ColumnDef<GuestItem>[] => {
  const t = useTranslations('common');
  return [
    {
      accessorKey: 'name',
      header: t('name'),
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue('name')} | (#{row.original.id})
        </div>
      ),
      filterFn: (row, filterValue: string) => {
        if (!filterValue) return true;
        return simpleMatchText(
          row.original.name + String(row.original.id),
          String(filterValue),
        );
      },
    },
    {
      accessorKey: 'tableNumber',
      header: t('tableNumber'),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('tableNumber')}</div>
      ),
      filterFn: (row, filterValue: string) => {
        if (!filterValue) return true;
        return simpleMatchText(
          String(row.original.tableNumber),
          String(filterValue),
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('createdAt'),
      cell: ({ row }) => (
        <div className="flex items-center space-x-4 text-sm">
          {formatDateTimeToLocaleString(row.getValue('createdAt'))}
        </div>
      ),
    },
  ];
};
export default function GuestsDialog({
  onChoose,
}: {
  onChoose: (guest: GuestItem) => void;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(dateRangeDefault.fromDate);
  const [toDate, setToDate] = useState(dateRangeDefault.toDate);
  const { data, isPending } = useGetGuestList({ fromDate, toDate });
  const guests = useMemo(() => data?.data ?? [], [data]);
  const columns = useColumns();
  const table = useTable({
    isPending,
    data: guests,
    columns,
  });

  const choose = (guest: GuestItem) => {
    onChoose(guest);
    setOpen(false);
  };

  const resetDateFilter = () => {
    setFromDate(dateRangeDefault.fromDate);
    setToDate(dateRangeDefault.toDate);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} data-testid="dialog-guest">
      <DialogTrigger asChild>
        <Button variant="outline">{t('guest.selectGuest')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-full overflow-auto">
        <DialogHeader>
          <DialogTitle>{t('guest.selectGuest')}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div>
          <div className="w-full">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center">
                <span className="mr-2">{t('common.from')}</span>
                <Input
                  type="datetime-local"
                  placeholder={t('common.from')}
                  className="text-sm"
                  value={format(fromDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
                  onChange={(event) =>
                    setFromDate(new Date(event.target.value))
                  }
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2">{t('common.to')}</span>
                <Input
                  type="datetime-local"
                  placeholder={t('common.to')}
                  value={format(toDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
                  onChange={(event) => setToDate(new Date(event.target.value))}
                />
              </div>
              <Button
                className=""
                variant={'outline'}
                onClick={resetDateFilter}
              >
                {t('button.reset')}
              </Button>
            </div>
            <div className="flex items-center py-4 gap-2">
              <Input
                placeholder={t('guest.nameOrId')}
                value={
                  (table.getColumn('name')?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table.getColumn('name')?.setFilterValue(event.target.value)
                }
                className="w-[170px]"
              />
              <Input
                placeholder={t('common.tableNumber')}
                value={
                  (table
                    .getColumn('tableNumber')
                    ?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table
                    .getColumn('tableNumber')
                    ?.setFilterValue(event.target.value)
                }
                className="w-[170px]"
              />
            </div>
            <DataTable
              dataTestId="dialog-guest"
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
