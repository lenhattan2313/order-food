import { Skeleton } from "@/components/ui/skeleton";
import { defaultPagination } from "@/constants/common";
import { getSkeletonDimension } from "@/lib/utils";
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
  skeleton?: {
    width: number | number[];
    height: number | number[];
  };
}
export function useTable<T>({
  isPending,
  data,
  columns,
  skeleton,
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
              const { width, height } = skeleton ?? {};
              // Get width and height for the skeleton
              const heightSkeleton = getSkeletonDimension(height, index, 30);
              const widthSkeleton = getSkeletonDimension(width, index, 30);
              return (
                <Skeleton
                  className={`h-[${heightSkeleton}px] w-[${widthSkeleton}px]`}
                />
              );
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
