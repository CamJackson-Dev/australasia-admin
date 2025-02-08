"use client";

import {
    deleteEventByHandle,
    getEvents,
    updateUserEventVerification,
} from "@/mutations/events";
import { useQuery } from "react-query";
import { useMemo, useState } from "react";
import Link from "next/link";
import { convert } from "html-to-text";
import CircularProgress from "@/components/ui/loading";
import TopLink from "@/components/TopLink";
import { EventDetailsGET } from "@/types/event";
import useToast from "@/hooks/useToast";
import { BadgeCheck, Trash2 } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogOverlay,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    deleteArticleById,
    getArticles,
    updateArticleVerification,
} from "@/mutations/articles";
import { Button } from "@/components/ui/button";
import { ArticlesTable } from "./Table/Table";
import { Input } from "@/components/ui/input";
import { ColumnFiltersState } from "@tanstack/react-table";
import DebouncedInput from "@/components/DebouncedInput";

declare module "@tanstack/react-table" {
    //@ts-ignore
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: "text" | "status" | "type";
    }
}

const CustomEvents = () => {
    const notify = useToast();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [deleting, setDeleting] = useState(false);
    const [deleteArticle, setDeleteArticle] = useState<Article | null>(null);

    const [keyword, setKeyword] = useState("");

    const { data, isLoading, refetch } = useQuery(["articles"], async () => {
        const res = await getArticles();
        return res.docs.map((doc) => doc.data() as Article);
    });

    if (isLoading || deleting)
        return (
            <div className="w-full h-[80vh] flex items-center justify-center">
                <CircularProgress />
            </div>
        );

    const handleDelete = async () => {
        if (!deleteArticle) return;

        window.scrollTo(0, 0);
        setDeleting(true);
        await deleteArticleById(deleteArticle.id);
        await refetch();
        setDeleting(false);
        notify("success", "Article deleted successfully!");
    };

    const handleSearch = (value: string) => {
        setKeyword(value);

        // console.log(columnFilters);
        setColumnFilters((prevFilters) => [
            ...prevFilters.filter((f) => f.id !== "title"),
            { id: "title", value },
        ]);
    };

    return (
        <div className="p-8">
            <Dialog>
                <div className="w-full flex justify-between">
                    <DebouncedInput
                        type="text"
                        className="w-80 border-2 border-neutral-600 focus:border-neutral-400"
                        placeholder="Search"
                        value={keyword}
                        onChange={handleSearch}
                    />
                    <Link href={"/articles/new"}>
                        <Button className="w-max">+ New Article</Button>
                    </Link>
                </div>
                <div className="mt-4 flex flex-col gap-4">
                    <ArticlesTable
                        articles={data}
                        loading={isLoading}
                        refetch={refetch}
                        deleteArticle={setDeleteArticle}
                        filters={columnFilters}
                        setFilters={setColumnFilters}
                    />
                </div>

                <DialogOverlay className="z-10">
                    <DialogContent className="z-[100000]">
                        <div className="w-full md:w-[500px] p-4 rounded-lg bg-slate-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black">
                            {deleting ? (
                                <div>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <div>
                                    <p className="font-semibold text-lg">
                                        Delete this article?
                                    </p>
                                    <div className=" bg-slate-200 p-2 rounded-md my-4">
                                        <p className="font-semibold">
                                            {deleteArticle?.title}
                                        </p>

                                        <p className="italic">
                                            {convert(
                                                deleteArticle?.description
                                                    .length > 100
                                                    ? deleteArticle?.description.substring(
                                                          0,
                                                          100
                                                      ) + "..."
                                                    : deleteArticle?.description
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-end gap-4 mt-6">
                                        <DialogClose>
                                            <p
                                                // onClick={() => {}}
                                                className=" bg-slate-600 p-2 px-4 text-sm text-white rounded-md"
                                            >
                                                Cancel
                                            </p>
                                        </DialogClose>
                                        <button
                                            onClick={handleDelete}
                                            className=" bg-red-500 p-2 px-4 text-sm text-white rounded-md"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </DialogOverlay>
            </Dialog>
        </div>
    );
};

export default CustomEvents;
