import { Skeleton } from "@/components/ui/skeleton";
import { defaultPagination } from "@/constants/common";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface ITableProps<T> {
  isPending: boolean;
  data: T[];
  columns: ColumnDef<T>[];
  columnWidths?: number[];
  columnHeights?: number[];
}
export function useTable<T>({
  isPending,
  data,
  columns,
  columnHeights = [],
  columnWidths = [],
}: ITableProps<T>) {
  const searchParam = useSearchParams();
  const page = searchParam.get("page")
    ? Number(searchParam.get("page"))
    : defaultPagination.page;
  const pageIndex = page - 1;
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: defaultPagination.pageSize, //default page size
  });
  const columnsMemo = useMemo(
    () =>
      isPending
        ? columns.map((column, index) => ({
            ...column,
            cell: () => {
              const height = columnHeights.length ? columnHeights[index] : 30;
              const width = columnWidths.length ? columnWidths[index] : 30;
              return <Skeleton className={`h-[${height}px] w-[${width}px]`} />;
            },
          }))
        : columns,
    [isPending]
  );
  const table = useReactTable({
    data,
    columns: columnsMemo,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: defaultPagination.pageSize,
    });
  }, [table, pageIndex]);

  return table;
}
