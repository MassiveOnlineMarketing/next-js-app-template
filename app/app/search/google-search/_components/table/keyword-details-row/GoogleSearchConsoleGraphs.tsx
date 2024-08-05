'use client';

import React, { useEffect } from 'react'
import { useToast } from '@/presentation/components/toast/use-toast';

import useKeywordDetailsSearchConsoleData from '@/presentation/hooks/serp/fetching/useKeywordDetailsSearchConsoleData';
import useGoogleToken from '@/presentation/hooks/useGoogleRefreshToken';

import SearchConsoleLoading from './google-search-console-data/loading';
import SearchConsoleNotAuthorized from './google-search-console-data/not-connected';
import SearchConsoleChart from './google-search-console-data/graphs';


const GoogleSearchConsoleGraphs = ({ keywordName, websiteId }: {
  keywordName: string,
  websiteId: string
}) => {
  const { toast } = useToast();
  const { hasAccess } = useGoogleToken('search-console');
  const { isLoading, data: searchConsoleKeywordDetails } = useKeywordDetailsSearchConsoleData(keywordName, websiteId, hasAccess);

  useEffect(() => {
    if (searchConsoleKeywordDetails?.error) {
      toast({
        icon: 'destructive',
        variant: 'destructive',
        description: searchConsoleKeywordDetails?.error,
      })
    }
  }, [keywordName])

  const chartConfigs = [
    {
      title: "Clicks",
      borderColor: "blue-100",
      backgroundGradientColor: "Eff6FF",
    },
    {
      title: "CTR",
      borderColor: "green-100",
      backgroundGradientColor: "ECFDF5",
    },
    {
      title: "Position",
      borderColor: "yellow-100",
      backgroundGradientColor: "FFFBEB",
    },
    {
      title: "Impressions",
      borderColor: "primay-100",
      backgroundGradientColor: "F8F8FF",
    }
  ]


  if (!hasAccess) {
    return (
      <div className="flex gap-4 w-full h-[152px]">
        {chartConfigs.map((config, index) => (
          <SearchConsoleNotAuthorized
            key={index}
            title={config.title}
          />
        ))}
      </div>)
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex gap-4 w-full h-[152px]">
          {chartConfigs.map((config, index) => (
            <SearchConsoleLoading
              key={index}
              title={config.title}
              borderColor={config.borderColor}
              backgroundGradientColor={config.backgroundGradientColor}
            />
          ))}
        </div>
      </div>
    )
  }

  // TODO: Add error handling
  if (!searchConsoleKeywordDetails?.data) { 
    return <div>No data</div>
  }

  
  return (
    <SearchConsoleChart searchConsoleData={searchConsoleKeywordDetails.data} />
  )
}



export default GoogleSearchConsoleGraphs