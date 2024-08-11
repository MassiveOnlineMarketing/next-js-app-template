'use client'

import React, { useEffect } from 'react'
import { useToast } from '@/presentation/components/toast/use-toast';
import useKeywordDetailsSearchConsoleData from '@/presentation/hooks/serp/fetching/useKeywordDetailsSearchConsoleData';
import useGoogleToken from '@/presentation/hooks/useGoogleRefreshToken';



import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/presentation/components/ui/chart"
import { Card } from '../GoogleSearchConsoleGraphCard';

const Test = ({ keywordName, websiteId }: {
  keywordName: string,
  websiteId: string
}) => {
  const { toast } = useToast();
  const { hasAccess } = useGoogleToken('search-console');
  const { isLoading, data: searchConsoleKeywordDetails } = useKeywordDetailsSearchConsoleData(keywordName, websiteId, hasAccess);
  console.log('data1', searchConsoleKeywordDetails);

  useEffect(() => {
    if (searchConsoleKeywordDetails?.error) {
      toast({
        icon: 'destructive',
        variant: 'destructive',
        description: searchConsoleKeywordDetails?.error,
      })
    }
  }, [keywordName])

  if (!searchConsoleKeywordDetails?.data) return null;

  const data = Object.entries(searchConsoleKeywordDetails.data).map(([date, data]) => ({
    date,
    clicks: Number(data.clicks.toFixed(1)),
    ctr: Number(data.ctr.toFixed(1)),
    impressions: Number(data.impressions.toFixed(1)),
    position: Number(data.position.toFixed(1)),
  }));
  console.log('data2', data);


  const chartConfig = [
    {
      title: "Clicks",
      color: "#2563EB",
      dataKey: "clicks",
      reversed: false
    },
    {
      title: "CTR",
      color: "#059669",
      dataKey: "ctr",
      reversed: false
    },
    {
      title: "Position",
      color: "#F59E0B",
      dataKey: "position",
      reversed: false
    },
    {
      title: "Impressions",
      color: "#7857FE",
      dataKey: "impressions",
      reversed: false
    }
  ]

  return (
    <div className='grid grid-cols-4 gap-6 pb-6'>
      {chartConfig.map((item, i) => {
        return (
          <Card key={i}>
            <div className='p-6'>
              <p className='dark:text-[#DFE5FA]/90'>{item.title}</p>
              <p className='text-sm dark:text-[#DFE5FA]/50'>description</p>
              <p className='pt-6 text-4xl dark:text-[#DFE5FA]/90'>12.000</p>
            </div>
            <Chart title={item.title} data={data} color={item.color} dataKey={item.dataKey} reversed={item.reversed} />
          </Card>
        )
      })}
    </div>
  )
}

const Chart = ({ title, data, color, dataKey, reversed }: {
  title: string;
  data: any[];
  color: string;
  dataKey: string;
  reversed?: boolean;
}) => (
  <div style={{ width: "100%", height: 150 }}> {/* Increase the height and add padding at the top */}
    <ResponsiveContainer>
      <AreaChart data={data} height={150} margin={{ bottom: 50 }}> {/* Adjust viewBox */}
        <defs>

          <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" hide={true} />
        <YAxis reversed={reversed} axisLine={false} hide={true} />
        <Tooltip />
        <Area
          type="monotone"
          strokeWidth={1}
          dataKey={dataKey}
          stroke={color}
          fill={`url(#color${title})`}
          baseValue={-30}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);


export default Test