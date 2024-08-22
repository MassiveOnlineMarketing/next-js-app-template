import React, { useState } from "react";
import { SortingState } from "@tanstack/react-table";

// Components
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OutlinedButton } from "@/components/ui/button";

// Assets
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

interface SortingRowsProps {
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
}

export function SortingRows({ sorting, setSorting }: SortingRowsProps) {
  const SORTING_IDS = [
    {
      id: "position",
      label: "Position",
    },
    {
      id: "keywordName",
      label: "Keyword",
    },
    {
      id: "url",
      label: "Url",
    },
    {
      id: "firstPosition",
      label: "First Position",
    },
    {
      id: "bestPosition",
      label: "Best Position",
    },
    {
      id: "latestChange",
      label: "Latest Change",
    },
    {
      id: "createdAt",
      label: "Date Retrieved",
    },
  ];

  const [sortState, setSortState] = useState<Record<string, boolean>>({});
  const [tagPopoverOpen, setTagPopoverOpen] = React.useState(false);

  const toggleSort = (columnId: string) => {
    const isDesc =
      sortState[columnId] !== undefined ? sortState[columnId] : true;
    setSortState({ ...sortState, [columnId]: !isDesc });
    setSorting([{ id: columnId, desc: !isDesc }] as SortingState);
  };

  const getLabelById = (id: string) => {
    const item = SORTING_IDS.find((item) => item.id === id);
    return item ? item.label : undefined;
  };

  const resetSort = () => {
    setSortState({});
    setSorting([]);
  };

  return (
    <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
      <PopoverTrigger asChild>
        <OutlinedButton
          role="combobox"
          aria-expanded={tagPopoverOpen}
          size="smD"
          buttonClassName="w-[220px] font-medium text-sm text-left justify-start"
        >
          <span className="text-gray-400 ">Sort by:</span>
          {sorting.length < 1 ? (
            <span className="text-gray-800">Not Sorted...</span>
          ) : (
            <span className="text-gray-800">
              {getLabelById(sorting[0]?.id)}
            </span>
          )}

          {/* {tagSting ? <span>{tagSting}</span> : <span>Select tag...</span>} */}
          {sorting.length > 0 &&
            (sorting[0]?.desc ? (
              <ChevronDownIcon className="ml-auto w-4 h-4 text-gray-400" />
            ) : (
              <ChevronUpIcon className="ml-auto w-4 h-4 text-gray-400" />
            ))}
        </OutlinedButton>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandGroup>
            {SORTING_IDS.map((element) => (
              <CommandItem
                key={element.id}
                value={element.label}
                onSelect={() => toggleSort(element.id)}
              >
                {element.label}
                {sorting[0]?.id === element.id &&
                  (sorting[0]?.desc ? (
                    <ChevronDownIcon className="ml-auto w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronUpIcon className="ml-auto w-4 h-4 text-gray-500" />
                  ))}
              </CommandItem>
            ))}
            <CommandItem onSelect={resetSort}>No Sorting</CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
