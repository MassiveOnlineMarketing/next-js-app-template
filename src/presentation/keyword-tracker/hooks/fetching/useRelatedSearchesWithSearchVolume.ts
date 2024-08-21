'use client';

import { getGoogleSearchKeywordMetrics } from "@/application/useCases/googleAdsApi/getGoogleSearchKeywordMetrics";
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { useQuery } from "@tanstack/react-query";

function useRelatedSearchesWithSearchVolume(keyword: string[], campaign: GoogleSearchCampaign | null) {
  return useQuery({
    queryKey: ['relatedSearchesWithSearchVolume', keyword],
    queryFn: () => {
      return getGoogleSearchKeywordMetrics(keyword, campaign);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export default useRelatedSearchesWithSearchVolume;