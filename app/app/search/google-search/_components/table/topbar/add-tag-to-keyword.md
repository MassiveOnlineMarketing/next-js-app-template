"use client";

import React from "react";

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { GoogleSearchKeywordTag } from "@prisma/client";
import { useTags } from "@/dashboard/google-search/hooks/useTags";

const AddTagToKeywords = ({
  selectedRows,
  onActionFinished,
}: {
  selectedRows: any;
  onActionFinished: () => void;
}) => {
  const { addTagAndToast, uniqueTags } = useTags();

  const keywordIds = selectedRows.rows.map(
    (row: any) => row.original.keywordId,
  );

  const handleAddClick = async (tag: GoogleSearchKeywordTag) => {
    console.log("label", tag);
    await addTagAndToast(tag, keywordIds);
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