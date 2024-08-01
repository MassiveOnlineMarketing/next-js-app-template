'use client';

import { useEffect, useState } from "react";
import { useToast } from "@/presentation/components/toast/use-toast";

import { GoogleSearchConsoleKeywordDetailsData } from "@/domain/models/googleSearchConsoleApi";

import { fetchGoogleSearchConsoleKeywordDetailsData } from "@/application/useCases/googleSearchConsoleApi/fetchGoogleSearchConsoleKeywordDetailsData";

function useKeywordDetailsSearchConsoleData(keywordName: string, websiteId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchConsoleData, setSearchConsoleData] = useState<GoogleSearchConsoleKeywordDetailsData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setSearchConsoleData(null);
    fetchSearchConsoleData();
  }, [keywordName]);

  const fetchSearchConsoleData = async () => {
    try {
      const res = await fetchGoogleSearchConsoleKeywordDetailsData(keywordName, websiteId)
      // TODO: remove console.log
      console.log('fetchSearchConsoleData', res);
      if (res.success && res.data) {
        setSearchConsoleData(res.data);
      } else {
        showErrorToast(res.error || 'Please check your gsc intergration');
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Please check your gsc intergration');
    } finally {
      setIsLoading(false);
    }
  }

  const showErrorToast = (message: string) => {
    toast({
      description: `Error fetching gsc data: ${message}`,
      variant: 'destructive',
    });
  };


  return { isLoading, searchConsoleData };
}

export default useKeywordDetailsSearchConsoleData;