"use client";

import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef, flexRender } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import AddEmployee from "@/app/[locale]/manage/accounts/components/AddEmployee";
import { DeleteAccountModal } from "@/app/[locale]/manage/accounts/components/DeleteAccountModal";
import EditEmployee from "@/app/[locale]/manage/accounts/components/EditEmployee";
import AutoPagination from "@/components/_client/AutoPagination";
import { useAuth } from "@/components/provider/auth-provider";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { defaultPagination } from "@/constants/common";
import { Role } from "@/constants/type";
import { AccountProvider, useAccountContext } from "@/context/accountContext";
import { useTable } from "@/hooks/useTable";
import { useGetAccountList } from "@/queries/useAccount";
import { AccountType } from "@/schemaValidations/account.schema";
import { useMemo } from "react";
import { DataTable } from "@/components/_client/Table";

export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <div>
        <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
          <AvatarImage src={row.getValue("avatar")} />
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setEmployeeIdEdit, setEmployeeDelete } = useAccountContext();
      const { role } = useAuth();
      const openEditEmployee = () => {
        setEmployeeIdEdit(row.original.id);
      };

      const openDeleteEmployee = () => {
        setEmployeeDelete(row.original);
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
            <DropdownMenuItem onClick={openEditEmployee}>Sửa</DropdownMenuItem>
            {role === Role.Owner && (
              <DropdownMenuItem onClick={openDeleteEmployee}>
                Xóa
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function AccountTable() {
  const { data: accountList, isPending } = useGetAccountList();
  const data = useMemo(
    () => accountList?.data ?? Array(defaultPagination.pageSize).fill({}),
    [accountList]
  );
  const table = useTable({
    isPending,
    data,
    columns,
    skeleton: {
      width: [30, 100, 30, 30, 30],
      height: [30, 100, 30, 30, 30],
    },
  });
  return (
    <AccountProvider>
      <div className="w-full">
        <EditEmployee />
        <DeleteAccountModal />
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddEmployee />
          </div>
        </div>
        <DataTable table={table} />
      </div>
    </AccountProvider>
  );
}
