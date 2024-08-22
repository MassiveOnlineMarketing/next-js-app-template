"use client";

import React from "react";

import { GoogleSearchKeywordTag } from "@/domain/serpTracker/models/GoogleSearchKeywordTag";
import useGoogleSearchKeywordTagOpperations from "@/presentation/keyword-tracker/hooks/useGoogleSearchKeywordTagOpperations";

import { DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "@/presentation/components/ui/dropdown-menu";

const AddTagToKeywords = ({
  selectedRows,
  onActionFinished,
}: {
  selectedRows: any;
  onActionFinished: () => void;
}) => {
  const { addTag, uniqueTags } = useGoogleSearchKeywordTagOpperations();

  const keywordIds = selectedRows.rows.map(
    (row: any) => row.original.keywordId,
  );

  const handleAddClick = async (tag: GoogleSearchKeywordTag) => {
    await addTag(tag, keywordIds);
    onActionFinished();
  };

  return (
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
              onClick={() => handleAddClick(label)}
            >
              {label.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};

export default AddTagToKeywords;