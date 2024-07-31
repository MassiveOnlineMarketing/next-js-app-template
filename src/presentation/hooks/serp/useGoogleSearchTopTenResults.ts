'use client'

import { useEffect, useState } from "react";
import { useToast } from "@/presentation/components/toast/use-toast";

import { GoogleSearchSerpResult } from "@prisma/client";

import { getGoogleSearchTopTenSerpResults } from "@/application/useCases/googleSearchLatestSerpResults/getGoogleSearchTopTenSerpResults";


function useGoogleSearchTopTenResults(keywordId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [topTenSerpResults, setTopTenSerpResults] = useState<GoogleSearchSerpResult[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setTopTenSerpResults([]);
    fetchTopTenResults();
  }, [keywordId]);

  const fetchTopTenResults = async () => {
    try {
      const res = await getGoogleSearchTopTenSerpResults(keywordId);
      // TODO: remove console.log
      console.log('fetchTopTenResults', res);
      if (res.success && res.data) {
        setTopTenSerpResults(res.data);
      } else {
        showErrorToast(res.error || 'Please try again later');
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Please try again later');
    } finally {
      setIsLoading(false);
    }
  }

  const showErrorToast = (message: string) => {
    toast({
      description: `Error fetching top ten serp results: ${message}`,
      variant: 'destructive',
    });
  };

  return { isLoading, topTenSerpResults }; 
}

export default useGoogleSearchTopTenResults;