"use client";

import React from "react";

import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useTags } from "@/dashboard/google-search/hooks/useTags";

const DeleteTagFromKeyword = ({
  selectedRows,
  onActionFinished,
}: {
  selectedRows: any;
  onActionFinished: () => void;
}) => {
  const { deleteTagAndToast } = useTags();

  const keywordIds = selectedRows.rows.map(
    (row: any) => row.original.keywordId,
  );
  const selectedTags = selectedRows.rows.map((row: any) => row.original.tags);

  const allSelectedTags = selectedTags.flat();
  // @ts-ignore
  const names = allSelectedTags.map((item) => item.name);
  // @ts-ignore
  const uniqueNames = [...new Set(names)];

  const handleDeleteClick = async (label: string) => {
    try {
      deleteTagAndToast(label, keywordIds);
      onActionFinished();
    } catch (error) {
      console.error("Failed to delete tag from keywords:", error);
    }
  };

  return (
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
              onClick={() => handleDeleteClick(label)}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};


export default DeleteTagFromKeyword;