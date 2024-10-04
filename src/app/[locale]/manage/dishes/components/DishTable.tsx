"use client";

import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import AddDish from "@/app/[locale]/manage/dishes/components/AddDish";
import EditDish from "@/app/[locale]/manage/dishes/components/EditDish";
import { getVietnameseDishStatus } from "@/app/[locale]/manage/dishes/utils/dishesUtils";

import { DeleteDish } from "@/app/[locale]/manage/dishes/components/DeleteDish";
import { DataTable } from "@/components/_client/Table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { defaultPagination } from "@/constants/common";
import { DishItem, DishProvider, useDishContext } from "@/context/dishContext";
import { useTable } from "@/hooks/useTable";
import { formatCurrency } from "@/lib/currency";
import { useGetDishList } from "@/queries/useDish";
import { useMemo } from "react";
const columnWidths = [30, 100, 30, 30, 30, 30, 30];
const columnHeights = [30, 100, 30, 30, 30, 30, 30];
export const columns: ColumnDef<DishItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "image",
    header: "Ảnh",
    cell: ({ row }) => (
      <div>
        <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
          <AvatarImage src={row.getValue("image")} />
          <AvatarFallback className="rounded-none">
            {row.original.name}
          </AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "price",
    header: "Giá cả",
    cell: ({ row }) => (
      <div className="capitalize">{formatCurrency(row.getValue("price"))}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <div
        dangerouslySetInnerHTML={{ __html: row.getValue("description") }}
        className="whitespace-pre-line"
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div>{getVietnameseDishStatus(row.getValue("status"))}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setDishIdEdit, setDishDelete } = useDishContext();
      const openEditDish = () => {
        setDishIdEdit(row.original.id);
      };

      const openDeleteDish = () => {
        setDishDelete(row.original);
      };
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditDish}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteDish}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function DishTable() {
  const { data: dishList, isPending } = useGetDishList();
  const data: DishItem[] = useMemo(
    () => dishList?.data ?? Array(defaultPagination.pageSize).fill({}),
    [dishList]
  );

  const table = useTable({
    isPending,
    data,
    columns,
    columnHeights,
    columnWidths,
  });
  return (
    <DishProvider>
      <div className="w-full">
        <EditDish />
        <DeleteDish />
        <div className="flex items-center py-4">
          <Input
            placeholder="Lọc tên"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddDish />
          </div>
        </div>
        <DataTable table={table} />
      </div>
    </DishProvider>
  );
}
