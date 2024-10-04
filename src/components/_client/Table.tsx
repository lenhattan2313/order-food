import AutoPagination from "@/components/_client/AutoPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { defaultPagination } from "@/constants/common";
import { usePathname } from "@/navigation";
import { Table as TableProps, flexRender } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
interface ITableProps<T> {
  table: TableProps<T>;
}

export function DataTable<T>({ table }: ITableProps<T>) {
  const pathname = usePathname();
  const searchParam = useSearchParams();
  const page = searchParam.get("page")
    ? Number(searchParam.get("page"))
    : defaultPagination.page;
  const pageIndex = page - 1;

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: defaultPagination.pageSize,
    });
  }, [table, pageIndex]);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-xs text-muted-foreground py-4 flex-1 ">
          Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
          trong <strong>{table.getRowCount()}</strong> kết quả
        </div>
        <div>
          <AutoPagination
            page={table.getState().pagination.pageIndex + 1}
            pageSize={table.getPageCount()}
            pathname={pathname}
          />
        </div>
      </div>
    </>
  );
}
