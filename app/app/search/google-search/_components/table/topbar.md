import { useState } from "react";

import { SortingState, Table } from "@tanstack/react-table";

// Components
import { OutlinedButton } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { OutlinedTextButton } from "@/components/ui/text-button";

// Assets
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";

// Topbar components
import AddTagToKeywords from "@/app/(protected)/app/search/google-search/_components/table/topbar/add-tag-to-keyword";
import DeleteTagFromKeyword from "@/app/(protected)/app/search/google-search/_components/table/topbar/delete-tag-from-keyword";
import AddNewTagInput from "@/app/(protected)/app/search/google-search/_components/table/topbar/add-new-tag-input";
import TagSelection from "./topbar/tag-selection";

import DeleteKeywordSelectedRowButton from "@/app/(protected)/app/search/google-search/_components/table/topbar/delete-keyword-selected-row-button";

import AddKeywordsFrom from "@/app/(protected)/app/search/google-search/_components/table/topbar/add-keywords-form";
import downloadToExcel from "@/dashboard/google-search/lib/xlsx";

// import { SortingRows } from "./topbar/row-sorting";
// import AddCompetitorDialog from "@/dashboard/google-search/components/add-competitor-dialog";

interface TopBarProps<TData> {
  table: Table<TData>;
  data: TData[];
  deselectAllRows: () => void;

  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}

function DataTableTopBar<TData>({
  table,
  data,
  deselectAllRows,
  sorting,
  setSorting,
}: TopBarProps<TData>) {
  return (
    <div className="flex items-center">
      {/* Searchbar */}
      <div className="relative rounded-md shadow-sm h-[34px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          placeholder="Search by keyword name..."
          value={
            (table.getColumn("keywordName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("keywordName")?.setFilterValue(event.target.value)
          }
          className="block w-full min-w-[245px] rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"
        />
      </div>

      {/* <AddCompetitorDialog /> */}

      {/* Selected rows */}
      <div className="ml-2">
        {table.getSelectedRowModel().rows.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <OutlinedButton size="smD" className="text-gray-800">
                Bulk Actions
              </OutlinedButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Tag Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <AddTagToKeywords
                  selectedRows={table.getSelectedRowModel()}
                  onActionFinished={deselectAllRows}
                />
                <DeleteTagFromKeyword
                  selectedRows={table.getSelectedRowModel()}
                  onActionFinished={deselectAllRows}
                />
                <DropdownMenuSeparator />
                <AddNewTagInput
                  selectedRows={table.getSelectedRowModel()}
                  onActionFinished={deselectAllRows}
                />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="mr-auto ml-2">
        {table.getSelectedRowModel().rows.length > 0 && (
          <DeleteKeywordSelectedRowButton
            selectedRows={table.getSelectedRowModel()}
            onActionFinished={deselectAllRows}
          />
        )}
      </div>

      {/* Tag selection */}
      <TagSelection />

      {/* Sorting */}
      {/* <div className="ml-2">
        <SortingRows sorting={sorting} setSorting={setSorting} />
      </div> */}

      <TooltipProvider delayDuration={0}>
        {/* Add keyword */}
        <Tooltip>
          <TooltipTrigger>
            <div className=" ml-2 relative w-fit h-fit m-1 group">
              <AddKeywordsFrom buttonClassName=" h-[36px] w-[36px] px-2 rounded-lg  inline-flex items-center justify-center whitespace-nowrap shadow-base bg-white z-40 rounded-lg relative">
                <PlusIcon className="w-5 h-5 text-gray-500 group-hover:text-green-500" />
              </AddKeywordsFrom>
              <div className="absolute top-0 left-0 w-full h-full rounded-[8px] outline outline-4 outline-primary-50 bg-primary-50 group-hover:outline-green-50 group-hover:bg-green-50 z-30"></div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Keyword</p>
          </TooltipContent>
        </Tooltip>

        {/* Download to Excel */}
        <Tooltip>
          <TooltipTrigger>
            <OutlinedTextButton
              className="ml-2"
              size="smD"
              buttonClassName="px-2"
              onClick={() => downloadToExcel(data)}
            >
              <ArrowDownTrayIcon className="w-5 h-5 text-gray-500" />
            </OutlinedTextButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download Excel</p>
          </TooltipContent>
        </Tooltip>

        {/* Toggle visable colums */}
        <Tooltip>
          <TooltipTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <OutlinedTextButton
                  size="smD"
                  className="ml-2"
                  buttonClassName="px-2"
                >
                  <ViewColumnsIcon className="w-5 h-5 text-gray-500" />
                </OutlinedTextButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>
            <p>Show Columns</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Get selected row info */}
      {/* <div>
                {table.getSelectedRowModel().rows.map((row) => (
                    <div key={row.id}>{JSON.stringify(row)}</div>
                ))}
            </div> */}
    </div>
  );
}

export default DataTableTopBar;