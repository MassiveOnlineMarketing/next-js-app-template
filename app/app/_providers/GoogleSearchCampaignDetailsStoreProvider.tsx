'use client';

import { useEffect } from "react";

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";

export const GoogleSearchCampaignDetailsStoreProvider = ({ googleSearchCampaignDetails }: {googleSearchCampaignDetails: GoogleSearchCampaign}) => {
    const setGoogleSearchCampaignDetails = useGoogleSearchCampaignDetailsStore((state) => state.setCampaignDetails);
    
    useEffect(() => {
        console.log('🟢 setting new campaign details');
        setGoogleSearchCampaignDetails(googleSearchCampaignDetails);
    }, []);

    return null;
}