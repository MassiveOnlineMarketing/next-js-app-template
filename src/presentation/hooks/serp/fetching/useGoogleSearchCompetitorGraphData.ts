'use client';

import { useQuery } from "@tanstack/react-query";
import { getGoogleSearchCompetitorGraphData } from "@/application/useCases/googleSearchLatestSerpResults/getGoogleSearchCompetitorGraphData";


function useGoogleSearchCompetitorGraphData(keywordId: string) {
  return useQuery({
    queryKey: ['googleSearchCompetitorGraphData', keywordId],
    queryFn: () => getGoogleSearchCompetitorGraphData(keywordId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export default useGoogleSearchCompetitorGraphData;