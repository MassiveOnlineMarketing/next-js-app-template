"use client";

import React, { useEffect, useState } from "react";

import { GoogleSearchKeywordTag, GoogleSearchResult } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemEmpty,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { Button } from "@/presentation/components/ui/button";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";
import useGoogleSearchKeywordTagOpperations from "@/presentation/hooks/serp/useGoogleSearchKeywordTagOpperations";
import useKeywordOpperations from "@/presentation/hooks/serp/useKeywordOpperations";

type Props = {
  keyword: GoogleSearchLatestKeywordResult;
};

const KeywordRowActionsDropdown = ({ keyword }: Props) => {
  // * Remove Tags
  const { deleteTag, addTag, uniqueTags } = useGoogleSearchKeywordTagOpperations();

  const selectedTags = keyword.tags;
  const allSelectedTags = selectedTags?.flat();
  const names = allSelectedTags?.map((item) => item.name);
  // @ts-ignore
  const uniqueNames = [...new Set(names)];

  const handleDeleteTag = async (label: string) => {
    try {
      deleteTag(label, keyword.keywordId);
    } catch (error) {
      console.error("Failed to delete tag from keywords:", error);
    }
  };

  // * Add Tags
  const handleAddTag = async (tag: GoogleSearchKeywordTag) => {
    // console.log("label", tag);
    await addTag(tag, keyword.keywordId);
  };

  // * Delete Keywords
  const { handleDeleteKeyword, confirmDelete, isDeleteDialogOpen } = useKeywordOpperations();

  const handleKeywordsDelete = async (keywordId: string) => {
    // console.log("delete", keywordId);
    handleDeleteKeyword([keywordId]);
  };
  useEffect(() => {
    if (isDeleteDialogOpen) {
      confirmDelete();
    }
  }, [isDeleteDialogOpen]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="dashboard">
          <span className="sr-only">Open menu</span>
          <EllipsisHorizontalIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="relative">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {/* <DropdownMenuItem
                    onClick={(event) => {
                        event.stopPropagation()
                        if (keyword.url) {
                            navigator.clipboard.writeText(keyword.url)
                        }
                    }}
                >
                    Copy Url
                </DropdownMenuItem> */}

        {/* Remove tags */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Delete tag</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {uniqueNames.length === 0 && (
                <DropdownMenuItem disabled>No tags to delete</DropdownMenuItem>
              )}
              {uniqueNames.map((label) => (
                <DropdownMenuItem
                  key={label}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleDeleteTag(label)}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* Add Tag */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Add existing tag</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {uniqueTags.length === 0 && (
                <DropdownMenuItem disabled>No existing tags</DropdownMenuItem>
              )}
              {uniqueTags.map((label) => (
                <DropdownMenuItem
                  key={label.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAddTag(label)}
                >
                  {label.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        {/* Delete Keyword */}

        <DropdownMenuItem
          onClick={(event) => {
            // Stop the event from bubbling up to the parent
            event.stopPropagation();
            // Prevent close on click
            event.preventDefault();
            handleKeywordsDelete(keyword.keywordId);
          }}
          className="text-red-500 border border-red-500 rounded-md focus:bg-red-50 focus:text-red-600 cursor-pointer"
        >
          Delete
        </DropdownMenuItem>

        {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KeywordRowActionsDropdown;
