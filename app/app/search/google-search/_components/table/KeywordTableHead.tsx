"use client";

import React, { useState } from "react";

import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";

import GoogleSearchProjectFormDialog from "@/presentation/components/google-search-campaign/google-search-campaign-form-dialog";

// assets
import { Cog8ToothIcon } from "@heroicons/react/24/outline";

const KeywordTableHead = () => {
  const [open, setOpen] = useState(false);
  const currentGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore(
    (state) => state.campaignDetails,
  );

  return (
    <div className="w-full my-6 mb-6 bg-white rounded-2xl">
      <div className="p-8">
        <div className="flex items-center border-b border-gray-200">
          <p className="mb-2 text-2xl leading-8 font-medium text-gray-800">
            Keyword Tracker
          </p>
          <button className="ml-auto" onClick={() => setOpen(true)}>
            <Cog8ToothIcon className=" h-6 w-6 text-gray-400" />
          </button>

          <GoogleSearchProjectFormDialog
            open={open}
            setOpen={setOpen}
            googleSearchCampaign={currentGoogleSearchCampaign}
          />
        </div>
      </div>
    </div>
  );
};

export default KeywordTableHead;
