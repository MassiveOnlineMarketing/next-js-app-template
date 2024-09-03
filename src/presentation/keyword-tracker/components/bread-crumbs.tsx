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
      <div className="px-6 py-4 w-full dark:bg-dark-bg-light lg:rounded-t-3xl border border-light-stroke dark:border-dark-stroke flex justify-between items-center">
        <p className="inline-flex items-center gap-4 text-sm leading-5 font-base text-light-text-light dark:text-dark-text-dark">
          <Link href="app/">Home</Link>
          <span><ChevronRightIcon className="w-4 h-4" /></span>
          <span>Keyword Tracker</span>
          {campaignName && (
            <>
              <span><ChevronRightIcon className="w-4 h-4" /></span>
              <span className="text-light-text-dark dark:text-gray-500">{campaignName}</span>
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
