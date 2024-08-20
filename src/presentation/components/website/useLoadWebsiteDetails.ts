'use client';

import { useEffect, useState, useCallback, use } from "react";
import { useCurrentUser } from "@/presentation/auth/hooks/user-current-user";
import { useWebsiteDetailsStore } from "@/presentation/stores/website-details-store";
import { fetchWebsitesWithGoogleSearchCampaigns } from "./actions";
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { Website } from "@prisma/client";

export interface WebsitesArrayType extends Website {
  googleSearchCampaign: GoogleSearchCampaign[];
}

/**
 * Custom hook for loading website details.
 * ! Only use this hook in one place in the application.
 * 
 * @returns An object containing the loading state and website details.
 */
function useLoadWebsiteDetails() {
  const [isLoading, setIsLoading] = useState(true);
  const [websiteWithGoogleSearchCampaigns, setWebsiteWithGoogleSearchCampaigns] = useState<WebsitesArrayType[] | []>([]);
  
  const setSelectedWebsite = useWebsiteDetailsStore((state) => state.setWebsiteDetails);
  
  const user = useCurrentUser();

  const fetchWebsites = useCallback(async () => {
    if (!user?.id) {
      console.log('🅱️ no user id');
      return;
    }
    console.log('🅱️ getting google search campaigns');
    const searchProjects = await fetchWebsitesWithGoogleSearchCampaigns(user.id);
    setWebsiteWithGoogleSearchCampaigns(searchProjects || []);
  }, [user?.id]);


  const onMountFunction = useCallback(async () => {
    try {
      console.log('🅱️ on mount function');
      setIsLoading(true);

      const sessionDetails = sessionStorage.getItem(`websiteDetails-${user?.id}`);

      if (sessionDetails) {
        if (!user?.id) {
          console.log('🅱️ Cannot get session storage, no user id');
          return;
        }
        console.log('🅱️ setting website details from session storage');
        setSelectedWebsite(JSON.parse(sessionDetails), user?.id);
        await fetchWebsites();
      } else {
        console.log('🅱️ no session details, setting website details from data');
        await fetchWebsites();
      }
    } catch (error) {
      console.error('Error in onMountFunction:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWebsites, setSelectedWebsite, user?.id]);

  useEffect(() => {
    onMountFunction();
  }, [onMountFunction]);


  return { isLoading, websiteWithGoogleSearchCampaigns };
}

export default useLoadWebsiteDetails;