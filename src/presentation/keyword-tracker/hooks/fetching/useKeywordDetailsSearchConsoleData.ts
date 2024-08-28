'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchGoogleSearchConsoleKeywordDetailsData } from "@/application/useCases/googleSearchConsoleApi/fetchGoogleSearchConsoleKeywordDetailsData";
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";

function useKeywordDetailsSearchConsoleData(keywordName: string, websiteId: string, googleSearchCampaign: GoogleSearchCampaign, hasAcces: boolean, gscUrl: string | null | undefined) {
  return useQuery({
    queryKey: ['googleSearchConsoleKeywordDetailsData', keywordName],
    queryFn: () => {
      if (!hasAcces) {
        return Promise.reject(new Error('No access'));
      }
      if (!gscUrl || gscUrl === 'noWebsite') {
        return Promise.reject(new Error('No GSC URL'));
      }
      return fetchGoogleSearchConsoleKeywordDetailsData(keywordName, websiteId, googleSearchCampaign.country);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: hasAcces, // This will prevent the query from running if hasAcces is false
  });
}

export default useKeywordDetailsSearchConsoleData;