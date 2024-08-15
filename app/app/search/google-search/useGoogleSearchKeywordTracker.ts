'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import { useGoogleSearchKeywordResultStore } from "@/presentation/stores/google-search-keyword-result-store";

import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";
import { useQuery } from "@tanstack/react-query";
import { getGoogleSearchLatestSerpResults } from "@/application/useCases/googleSearchLatestSerpResults/getGoogleSearchLatestSerpResults";

/**
 * Hook for the Google Search Keyword Tracker.
 * Sets the initial state of the keyword operations.
 * Automatically fetches the latest keyword results from Google search using the GoogleSearchKeywordResultStore.
 * 
 * @returns An object containing the function to set the new state of the keyword results.
 */
export function useGoogleSearchKeywordTracker() {
  const googleSearchCampaign = useGoogleSearchCampaignDetailsStore((state) => state.campaignDetails);

  const resetResults = useGoogleSearchKeywordResultStore((state) => state.resetKeywordResults);
  const resetSelectedTags = useGoogleSearchKeywordResultStore((state) => state.resetSelectedTags);
  const setKeywordResults = useGoogleSearchKeywordResultStore((state) => state.setKeywordResults);

  const router = useRouter();

  useEffect(() => {
    if (!googleSearchCampaign) return;
    router.push(`/app/search/google-search/${googleSearchCampaign.id}`);
  }, [googleSearchCampaign]);

  useQuery({
    queryKey: ['googleSearchResults', googleSearchCampaign?.id],
    queryFn: async () => {
      if (!googleSearchCampaign) return [];
      const response = await getGoogleSearchLatestSerpResults(googleSearchCampaign.id);

      const latestSerpResults = response?.data || [];
      if (!latestSerpResults.length) return [];
      const filteredSerpResults = latestSerpResults.filter(result => result !== null);
      console.log('🅱️ setting new filteredSerpResults after campaing switch');

      setNewSerpResultState(filteredSerpResults);
      return filteredSerpResults;
    },
    enabled: !!googleSearchCampaign, // This ensures the query only runs when googleSearchCampaign is defined
  });


  /**
 * Sets the initial state of the keyword operations.
 * 
 * @param serpResults - The latest keyword results from Google search.
 */
  const setNewSerpResultState = (serpResults: GoogleSearchLatestKeywordResult[]) => {
    resetResults();
    resetSelectedTags();

    console.log('🟢 setting new keyword results');
    console.log('googleSearchLatestSerpResult', serpResults);
    setKeywordResults(serpResults);;
  }

  return { setNewSerpResultState };
}

export default useGoogleSearchKeywordTracker;