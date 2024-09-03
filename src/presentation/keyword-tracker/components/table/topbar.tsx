import { Table } from "@tanstack/react-table";
import { cn } from "@/presentation/components/utils";

// Components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/presentation/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/presentation/components/ui/dropdown-menu";

// Assets
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";

// Topbar components
import AddTagToKeywords from "./topbar/AddTagToKeywords";
import DeleteTagFromKeyword from "./topbar/DeleteTagFromKeywords";
import AddNewTagInput from "./topbar/AddNewTagInput";
import TagSelection from "./topbar/TagSelection";
import downloadKeywordsToExcel from "@/presentation/lib/xlsx";
import DeleteKeywordSelectedRowButton from "./topbar/DeleteKeywordSelectedRow";

import GoogleSearchAddKeywordsFormDialog from "@/presentation/components/google-search-campaign/google-search-add-keywords-form-dialog";


interface TopBarProps<TData> {
  table: Table<TData>;
  data: TData[];
  deselectAllRows: () => void;

  // sorting: SortingState;
  // setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}

function DataTableTopBar<TData>({
  table,
  data,
  deselectAllRows
}: TopBarProps<TData>) {
  return (
    <div className="flex items-center relative">
      {/* Backdrop */}
      <div className="absolute w-full -top-6 h-[140px] -z-10 bg-white dark:bg-p-1100 "></div>
      
      {/* Searchbar */}
      <div className="relative rounded-md shadow-sm h-[34px] z-30">
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
          className={cn(
            'ring-gray-300 text-gray-900 placeholder:text-gray-400',
            'dark:ring-dark-stroke mix-blend-multiply dark:mix-blend-plus-lighter dark:bg-dark-bg-light dark:text-dark-text-dark dark:placeholder:text-[#DFE5FA]/35',
            "block w-full min-w-[245px] rounded-md border-0 py-1.5 pl-10  ring-1 ring-inset  focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6"
          )}

        />
      </div>

      {/* Selected rows */}
      <div className="ml-2">
        {table.getSelectedRowModel().rows.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 p-[2px] rounded-[10px] bg-white dark:bg-dark-bg-light">
              <p className="px-[18px] flex items-center h-full rounded-lg border border-gray-200 dark:border-dark-stroke mix-blend-multiply dark:mix-blend-plus-lighter text-sm text-gray-800 dark:text-dark-text-dark">
                Bulk Actions
              </p>
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


      {/* Actions */}
      <div className="ml-4 h-11 p-[2px] rounded-[10px] bg-white dark:bg-dark-bg-light">
        <div className="flex h-10 rounded-lg border border-gray-200 dark:border-dark-stroke mix-blend-multiply dark:mix-blend-plus-lighter">
          <TooltipProvider delayDuration={0}>
            {/* Add keyword */}
            <Tooltip>
              <TooltipTrigger>
                <GoogleSearchAddKeywordsFormDialog buttonClassName="px-4 py-[10px] active:bg-[rgba(243,243,244,0.1)] active:rounded-lg">
                  <PlusIcon className="w-5 h-5 text-gray-500 dark:text-dark-text-dark group-hover:text-green-500" />
                </GoogleSearchAddKeywordsFormDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Keyword</p>
              </TooltipContent>
            </Tooltip>

            {/* Divider */}
            <div className="h-5 w-[1px] my-[10px] bg-gray-200 dark:bg-dark-stroke mix-blend-multiply dark:mix-blend-plus-lighter"></div>

            {/* Download to Excel */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="px-4 py-[10px] active:bg-[rgba(243,243,244,0.1)] active:rounded-lg"  
                  onClick={() => downloadKeywordsToExcel(data)}
                >
                  <ArrowDownTrayIcon className="w-5 h-5 text-gray-500 dark:text-dark-text-dark" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Excel</p>
              </TooltipContent>
            </Tooltip>

            {/* Divider */}
            <div className="h-5 w-[1px] my-[10px] bg-gray-200 dark:bg-dark-stroke mix-blend-multiply dark:mix-blend-plus-lighter"></div>

            {/* Toggle visable colums */}
            <Tooltip>
              <TooltipTrigger>
                <DropdownMenu>
                  <DropdownMenuTrigger  className="px-4 py-[10px] active:bg-[rgba(243,243,244,0.1)] active:rounded-lg">
                    <ViewColumnsIcon className="w-5 h-5 text-gray-500 dark:text-dark-text-dark" />
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
        </div>
      </div>

    </div>
  );
}

export default DataTableTopBar;