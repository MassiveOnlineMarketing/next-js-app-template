'use client';

import { create } from "zustand";

export type GoogleSearchCampaignDetailsActions = {
  setCampaignDetails: (campaignDetails: GoogleSearchCampaign) => void;
};

export type GoogleSearchCampaign = {
  id: string;
  userId: string;
  projectName: string;
  domainUrl: string;
  language: string;
  country: string;
  gscUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  websiteId: string;
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
  }));
