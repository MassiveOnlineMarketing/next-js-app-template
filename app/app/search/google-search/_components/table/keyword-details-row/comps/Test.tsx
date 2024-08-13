'use client'

import React, { useEffect } from 'react'
import Link from "next/link";
import { useToast } from '@/presentation/components/toast/use-toast';
import useKeywordDetailsSearchConsoleData from '@/presentation/hooks/serp/fetching/useKeywordDetailsSearchConsoleData';
import useGoogleToken from '@/presentation/hooks/useGoogleRefreshToken';

import { Card, CardHeader } from '../GoogleSearchConsoleGraphCard';
import GoogleSearchConsoleChart, { GoogleSearchConsoleChartData } from '../google-search-console-data/GraphsN';
import { useWebsiteDetailsStore } from '@/presentation/stores/website-details-store';
import { LoadingSpinner } from '@/presentation/components/ui/loading-spinner';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/presentation/components/ui/tooltip";
import { LockClosedIcon } from "@heroicons/react/20/solid";

const Test = ({ keywordName, websiteId }: {
  keywordName: string,
  websiteId: string
}) => {
  const { toast } = useToast();
  const { hasAccess } = useGoogleToken('search-console');
  const website = useWebsiteDetailsStore(state => state.websiteDetails);
  const { isLoading, data: searchConsoleKeywordDetails } = useKeywordDetailsSearchConsoleData(keywordName, websiteId, hasAccess, website?.gscUrl);
  // console.log('gsc data', searchConsoleKeywordDetails);
  useEffect(() => {
    if (searchConsoleKeywordDetails?.error) {
      toast({
        icon: 'destructive',
        variant: 'destructive',
        description: searchConsoleKeywordDetails?.error,
      })
    }
  }, [keywordName])

  const mochChartConfig = generateChartConfig(MOCK_CHART_DATA);

  if (!hasAccess) {
    return (
      <div className='grid grid-cols-4 gap-6 pb-6'>
        {mochChartConfig.map((config) => (
          <Card key={config.title} >
            <CardHeader title={config.title} total={config.total} />
            <div className='h-[250px] relative'>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 flex flex-col justify-center gap-1 z-30 opacity-100">
                  <Tooltip>
                    <TooltipTrigger>
                      <LockClosedIcon className="w-8 h-8 text-gray-400 mx-auto" />
                    </TooltipTrigger>
                    <TooltipContent >
                      <Link
                        href="/app/settings/integrations"
                        className="text-primary-500 text-center"
                      >
                        Connect Search Console
                      </Link>
                    </TooltipContent>
                  </Tooltip>
              </div>
              <GoogleSearchConsoleChart
                data={MOCK_CHART_DATA}
                positionDomain={config.domain}
                dataKey={config.dataKey}
                color={config.color}
                title={config.title}
                interactive={false}
              />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (!website?.gscUrl || website?.gscUrl === 'noWebsite') {
    return (
      <div className='grid grid-cols-4 gap-6 pb-6'>
        {mochChartConfig.map((config) => (
          <Card key={config.title} >
            <CardHeader title={config.title} total={config.total} />
            <div className='h-[250px] relative'>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 flex flex-col justify-center gap-1 z-30 opacity-100">
                  <Tooltip>
                    <TooltipTrigger>
                      <LockClosedIcon className="w-8 h-8 text-gray-400 mx-auto" />
                    </TooltipTrigger>
                    <TooltipContent >
                        Add Google Search Console to your website
                    </TooltipContent>
                  </Tooltip>
              </div>
              <GoogleSearchConsoleChart
                data={MOCK_CHART_DATA}
                positionDomain={config.domain}
                dataKey={config.dataKey}
                color={config.color}
                title={config.title}
                interactive={false}
              />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  // TODO: Add card header loading
  if (isLoading) {
    return (
      <div>
        <div className='grid grid-cols-4 gap-6 pb-6'>
          {mochChartConfig.map((config) => (
            <Card key={config.title} >
              <CardHeader title={config.title} total={config.total} />
              <div className='h-[250px] flex items-center justify-center'>
                <LoadingSpinner />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // TODO: Add error handling
  if (!searchConsoleKeywordDetails?.data) {
    return <div>No data</div>
  }
  const data = Object.entries(searchConsoleKeywordDetails.data).map(([date, data]) => ({
    date,
    clicks: Number(data.clicks.toFixed(1)),
    ctr: Number(data.ctr.toFixed(1)),
    impressions: Number(data.impressions.toFixed(1)),
    position: Number(data.position.toFixed(1)),
  }));

  const chartConfig = generateChartConfig(data);
  console.log('chartConfig', chartConfig);

  return (
    <div className='grid grid-cols-4 gap-6 pb-6'>
      {chartConfig.map((config) => (
        <Card key={config.title} >
          <CardHeader title={config.title} total={config.total} />
          <div className='h-[250px]'>
            <GoogleSearchConsoleChart
              data={data}
              positionDomain={config.domain}
              dataKey={config.dataKey}
              color={config.color}
              title={config.title}
              reverse={config.reverse}
            />
          </div>
        </Card>
      ))}
    </div>
  )
}

/**
 * Generates the chart configuration based on the provided data.
 * 
 * @param data - The GoogleSearchConsoleChartData array used to generate the chart configuration.
 * @returns The chart configuration array.
 */
const generateChartConfig = (data: GoogleSearchConsoleChartData[]) => {
  const chartConfig = [
    {
      title: "Clicks",
      color: "#2563EB",
      dataKey: "clicks",
      domain: getChartDomain(data, 'clicks'),
      total: getTotals(data, 'clicks'),
      reverse: false
    },
    {
      title: "CTR",
      color: "#059669",
      dataKey: "ctr",
      domain: getChartDomain(data, 'ctr'),
      total: getCtrAverage(data, 'ctr'),
      reverse: false
    },
    {
      title: "Position",
      color: "#F59E0B",
      dataKey: "position",
      domain: getChartDomain(data, 'position', true),
      total: getPositionAverage(data, 'position'),
      reverse: true
    },
    {
      title: "Impressions",
      color: "#7857FE",
      dataKey: "impressions",
      domain: getChartDomain(data, 'impressions'),
      total: getTotals(data, 'impressions'),
      reverse: false
    }
  ]


  return chartConfig;
}

const getTotals = (data: GoogleSearchConsoleChartData[], key: keyof GoogleSearchConsoleChartData): number => {
  return data.reduce((acc, item) => acc + (item[key] as number), 0);
}

const getPositionAverage = (data: GoogleSearchConsoleChartData[], key: keyof GoogleSearchConsoleChartData): number => {
  return Math.round(getTotals(data, key) / data.length);
}

const getCtrAverage = (data: GoogleSearchConsoleChartData[], key: keyof GoogleSearchConsoleChartData): number => {
  return Number((getTotals(data, key) / data.length).toFixed(1));
}

const getChartDomain = (
  data: GoogleSearchConsoleChartData[], 
  key: keyof GoogleSearchConsoleChartData, 
  flipped: boolean = false
): [number, number] => {
  const values = data.map(item => item[key] as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const minPadding = 0.1;
  const bottomMultiplier = flipped ? 0.1 : 1;
  const topMultiplier = flipped ? 1 : 0.1;
  const bottomPadding = Math.max((max - min) * bottomMultiplier, minPadding);
  const topPadding = Math.max((max - min) * topMultiplier, minPadding);
  return [min - bottomPadding, max + topPadding];
}

const MOCK_CHART_DATA: GoogleSearchConsoleChartData[] = [
  {
    "date": "2024-08-03",
    "clicks": 16,
    "ctr": 0.47058823529411764,
    "impressions": 34,
    "position": 1.088235294117647
  },
  {
    "date": "2024-08-04",
    "clicks": 25,
    "ctr": 0.43103448275862066,
    "impressions": 58,
    "position": 1.1896551724137931
  },
  {
    "date": "2024-08-05",
    "clicks": 22,
    "ctr": 0.5116279069767442,
    "impressions": 43,
    "position": 1.0232558139534884
  },
  {
    "date": "2024-08-06",
    "clicks": 12,
    "ctr": 0.2608695652173913,
    "impressions": 46,
    "position": 1.1304347826086956
  },
  {
    "date": "2024-08-07",
    "clicks": 21,
    "ctr": 0.5,
    "impressions": 42,
    "position": 1.0238095238095237
  },
  {
    "date": "2024-08-08",
    "clicks": 20,
    "ctr": 0.5,
    "impressions": 40,
    "position": 1.075
  },
  {
    "date": "2024-08-09",
    "clicks": 16,
    "ctr": 0.41025641025641024,
    "impressions": 39,
    "position": 1.0256410256410255
  },
  {
    "date": "2024-08-10",
    "clicks": 15,
    "ctr": 0.375,
    "impressions": 40,
    "position": 1.025
  }
]

export default Test