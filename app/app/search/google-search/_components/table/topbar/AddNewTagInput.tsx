"use client";

import React, { useState } from "react";
import useGoogleSearchKeywordTagOpperations from "@/presentation/hooks/serp/useGoogleSearchKeywordTagOpperations";
import { cn } from "@/presentation/lib/utils";

const AddNewTagInput = ({
  selectedRows,
  onActionFinished,
}: {
  selectedRows: any;
  onActionFinished: () => void;
}) => {
  const keywordIds = selectedRows.rows.map(
    (row: any) => row.original.keywordId,
  );

  const [inputValue, setInputValue] = useState("");
  const { createNewTag } = useGoogleSearchKeywordTagOpperations();

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const res = await createNewTag(inputValue, keywordIds);
    if (res) {
      onActionFinished();
      setInputValue("");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg gap-[6px] border border-neutral-200 bg-white  dark:border-neutral-800 dark:bg-neutral-950">
      <form onSubmit={handleSubmit}>
        <div className=" text-sm font-medium leading-5">
        <input
          className=" placeholder-gray-500 m-1 pl-[12px] pr-[20px] py-[8px] w-[204px]"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key.length === 1) {
              e.stopPropagation();
            }}
          }
          placeholder="Add new tag"
        />
        </div>
        <button
          className={cn(
            'text-sm font-medium  leading-5 text-gray-800',
            "px-[16px] py-[8px] w-full",
            'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50'
          )}
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddNewTagInput;