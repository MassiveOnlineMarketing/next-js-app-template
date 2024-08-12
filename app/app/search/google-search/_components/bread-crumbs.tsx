import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React from "react";

const BreadCrumbsSearchKeywords = ({
  campaignName,
}: {
  campaignName?: string;
}) => {

  return (
    <div className="p-6 w-full  dark:bg-[rgba(223,229,250,0.02)]">
      <p className="inline-flex items-center gap-4 text-sm leading-5 font-base text-gray-400 dark:text-[#DFE5FA]/35">
        <span>Home</span>
        <span><ChevronRightIcon className="w-4 h-4" /></span>
        <Link href="app/search">Search</Link>
        <span><ChevronRightIcon className="w-4 h-4" /></span>
        <span>Google Search Campaign</span>
        {campaignName && (
          <>
            <span><ChevronRightIcon className="w-4 h-4" /></span>
            <span className="text-gray-500">{campaignName}</span>
          </>
        )}
      </p>
    </div>
  );
};

export default BreadCrumbsSearchKeywords;
