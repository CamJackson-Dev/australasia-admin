import { Table } from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({
    table,
}: DataTablePaginationProps<TData>) {
    return (
        <>
            {/* <div className="text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div> */}

            <div className="flex items-center justify-center space-x-6 text-muted-foreground lg:space-x-8">
                {/* <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <p>{`${table.getState().pagination.pageSize}`}</p>
          <div className="flex-col">
            <ChevronUp
              onClick={
                !table.getCanNextPage()
                  ? () => {}
                  : () => {
                      table.getState().pagination.pageSize <= 1
                        ? table.setPageSize(5)
                        : table.setPageSize(
                            table.getState().pagination.pageSize + 5,
                          );
                    }
              }
            ></ChevronUp>
            <ChevronDown
              onClick={() => {
                table.setPageSize(table.getState().pagination.pageSize - 5);
              }}
            ></ChevronDown>
          </div>
          {}
        </div> */}

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-9 w-9 border-2 border-[var(--bsuinessInput)] p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-9 w-9 border-2 border-[var(--bsuinessInput)] p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex w-[80px] items-center justify-center text-sm font-medium">
                        {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        className="h-9 w-9 border-2 border-[var(--bsuinessInput)] p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-9 w-9 border-2 border-[var(--bsuinessInput)] p-0 lg:flex"
                        onClick={() =>
                            table.setPageIndex(table.getPageCount() - 1)
                        }
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </>
    );
}
