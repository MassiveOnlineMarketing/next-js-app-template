import React from "react";

import { useGoogleSearchKeywordResultStore } from "@/presentation/stores/google-search-keyword-result-store";
import useGoogleSearchKeywordTagOpperations from "@/presentation/hooks/serp/useGoogleSearchKeywordTagOpperations";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/presentation/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";

import { OutlinedButton } from "@/presentation/components/ui/button";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/presentation/components/utils";

const TagSelection = () => {
  const { uniqueTags } = useGoogleSearchKeywordTagOpperations();

  const updateSelectedTags = useGoogleSearchKeywordResultStore((state) => state.setSelectedTags);
  const selectedTags = useGoogleSearchKeywordResultStore((state) => state.selectedTags);

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
      <PopoverTrigger role="combobox" aria-expanded={tagPopoverOpen}
        className={cn(
          "w-[250px]  text-sm text-left",
          'h-11 p-[2px] rounded-[10px] bg-white dark:bg-dark-bg-light'
        )}>
        <div className="px-[18px] flex items-center h-10 rounded-lg border border-gray-200 dark:border-dark-stroke mix-blend-multiply dark:mix-blend-plus-lighter">
          <span className="text-gray-400 dark:text-dark-text-dark mr-[6px]">Tags:</span>
          {tagSting ? (
            <span className="text-gray-800 dark:text-dark-text-light">{tagSting}</span>
          ) : (
            <span className="text-gray-800 dark:text-dark-text-light">All Keywords</span>
          )}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 dark:border-dark-stroke dark:bg-dark-bg-light backdrop-blur dark:text-dark-text-light">
        <Command>
          <CommandInput
            placeholder={
              uniqueTags.length > 0 ? "Search tag..." : "No existing tags"
            }
            className="h-9"
          />
          {uniqueTags.length > 0 && (
            <CommandGroup>
              <CommandItem value="" onSelect={() => clearTags()} className="dark:hover:bg-neutral-800" >
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