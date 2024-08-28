'use client';

import { useQuery } from "@tanstack/react-query";
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import axios from "axios";

function useKeywordDetailsSearchConsoleData(keywordName: string, googleSearchCampaign: GoogleSearchCampaign, hasAcces: boolean, refreshToken: string | null, gscUrl: string | null | undefined) {
  return useQuery({
    queryKey: ['googleSearchConsoleKeywordDetailsData', keywordName],
    queryFn: async () => {
      if (!hasAcces) {
        return Promise.reject(new Error('No access'));
      }
      if (!gscUrl || gscUrl === 'noWebsite') {
        return Promise.reject(new Error('No GSC URL'));
      }
      if (!refreshToken) {
        return Promise.reject(new Error('No refresh token'));
      }
      const encodedKeyword = encodeURIComponent(keywordName);

      try {
        const url = `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/api/keyword_data?keyword=${encodedKeyword}&site_url=${gscUrl}&refresh_token=${refreshToken}&country_code=${googleSearchCampaign.country}`;
        console.log('url',url);
        const res = await axios(url);
        console.log('res',res);
  
        return res.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: hasAcces, // This will prevent the query from running if hasAcces is false
  });
}

export default useKeywordDetailsSearchConsoleData;