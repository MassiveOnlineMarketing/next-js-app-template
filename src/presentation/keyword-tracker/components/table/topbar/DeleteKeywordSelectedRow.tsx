import React from "react";

import useKeywordOpperations from "@/presentation/keyword-tracker/hooks/useKeywordOpperations";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuItemEmpty } from "@/presentation/components/ui/dropdown-menu";

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
      <DropdownMenuTrigger className="ml-1 h-10 w-10 p-[2px] rounded-[10px] bg-white dark:bg-dark-bg-light">
        <div className="rounded-lg border w-full h-full  border-gray-200 dark:border-dark-stroke flex items-center justify-center hover:text-red-500 hover:border-red-500 text-gray-500 dark:text-dark-text-dark ">
          <TrashIcon className="h-5 w-5 " />
        </div>

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