"use client";

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { columns } from "./columns";
import { DataTablePagination } from "./pagination";

interface IArticlesTable {
    articles: Article[];
    loading: boolean;
    refetch: () => void;
    deleteArticle: (article: Article) => void;
}

export function ArticlesTable({
    articles,
    loading,
    deleteArticle,
    refetch,
}: IArticlesTable) {
    const data = articles && articles.length > 0 ? articles : [];

    const table = useReactTable({
        data,
        meta: { deleteArticle, refetch },
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    return (
        <div className="space-y-4 justify-between flex flex-col min-h-[75vh]">
            <div className="relative z-10 w-full  items-center overflow-hidden rounded-lg border-2 border-[var(--inputField)] p-[2px] pb-[2.5px] pr-[2.5px]">
                <div className="relative z-20 flex w-full rounded-xl bg-background p-2">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                className="text-base font-bold text-neutral-100"
                                                key={header.id}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
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
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
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
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            <div className="flex items-center justify-center rounded-md  px-4 py-2">
                <DataTablePagination table={table}></DataTablePagination>
            </div>
        </div>
    );
}
