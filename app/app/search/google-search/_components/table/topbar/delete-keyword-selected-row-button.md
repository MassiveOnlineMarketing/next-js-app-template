import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTriggerNoButton,
} from "@/website/features/dialog/dialog";
import { useKeywords } from "@/dashboard/google-search/hooks/useKeywords";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuItemEmpty,
} from "@/components/ui/dropdown-menu";
import { OutlinedTextButton } from "@/components/ui/text-button";
import { TrashIcon } from "@heroicons/react/24/outline";

const DeleteKeywordSelectedRowButton = ({
  selectedRows,
  onActionFinished,
}: {
  selectedRows: any;
  onActionFinished: () => void;
}) => {
  const keywordIds = selectedRows.rows.map(
    (row: any) => row.original.keywordId,
  );

  const {
    deleteKeywords,
    confirmDelete,
    cancelDelete,
    isDialogOpen,
    setIsDialogOpen,
  } = useKeywords();

  const handleDeleteClick = () => {
    setIsDialogOpen(true);
    console.log("keywordIds", keywordIds);
    deleteKeywords(keywordIds);
  };

  return (
    <DropdownMenu onOpenChange={(isOpen) => isOpen && handleDeleteClick()}>
      <DropdownMenuTrigger asChild>
        <OutlinedTextButton
          outlineClassName="outline-red-50 bg-red-50"
          size="smD"
          className="ml-1"
          buttonClassName="px-2"
        >
          <TrashIcon className="w-5 h-5 text-red-500" />
        </OutlinedTextButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2">
        <DropdownMenuGroup className="text-sm leading-5 font-normal">
          <DropdownMenuItemEmpty className="flex gap-2">
            <button
              onClick={() => {
                confirmDelete();
                onActionFinished();
              }}
              className=" text-red-500 border border-red-500 px-[12px] py-[6px] rounded-md"
            >
              Delete Keywords
            </button>
            <button
              onClick={() => {
                cancelDelete();
                onActionFinished();
              }}
              className=" text-gray-500 px-[12px] py-[6px] rounded-md"
            >
              Cancel
            </button>
          </DropdownMenuItemEmpty>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeleteKeywordSelectedRowButton;