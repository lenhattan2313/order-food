'use client';
import {
  getTableLink,
  getVietnameseTableStatus,
} from '@/app/manage/tables/utils/tablesUtils';
import { QRCodeCanvas } from '@/components/_client/QRCode';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TableStatus, TableStatusValues } from '@/constants/type';
import { TableItem, useTableContext } from '@/context/tableContext';
import { toast } from '@/hooks/use-toast';
import { handleApiError } from '@/lib/utils';
import { useGetTableDetail, useUpdateTable } from '@/queries/useTable';
import {
  UpdateTableBody,
  UpdateTableBodyType,
} from '@/schemaValidations/table.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export default function EditTable() {
  const { setTableIdEdit, tableIdEdit } = useTableContext();
  const form = useForm<UpdateTableBodyType>({
    resolver: zodResolver(UpdateTableBody),
    defaultValues: {
      capacity: 2,
      status: TableStatus.Hidden,
      changeToken: false,
    },
  });
  const { setError, reset, handleSubmit } = form;
  const { data } = useGetTableDetail({ number: tableIdEdit });
  const handleReset = useCallback(
    (data: TableItem) => {
      reset({ ...data, changeToken: false });
    },
    [reset],
  );
  useMemo(() => {
    if (data) {
      handleReset(data.data);
    }
  }, [data, handleReset]);
  const { mutateAsync: updateTable, isPending: isUpdatePending } =
    useUpdateTable();
  async function onSubmit(dataForm: UpdateTableBodyType) {
    if (!tableIdEdit) return;
    try {
      const { message } = await updateTable({
        number: tableIdEdit,
        ...dataForm,
      });

      toast({ description: message });
      handleCloseModal(false);
    } catch (error) {
      handleApiError(error, setError);
    }
  }

  function handleCloseModal(value: boolean) {
    if (!value) {
      setTableIdEdit(undefined);
      data && handleReset(data.data);
    }
  }
  return (
    <Dialog
      open={Boolean(tableIdEdit)}
      onOpenChange={(value) => {
        if (!value) {
          setTableIdEdit(undefined);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={() => {
          form.reset();
          setTableIdEdit(undefined);
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật bàn ăn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-table-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label htmlFor="name">Số hiệu bàn</Label>
                  <div className="col-span-3 w-full space-y-2">
                    <Input
                      id="number"
                      type="number"
                      className="w-full"
                      value={data?.data.number ?? 0}
                      disabled
                    />
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Sức chứa (người)</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="capacity"
                          className="w-full"
                          {...field}
                          type="number"
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Trạng thái</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TableStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseTableStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="changeToken"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Đổi QR Code</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="changeToken"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label>QR Code</Label>
                  <div className="col-span-3 w-full space-y-2">
                    {data && (
                      <QRCodeCanvas
                        token={data.data.token}
                        tableNumber={data.data.number}
                      />
                    )}
                  </div>
                </div>
              </FormItem>
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label>URL gọi món</Label>
                  <div className="col-span-3 w-full space-y-2">
                    {data && (
                      <Link
                        href={getTableLink({
                          token: data.data.token,
                          tableNumber: data.data.number,
                        })}
                        target="_blank"
                        className="break-all"
                      >
                        {getTableLink({
                          token: data.data.token,
                          tableNumber: data.data.number,
                        })}
                      </Link>
                    )}
                  </div>
                </div>
              </FormItem>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-table-form"
            isLoading={isUpdatePending}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
