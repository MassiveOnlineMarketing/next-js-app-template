'use client';

import { useQuery } from "@tanstack/react-query";
import { fetchGoogleSearchConsoleKeywordDetailsData } from "@/application/useCases/googleSearchConsoleApi/fetchGoogleSearchConsoleKeywordDetailsData";

function useKeywordDetailsSearchConsoleData(keywordName: string, websiteId: string, hasAcces: boolean) {
  return useQuery({
    queryKey: ['googleSearchConsoleKeywordDetailsData', keywordName],
    queryFn: () => {
      if (!hasAcces) {
        return Promise.reject(new Error('No access'));
      }
      return fetchGoogleSearchConsoleKeywordDetailsData(keywordName, websiteId);
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: hasAcces, // This will prevent the query from running if hasAcces is false
  });
}

export default useKeywordDetailsSearchConsoleData;