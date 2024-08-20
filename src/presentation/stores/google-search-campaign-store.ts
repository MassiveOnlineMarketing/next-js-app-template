'use client';

// External dependencies
import { create } from "zustand";

// Domain
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { getGoogleSearchCampaignById } from "@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignById";

export type GoogleSearchCampaignDetailsActions = {
  setCampaignDetails: (campaignDetails: GoogleSearchCampaign) => void;
  setCampaignDetailsById: (campaignId: string) => void;
  deSelectCampaign: () => void;
};

export type CampaignDetailsState = {
  campaignDetails: GoogleSearchCampaign | null;
};

export type GoogleSearchCampaignDetailsStore = CampaignDetailsState &
  GoogleSearchCampaignDetailsActions;

export const useGoogleSearchCampaignDetailsStore = create<GoogleSearchCampaignDetailsStore>((set, get) => ({
  campaignDetails: null,

  setCampaignDetails: (campaignDetails: GoogleSearchCampaign | null) => {
    set({
      campaignDetails: campaignDetails,
    });
  },
  setCampaignDetailsById: async (campaignId: string) => {
    const currentCampaignId = get().campaignDetails?.id;
    if (currentCampaignId === campaignId) {
      return;
    }
    
    const campaign = await getGoogleSearchCampaignById(campaignId);
    if (campaign.data) {
      if (!campaign.data) {
        console.log('campaing needs setting up')
        return;
      }

      set({
        campaignDetails: campaign.data,
      })
    }
  },
  deSelectCampaign: () => {
    set({
      campaignDetails: null,
    });
  }
}));
