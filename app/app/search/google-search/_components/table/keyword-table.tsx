"use client";

import React, { useState } from "react";
import useColumnOrder from "@/presentation/components/ui/table/useColumnOrder";

import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";

// Components
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/presentation/components/ui/table/table";
import DataTablePagination from "@/presentation/components/ui/table/table-pagination";

import DataTableTopBar from "./topbar";
import KeywordDetailsRow from "./KeywordDetailsRow";



interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  googleSearchCampaign: GoogleSearchCampaign;
}

function DataTable<TData, TValue>({
  columns,
  data,
  googleSearchCampaign,
}: DataTableProps<TData, TValue>) {

  const [rowSelection, setRowSelection] = useState({});

  //* Column order and sorting
  const { columnOrder, setColumnOrder, handleDragStart, handleDrop } = useColumnOrder(columns, 'keywordsTableColumnOrder');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    competition: false,
    competitionIndex: false,
    highTopOfBidPage: false,
    lowTopOfBidPage: false,
  });



  //* Result Details row
  const [selectedRowIndex, setSelectedRowIndex] = useState<string | null>(null);
  const [keywordData, setKeywordData] = useState<GoogleSearchLatestKeywordResult | null>(null);

  const handleClickRow =
    (id: string) => (event: React.MouseEvent<HTMLTableRowElement>) => {
      let index = parseInt(id, 10);

      if (selectedRowIndex === id) {
        setSelectedRowIndex(null);
        return;
      }

      setSelectedRowIndex((prevId) => (prevId === id ? null : id));

      if (!isNaN(index) && index >= 0 && index < data.length) {
        let item = data[index];
        // console.log(item); // Check what the object looks like
        setKeywordData(item as GoogleSearchLatestKeywordResult);
      } else {
        console.log("Invalid index");
      }
    };


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnOrder
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 50 },
    },
    getPaginationRowModel: getPaginationRowModel(),
  });

  const numberOfVisibleColumns = table.getVisibleFlatColumns().length;

  return (
    // dit weg
    <div className="p-6 h-[calc(100vh-322px)] overflow-y-auto custom-scrollbar pb-10">

      <div className="bg-primary-50 dark:bg-p-1100  h-[150px] top-0 absolute z-10 w-[97%]"></div>

      {/* Dit we */}
      <div className="sticky top-0 dark:bg-p-1100 z-20" >
        {/* Top bar */}
        <DataTableTopBar
          table={table}
          data={data}
          deselectAllRows={() => setRowSelection({})}
        />
      </div>

      {/* Keywords Table */}
      <div className="pt-6 pb-20">
        {/* Dit naar Table */}
        <table className="w-full">
          {/* Weg , overflow hidden*/}
          <TableHeader className="sticky top-[72px] z-20       rouded-md  bg-white dark:bg-[rgba(223,229,250,0.02)]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className=" rounded-lg shadow-sm  dark:bg-[rgba(223,229,250,0.02)]">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, header.id)}
                      onDrop={(e) => handleDrop(e, header.id)}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-y-auto">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-gray-200 dark:border-[#DFE5FA]/10 hover:bg-neutral-100/50 cursor-pointer"
                    // handle click row, open keyword detail
                    onClick={handleClickRow(row.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                  {row.id === selectedRowIndex && (
                    <tr>
                      {keywordData ? (
                        <td className="pt-6" colSpan={numberOfVisibleColumns}>
                          <KeywordDetailsRow
                            keywordData={keywordData}
                            googleSearchCampaign={googleSearchCampaign}
                          />
                        </td>
                      ) : (
                        <td colSpan={numberOfVisibleColumns}>Loading...</td>
                      )}
                    </tr>
                  )}
                </React.Fragment>
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
        </table>
      <DataTablePagination table={table} />
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}




export default DataTable;
