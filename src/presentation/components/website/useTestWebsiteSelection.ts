'use client';

import React, { useEffect, useState } from "react";

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { Website } from "@prisma/client";

import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import { useWebsiteDetailsStore } from "@/presentation/stores/website-details-store";
import { useCurrentUser } from "@/presentation/auth/hooks/user-current-user";

import { getWebsiteById } from "@/application/useCases/website/getWebsiteById";
import { getGoogleSearchCampaignById } from "@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignById";
import { fetchWebsitesWithGoogleSearchCampaigns } from "./actions";




export interface WebsitesArrayType extends Website{
  googleSearchCampaign: GoogleSearchCampaign[];
} 

/**
 * Hook for selecting a website and google search campaign
 * Handles the initial website state with session storage.
 * Provides 
 * 
 * @returns {isLoading, googleSearchCampaigns, setWebsiteById, setGoogleSearchCampaignById}
 **/
const useTestWebsiteSelection = () => {
  const websites = useWebsiteDetailsStore((state) => state.websites);
  const currentWebsite = useWebsiteDetailsStore((state) => state.websiteDetails);


  const [websiteWithGoogleSearchCampaigns, setWebsiteWithGoogleSearchCampaigns] = useState<WebsitesArrayType[] | []>([]);
  const setSelectedWebsite = useWebsiteDetailsStore((state) => state.setWebsiteDetails);
  const setSelectedGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore((state) => state.setCampaignDetails);
  const clearSelectedGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore((state) => state.deSelectCampaign);

  const user = useCurrentUser();

  // load website details on mount
  useEffect(() => {
    console.log('🅱️ getting website details, safe')
    const sessionDetails = sessionStorage.getItem("websiteDetails");
    if (sessionDetails && !currentWebsite) {
      setSelectedWebsite(JSON.parse(sessionDetails));
    }
  }, []);


  const [isLoading, setIsLoading] = useState(true);
  // load website details on mount
  useEffect(() => {
    if (websites !== null) {
      setIsLoading(false);
    }
  }, [websites])

  // Set the google search campaigns for the current website
  useEffect(() => {
    fetchProjects();
  }, [currentWebsite]);

  const fetchProjects = async () => {
    if (!currentWebsite || !user?.id) return;
    console.log('🅱️ getting google search campaigns')
    const searchProjects = await fetchWebsitesWithGoogleSearchCampaigns(user?.id);
    setWebsiteWithGoogleSearchCampaigns(searchProjects);
  };

  const setWebsiteById = async (id: string) => {
    if (currentWebsite?.id === id) return;
    console.log('🅱️ setting website by id', id)
    const website = await getWebsiteById(id);
    if (website.data){
      setSelectedWebsite(website.data);
      clearSelectedGoogleSearchCampaign();
    }
  }

  const setGoogleSearchCampaignById = async (id: string) => {
    console.log('🅱️ setting google search campaign by id', id)
    const campaign = await getGoogleSearchCampaignById(id);
    if (campaign.data){
      if (!campaign.data) {
        console.log('campaing needs setting up')
        return;
      }
        
      setSelectedGoogleSearchCampaign(campaign.data);
    }
  }

  return { isLoading, websiteWithGoogleSearchCampaigns, setWebsiteById, setGoogleSearchCampaignById }
}

export default useTestWebsiteSelection;