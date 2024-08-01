'use client';

import { FormattedCompetitorsDataItem, getGoogleSearchCompetitorGraphData } from "@/application/useCases/googleSearchLatestSerpResults/getGoogleSearchCompetitorGraphData";
import { useToast } from "@/presentation/components/toast/use-toast";
import { useEffect, useState } from "react";

function useGoogleSearchCompetitorGraphData(keywordId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [competitorGraphData, setCompetitorGraphData] = useState<FormattedCompetitorsDataItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setCompetitorGraphData([]);
    fetchCompetitorGraphData();
  }, []);

  const fetchCompetitorGraphData = async () => {
    try {
      const res = await getGoogleSearchCompetitorGraphData(keywordId);
      // TODO: remove console.log
      console.log('fetchCompetitorGraphData', res);
      if (res.success && res.data) {
        setCompetitorGraphData(res.data);
      } else {
        showErrorToast(res.error || 'Please try again later');
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Please try again later');
    }
  }

  const showErrorToast = (message: string) => {
    toast({
      description: `Error fetching competitor graph data: ${message}`,
      variant: 'destructive',
    });
  };
  
  return { isLoading, competitorGraphData };
}

export default useGoogleSearchCompetitorGraphData;