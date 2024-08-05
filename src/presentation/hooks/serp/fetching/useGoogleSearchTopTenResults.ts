'use client'

import { useQuery } from "@tanstack/react-query";
import { getGoogleSearchTopTenSerpResults } from "@/application/useCases/googleSearchLatestSerpResults/getGoogleSearchTopTenSerpResults";

function useGoogleSearchTopTenResults(keywordId: string) {
  return useQuery({
    queryKey: ['googleSearchTopTenResults', keywordId],
    queryFn: () => getGoogleSearchTopTenSerpResults(keywordId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export default useGoogleSearchTopTenResults;