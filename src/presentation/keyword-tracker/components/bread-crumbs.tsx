import React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import BackAndForwardButtons from "@/presentation/components/dashboard/BackAndForwardButtons";
import UserCredits from "./UserCredits";


const BreadCrumbsSearchKeywords = ({
  campaignName,
}: {
  campaignName?: string;
}) => {

  return (
    <div className="sticky z-10 top-0 px-6 py-4 w-full bg-white dark:bg-dark-bg-light rounded-t-xl border-b border-light-stroke dark:border-dark-stroke flex justify-between items-center">
      <p className="inline-flex items-center gap-4 text-sm leading-5 font-base text-light-text-light dark:text-dark-text-dark">
        <Link href="/app/">Home</Link>
        <span><ChevronRightIcon className="w-4 h-4" /></span>
        <span>Keyword Tracker</span>
        {campaignName && (
          <>
            <span><ChevronRightIcon className="w-4 h-4" /></span>
            <span className="text-[#2C3462] dark:text-gray-500">{campaignName}</span>
          </>
        )}
      </p>
      <BackAndForwardButtons />
    </div>
  );
};

export default BreadCrumbsSearchKeywords;
