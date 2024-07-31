"use client";

import { GoogleSearchCampaignWithResult } from "@/application/dto/GoogleSearchCampaignWithResult";

import { ColumnDef } from "@tanstack/react-table";
import { DateRowCell, StandardHeaderCell, StandardRowCell } from "@/presentation/components/ui/table";

import { Checkbox } from "@/presentation/components/ui/checkbox";



export const columns: ColumnDef<GoogleSearchCampaignWithResult>[] = [
    // * Select column
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="rounded-[4px] border-gray-300 border-[1.5px]"
        />
      ),
      cell: ({ row }) => (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}
        >
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="rounded-[4px] border-gray-300 border-[1.5px]"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // * Campaign Name
    {
      accessorKey: "campaignName",
      header: ({ column }) => (
        <StandardHeaderCell sorting={true} column={column} title="Name" />
      ),
      cell: ({ row: { original: { campaignName } } }) => (
        <StandardRowCell value={campaignName} highlight={true} />
      ),
      // sortingFn: positionSortingFn,
    },
    // * Domain
    {
      accessorKey: "domainUrl",
      header: ({ column }) => (
        <StandardHeaderCell sorting={true} column={column} title="Domain" />
      ),
      cell: ({ row: { original: { domainUrl } } }) => (
        <StandardRowCell value={domainUrl} highlight={true} />
      ),
    },
    // * Language
    {
      accessorKey: "language",
      header: ({ column }) => (
        <StandardHeaderCell sorting={true} column={column} title="Language" />
      ),
      cell: ({ row: { original: { language } } }) => (
        <StandardRowCell value={language} highlight={true} />
      ),
      // sortingFn: urlSortingFn,
    },
    // * Country
    {
      accessorKey: "country",
      header: ({ column }) => (
        <StandardHeaderCell sorting={true} column={column} title="Country" />
      ),
      cell: ({ row: { original: { country } } }) => (
        <StandardRowCell value={country} highlight={true} />
      ),
      // sortingFn: positionSortingFn,
    },
    // * Improved
    {
      accessorKey: "improved",
      header: ({ column }) => (
        <StandardHeaderCell sorting={true} column={column} title="Improved" />
      ),
      cell: ({ row: { original: { improved } } }) => (
        <StandardRowCell value={improved} highlight={true} />
      ),
      // sortingFn: positionSortingFn,
    },
    // * Worsened
    {
      accessorKey: "worsened",
      header: ({ column }) => (
        <StandardHeaderCell sorting={true} column={column} title="Worsened" />
      ),
      cell: ({ row: { original: { worsened } } }) => (
        <StandardRowCell value={worsened} highlight={true} />
      ),
      // sortingFn: positionSortingFn,
    },
    // * Total
    {
      accessorKey: "total",
      header: ({ column }) => (
        <StandardHeaderCell sorting={true} column={column} title="Total KW" />
      ),
      cell: ({ row: { original: { total } } }) => (
        <StandardRowCell value={total} highlight={true} />
      ),
    },
    // * Top 3
    {
      accessorKey: "topThree",
      header: ({ column }) => (
        <StandardHeaderCell sorting={true} column={column} title="Top 3" />
      ),
      cell: ({ row: { original: { topThree } } }) => (
        <StandardRowCell value={topThree} highlight={true} />
      ),
    },
    // * Top 10
    {
      accessorKey: "topTen",
      header: ({ column }) => (
        <StandardHeaderCell sorting={true} column={column} title="Top 10" />
      ),
      cell: ({ row: { original: { topTen } } }) => (
        <StandardRowCell value={topTen} highlight={true} />
      ),
    },
    // * Top 100
    {
      accessorKey: "topHundred",
      header: ({ column }) => (
        <StandardHeaderCell sorting={true} column={column} title="Top 100" />
      ),
      cell: ({ row: { original: { topHundred } } }) => (
        <StandardRowCell value={topHundred} highlight={true} />
      ),
    },
    // * Checked
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <StandardHeaderCell sorting={true} column={column} title="Checked" />
      ),
      cell: ({ row: { original: { createdAt } } }) => (
        <DateRowCell value={createdAt} />
      ),
    },
    // // * Actions
    // {
    //     id: "actions",
    //     cell: ({ row }) => {
    //         const keyword = row.original

    //         return (
    //             // <KeywordRowActionDropdown keyword={keyword} />
    //             <div>Actions</div>
    //         )
    //     },
    // },
  ];
