import React from "react";
import { useTags } from "@/dashboard/google-search/hooks/useTags";

import { useKeywordResultsStore } from "@/lib/zustand/keyword-results-store";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { OutlinedButton } from "@/components/ui/button";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

const TagSelection = () => {
  const { uniqueTags } = useTags();

  const updateSelectedTags = useKeywordResultsStore(
    (state) => state.setSelectedTags,
  );
  const selectedTags = useKeywordResultsStore((state) => state.selectedTags);

  const [tagPopoverOpen, setTagPopoverOpen] = React.useState(false);

  const toggleTag = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    updateSelectedTags(newSelectedTags);
  };

  const clearTags = () => updateSelectedTags([]);

  let tagSting = selectedTags.join(", ");
  if (tagSting.length > 24) {
    tagSting = tagSting.slice(0, 24) + "...";
  }

  return (
    <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
      <PopoverTrigger asChild>
        <OutlinedButton
          role="combobox"
          aria-expanded={tagPopoverOpen}
          size="smD"
          buttonClassName="w-[250px]  text-sm text-left"
        >
          <span className="text-gray-400 ">Tags:</span>
          {tagSting ? (
            <span className="text-gray-800">{tagSting}</span>
          ) : (
            <span className="text-gray-800">All Keywords</span>
          )}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </OutlinedButton>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder={
              uniqueTags.length > 0 ? "Search tag..." : "No existing tags"
            }
            className="h-9"
          />
          {uniqueTags.length > 0 && (
            <CommandGroup>
              <CommandItem value="" onSelect={() => clearTags()} className="hover:bg-gray-100">
                All Keywords
              </CommandItem>
              {uniqueTags.map((tag) => (
                <CommandItem
                  key={tag.name}
                  value={tag.name}
                  onSelect={(currentValue) => {
                    toggleTag(tag.name);
                  }}
                >
                  {tag.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedTags.includes(tag.name)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TagSelection;

{
  /* <div className="flex flex-col">
{SORTING_IDS.map((element) => (
  <button
    className="inline-flex items-center gap-1 "
    key={element.id}
    onClick={() => toggleSort(element.id)}
  >
    {element.label}
    {sorting[0]?.id === element.id && (sorting[0]?.desc ? <ChevronDownIcon className="w-4 h-4 text-gray-500" /> : <ChevronUpIcon className="w-4 h-4 text-gray-500" />)}
  </button>
))}
</div> */
}
