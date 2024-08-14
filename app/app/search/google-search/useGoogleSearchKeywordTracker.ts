'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import { useGoogleSearchKeywordResultStore } from "@/presentation/stores/google-search-keyword-result-store";

import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

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