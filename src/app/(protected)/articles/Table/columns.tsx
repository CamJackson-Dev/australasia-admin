"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image"; // Import Image from next/image

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { ActionsColumn, PreviewColumn } from "./actions";
import { BadgeCheck, BadgeX } from "lucide-react";

export const columns: ColumnDef<Article>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="mt-1 border-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-white"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "verified",
    header: "Status",
    cell: (info) =>
      (info.getValue() as boolean) ? (
        <BadgeCheck className="text-green-400 w-5 h-5 ml-4" />
      ) : (
        <BadgeX className="text-red-400 w-5 h-5 ml-4" />
      ),
  },
  {
    accessorKey: "banner",
    header: "Banner",
    cell: (info) => (
      <Image
        className="w-16 h-10 rounded-md"
        src={info.getValue() as string}
        alt="Article banner" // Added alt for accessibility
        width={64} // Specify width
        height={40} // Specify height
      />
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: (info) =>
      (info.getValue() as string).length > 20
        ? (info.getValue() as string).substring(0, 20) + "..."
        : info.getValue(),
    size: 10,
  },
  {
    accessorKey: "isAdmin",
    header: "Type",
    cell: (info) => ((info.getValue() as boolean) ? "Admin" : "User"),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: (info) =>
      (info.getValue() as string[]).slice(0, 3).map((val, index) => (
        <Badge
          key={index} // Ensure each Badge has a unique key
          className="ml-2 bg-[var(--businessInput)] hover:bg-[var(--businessInput)] font-normal"
        >
          {val.replaceAll("'", "")}
        </Badge>
      )),
    size: 30,
  },
  {
    accessorKey: "preview",
    header: "Preview",
    cell: ({ row }) => <PreviewColumn article={row.original} />,
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      //@ts-ignore
      const { deleteArticle, refetch } = table.options.meta;

      return (
        <ActionsColumn
          article={row.original}
          deleteArticle={deleteArticle}
          refetch={refetch}
        />
      );
    },
  },
];
