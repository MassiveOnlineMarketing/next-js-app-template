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
    <div className="w-full pr-6">
      <div className="px-6 py-4 w-full dark:bg-dark-bg-light lg:rounded-t-3xl dark:border-x dark:border-t dark:border-dark-stroke flex justify-between items-center">
        <p className="inline-flex items-center gap-4 text-sm leading-5 font-base text-gray-400 dark:text-[#DFE5FA]/35">
          <Link href="app/">Home</Link>
          <span><ChevronRightIcon className="w-4 h-4" /></span>
          <span>Keyword Tracker</span>
          {campaignName && (
            <>
              <span><ChevronRightIcon className="w-4 h-4" /></span>
              <span className="text-gray-500">{campaignName}</span>
            </>
          )}
        </p>
        <div className="flex gap-20">
          <div className=" h-fit py-2 px-3 rounded-[4px] dark:bg-dark-bg-light">
          <UserCredits />
          </div>
        <BackAndForwardButtons />
        </div>
      </div>
    </div>
  );
};

export default BreadCrumbsSearchKeywords;
