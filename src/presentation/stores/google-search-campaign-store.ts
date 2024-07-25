'use client';

// External dependencies
import { create } from "zustand";

// Domain
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";

export type GoogleSearchCampaignDetailsActions = {
  setCampaignDetails: (campaignDetails: GoogleSearchCampaign) => void;
  setCampaigns: (campaigns: GoogleSearchCampaign[]) => void;
  addCampaignToList: (campaign: GoogleSearchCampaign) => void;
  updateCampaign: (campaign: GoogleSearchCampaign) => void;
  removeCampaignFromList: (campaignId: string) => void;
};

export type CampaignDetailsState = {
  campaignDetails: GoogleSearchCampaign | null;
  campaigns: GoogleSearchCampaign[];
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

    campaigns: [],
    setCampaigns: (campaigns: GoogleSearchCampaign[]) => {
      set({
        campaigns: campaigns,
      });
    },
    addCampaignToList: (campaign: GoogleSearchCampaign) => {
      set((state) => {
        return {
          campaigns: [...state.campaigns, campaign],
        };
      });
    },
    updateCampaign: (campaign: GoogleSearchCampaign) => {
      set((state) => {
        const updatedCampaigns = state.campaigns.map((c) =>
          c.id === campaign.id ? campaign : c
        );
        return {
          campaigns: updatedCampaigns,
        };
      });
    },
    removeCampaignFromList: (campaignId: string) => {
      set((state) => {
        const updatedCampaigns = state.campaigns.filter((c) => c.id !== campaignId);
        return {
          campaigns: updatedCampaigns,
        };
      });
    },

  }));
