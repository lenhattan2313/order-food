"use client";

import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import AddTable from "@/app/[locale]/manage/tables/components/AddTable";
import { DeleteTable } from "@/app/[locale]/manage/tables/components/DeleteTable";
import EditTable from "@/app/[locale]/manage/tables/components/EditTable";
import { getVietnameseTableStatus } from "@/app/[locale]/manage/tables/utils/tablesUtils";
import { QRCodeCanvas } from "@/components/_client/QRCode";
import { DataTable } from "@/components/_client/Table";
import { defaultPagination } from "@/constants/common";
import {
  TableItem,
  TableProvider,
  useTableContext,
} from "@/context/tableContext";
import { useTable } from "@/hooks/useTable";
import { useGetTableList } from "@/queries/useTable";

export default function TableTable() {
  const { data: tableList, isPending } = useGetTableList();
  const data = useMemo(
    () => tableList?.data ?? Array(defaultPagination.pageSize).fill({}),
    [tableList]
  );
  const table = useTable({
    isPending,
    data,
    columns,
    skeleton: {
      width: [30, 30, 30, 300, 30],
      height: [30, 30, 30, 300, 30],
    },
  });
  return (
    <TableProvider>
      <div className="w-full">
        <EditTable />
        <DeleteTable />
        <div className="flex items-center py-4">
          <Input
            placeholder="Lọc số bàn"
            value={
              (table.getColumn("number")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("number")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddTable />
          </div>
        </div>
        <DataTable table={table} />
      </div>
    </TableProvider>
  );
}

export const columns: ColumnDef<TableItem>[] = [
  {
    accessorKey: "number",
    header: "Số bàn",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("number")}</div>
    ),
  },
  {
    accessorKey: "capacity",
    header: "Sức chứa",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("capacity")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div>{getVietnameseTableStatus(row.getValue("status"))}</div>
    ),
  },
  {
    accessorKey: "token",
    header: "QR Code",
    cell: ({ row }) => (
      <QRCodeCanvas
        token={row.getValue("token")}
        tableNumber={row.getValue("number")}
      />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setTableIdEdit, setTableDelete } = useTableContext();
      const openEditTable = () => {
        setTableIdEdit(row.original.number);
      };

      const openDeleteTable = () => {
        setTableDelete(row.original);
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
            <DropdownMenuItem onClick={openEditTable}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteTable}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
