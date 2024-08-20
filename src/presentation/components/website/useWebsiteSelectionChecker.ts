'use client';

import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import { useWebsiteDetailsStore } from "@/presentation/stores/website-details-store";
import { useEffect } from "react";

function useWebsiteSelectionChecker() {
  const websiteDetails = useWebsiteDetailsStore(state => state.websiteDetails);
  const googleSearchCampaignDetails = useGoogleSearchCampaignDetailsStore(state => state.campaignDetails);

  useEffect(() => {
    console.log('🅿️ Running use effect');
    if (websiteDetails && googleSearchCampaignDetails) {
      if (websiteDetails.id === googleSearchCampaignDetails.websiteId) {
        console.log('🅿️ selected website and selected google search campaign match');
      } else {
        console.log('🅿️ selected website and selected google search campaign do not match');
        useGoogleSearchCampaignDetailsStore.getState().deSelectCampaign();
      }      
    }
  }, [websiteDetails, googleSearchCampaignDetails]);

}


export default useWebsiteSelectionChecker;