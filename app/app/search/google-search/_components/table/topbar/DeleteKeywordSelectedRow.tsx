import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItemEmpty,
} from "@/presentation/components/ui/dropdown-menu";
import { OutlinedTextButton } from "@/presentation/components/ui/text-button";
import { TrashIcon } from "@heroicons/react/24/outline";
import useKeywordOpperations from "@/presentation/hooks/serp/useKeywordOpperations";

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
    handleDeleteKeyword,
    confirmDelete,
    cancelDelete,
    setIsDeleteDialogOpen,
  } = useKeywordOpperations();

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
    handleDeleteKeyword(keywordIds);
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