'use client';

// External dependencies
import { create } from "zustand";

// Domain
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";

export type GoogleSearchCampaignDetailsActions = {
  setCampaignDetails: (campaignDetails: GoogleSearchCampaign) => void;
  deSelectCampaign: () => void;
};

export type CampaignDetailsState = {
  campaignDetails: GoogleSearchCampaign | null;
};

export type GoogleSearchCampaignDetailsStore = CampaignDetailsState &
  GoogleSearchCampaignDetailsActions;

export const useGoogleSearchCampaignDetailsStore =
  create<GoogleSearchCampaignDetailsStore>((set) => ({
    campaignDetails: null,

    setCampaignDetails: (campaignDetails: GoogleSearchCampaign | null) => {
      set({
        campaignDetails: campaignDetails,
      });
    },
    deSelectCampaign: () => {
      set({
        campaignDetails: null,
      });
    }
  }));
