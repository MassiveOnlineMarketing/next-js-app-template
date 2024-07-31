"use client";

import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

import { ColumnDef, Row, SortingFn } from "@tanstack/react-table";
import { DateRowCell, StandardHeaderCell, StandardRowCell, TrendingIndicatorRowCell, UrlRowCell } from "@/presentation/components/ui/table";

import { Checkbox } from "@/presentation/components/ui/checkbox";

// import KeywordRowActionDropdown from "./column/keyword-row-action-dropdown";


const urlSortingFn: SortingFn<GoogleSearchLatestKeywordResult> = (
  rowA: Row<GoogleSearchLatestKeywordResult>,
  rowB: Row<GoogleSearchLatestKeywordResult>,
  columnId,
) => {
  const valueA = (rowA.getValue(columnId) as string) || "";
  const valueB = (rowB.getValue(columnId) as string) || "";

  if (valueA && !valueB) return -1;
  if (!valueA && valueB) return 1;
  return valueA.localeCompare(valueB);
};

const positionSortingFn: SortingFn<GoogleSearchLatestKeywordResult> = (
  rowA: Row<GoogleSearchLatestKeywordResult>,
  rowB: Row<GoogleSearchLatestKeywordResult>,
  columnId,
) => {
  const valueA = (rowA.getValue(columnId) as number) || null;
  const valueB = (rowB.getValue(columnId) as number) || null;

  if (valueA === null && valueB !== null) return 1;
  if (valueB === null && valueA !== null) return -1;
  if (valueA === null && valueB === null) return 0;

  // Add a null check for valueA and valueB before subtraction
  if (valueA !== null && valueB !== null) {
    return valueA - valueB;
  } else {
    // Decide what to return when either valueA or valueB is null
    return 0;
  }
};

export const columns = (domainUrl?: string): ColumnDef<GoogleSearchLatestKeywordResult>[] => [
  // * Select column
  {
    id: "select",
    accessorKey: "select",
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
  // * Name
  {
    accessorKey: "keywordName",
    id: "keywordName",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="Keyword" />
    ),
    cell: ({ row: { original: { keywordName } } }) => (
      <StandardRowCell value={keywordName} highlight={true} />
    ),
  },
  // * Url
  {
    accessorKey: "url",
    id: "url",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="Url" />
    ),
    cell: ({ row: {original: {url}} }) => (
      <UrlRowCell value={url} domainUrl={domainUrl} />
    ),
    sortingFn: urlSortingFn,
  },
  // * Position
  {
    accessorKey: "position",
    id: "position",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="Position" />
    ),
    cell: ({ row: { original: { position } } }) => (
      <StandardRowCell value={position} highlight={true} />
    ),
    sortingFn: positionSortingFn,
  },
  // * First Position
  {
    accessorKey: "firstPosition",
    id: "firstPosition",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="First Position" />
    ),
    cell: ({ row: { original: { firstPosition } } }) => (
      <StandardRowCell value={firstPosition} />
    ),
    sortingFn: positionSortingFn,
  },
  // * Best Position
  {
    accessorKey: "bestPosition",
    id: "bestPosition",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="Best Position" />
    ),
    cell: ({ row: { original: { bestPosition } } }) => (
      <StandardRowCell value={bestPosition} />
    ),
    sortingFn: positionSortingFn,
  },
  // * Latest Change
  {
    accessorKey: "latestChange",
    id: "latestChange",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="Latest Change" />
    ),
    cell: ({ row: { original: { latestChange } } }) => (
      <TrendingIndicatorRowCell value={latestChange} />
    ),
    sortingFn: positionSortingFn,
  },
  // * Avg Monthly Searches
  {
    accessorKey: "avgMonthlySearches",
    id: "avgMonthlySearches",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="Avg Monthly Searches" />
    ),
    cell: ({ row: { original: {avgMonthlySearches} } }) => (
      <StandardRowCell value={avgMonthlySearches} />
    ),
  },
  // * Tags
  {
    accessorKey: "tags",
    id: "tags",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="Tags" />
    ),
    cell: ({ row: { original: { tags } } }) => (
      <div className="flex flex-wrap gap-2 max-w-[200px]">
        {
          tags.map((tag) => (
            // TODO: design van tags pill
            <p key={tag.id} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-nowrap">
              {tag.name}
            </p>
          ))
        }
      </div>
    ),
  },
  // * Competition
  {
    accessorKey: "competition",
    id: "competition",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="Competition" />
    ),
    cell: ({ row: { original: {competition} } }) => (
      <StandardRowCell value={competition} />
    ),
  },
  // * Competition Index
  {
    accessorKey: "competitionIndex",
    id: "competitionIndex",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="Competition Index" />
    ),
    cell: ({ row: { original: {competitionIndex} } }) => (
      <StandardRowCell value={competitionIndex} />
    ),
  },
  // * High Top Of Page Bid
  {
    accessorKey: "highTopOfBidPage",
    id: "highTopOfBidPage",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="High Top Of Page Bid" />
    ),
    cell: ({ row: { original: {highTopOfBidPage} } }) => (
      <StandardRowCell value={highTopOfBidPage} />
    ),
  },
  // * Low Top Of Page Bid
  {
    accessorKey: "lowTopOfBidPage",
    id: "lowTopOfBidPage",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="Low Top Of Page Bid" />
    ),
    cell: ({ row: { original: {lowTopOfBidPage} } }) => (
      <StandardRowCell value={lowTopOfBidPage} />
    ),
  },
  // * Date Retrieved
  {
    accessorKey: "createdAt",
    id: "createdAt",
    header: ({ column }) => (
      <StandardHeaderCell sorting={true} column={column} title="Last Updated" />
    ),
    cell: ({ row: { original: {createdAt}} }) => (
      <DateRowCell value={createdAt} />
    )
  },
  // // * Actions
  // {
  //   accessorKey: "actions",
  //   id: "actions",
  //   header: ({ column }) => (
  //     <p className="font-medium text-gray-600">Actions</p>
  //   ),
  //   cell: ({ row }) => {
  //     const keyword = row.original;
  //     return <KeywordRowActionDropdown keyword={keyword} />;
  //   },
  // },
];
