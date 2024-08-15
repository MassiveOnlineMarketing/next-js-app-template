'use client'

import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React from "react";

const BreadCrumbsSearchKeywords = () => {

  const selectedGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore((state) => state.campaignDetails);

  return (
    <div className="p-6 w-full  dark:bg-dark-bg-light">
      <p className="inline-flex items-center gap-4 text-sm leading-5 font-base text-gray-400 dark:text-[#DFE5FA]/35">
        <span>Home</span>
        <span><ChevronRightIcon className="w-4 h-4" /></span>
        <Link href="app/search">Search</Link>
        <span><ChevronRightIcon className="w-4 h-4" /></span>
        <span>Google Search Campaign</span>
        {selectedGoogleSearchCampaign?.campaignName && (
          <>
            <span><ChevronRightIcon className="w-4 h-4" /></span>
            <span className="text-gray-500">{selectedGoogleSearchCampaign.campaignName}</span>
          </>
        )}
      </p>
    </div>
  );
};

export default BreadCrumbsSearchKeywords;
