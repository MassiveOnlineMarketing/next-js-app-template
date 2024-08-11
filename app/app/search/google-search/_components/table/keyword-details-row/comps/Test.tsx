'use client'

import React, { useEffect } from 'react'
import { useToast } from '@/presentation/components/toast/use-toast';
import useKeywordDetailsSearchConsoleData from '@/presentation/hooks/serp/fetching/useKeywordDetailsSearchConsoleData';
import useGoogleToken from '@/presentation/hooks/useGoogleRefreshToken';



import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
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
      domain: getChartDomain(data, 'clicks'),
      total: getTotals(data, 'clicks')
    },
    {
      title: "CTR",
      color: "#059669",
      dataKey: "ctr",
      domain: getChartDomain(data, 'ctr'),
      total: getCtrAverage(data, 'ctr')
    },
    {
      title: "Position",
      color: "#F59E0B",
      dataKey: "position",
      domain: getChartDomain(data, 'position'),
      total: getPositionAverage(data, 'position')
    },
    {
      title: "Impressions",
      color: "#7857FE",
      dataKey: "impressions",
      domain: getChartDomain(data, 'impressions'),
      total: getTotals(data, 'impressions')
    }
  ]

  console.log('chartConfig', chartConfig);
  return (
    <div className='grid grid-cols-4 gap-6 pb-6'>
      {chartConfig.map((config) => (
        <Card key={config.title} >
          <div className='p-6'>
            <p className='dark:text-[#DFE5FA]/90'>{config.title}</p>
            <p className='text-sm dark:text-[#DFE5FA]/50'>description</p>
            <p className='pt-6 text-4xl font-semibold dark:text-[#DFE5FA]/90'>{config.title === "CTR" ? `${config.total}%` : config.total}</p>
          </div>
          <div className='h-[250px]'>
            <GoogleSearchConsoleChart
              data={data}
              positionDomain={config.domain}
              dataKey={config.dataKey}
              color={config.color}
              title={config.title}
            />
          </div>
        </Card>
      ))}
    </div>
  )
}

const getTotals = (data: ChartData[], key: keyof ChartData): number => {
  return data.reduce((acc, item) => acc + (item[key] as number), 0);
}

const getPositionAverage = (data: ChartData[], key: keyof ChartData): number => {
  return Math.round(getTotals(data, key) / data.length);
}

const getCtrAverage = (data: ChartData[], key: keyof ChartData): number => {
  return Number((getTotals(data, key) / data.length).toFixed(1));
}


const getChartDomain = (data: ChartData[], key: keyof ChartData): [number, number] => {
  const values = data.map(item => item[key] as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const minPadding = 0.1;
  const bottomPadding = Math.max((max - min) * 1, minPadding); // 10% padding for bottom
  const topPadding = Math.max((max - min) * 0.1, minPadding); // 50% padding for top
  return [min - bottomPadding, max + topPadding];
}

interface ChartData {
  date: string;
  clicks: number;
  ctr: number;
  impressions: number;
  position: number;
}
type GoogleSearchConsoleChartProps = {
  data: ChartData[];
  positionDomain: [number, number];

  dataKey: string;
  color: string;
  title: string;
}

const GoogleSearchConsoleChart = ({ data, positionDomain, dataKey, color, title }: GoogleSearchConsoleChartProps) => {

  return (
    <ResponsiveContainer width="100%" height="100%" style={{ borderRadius: 23, overflow: 'hidden' }}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={color}
              stopOpacity={0.6}
            />
            <stop
              offset="85%"
              stopColor={color}
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <XAxis hide={true} dataKey="date" />
        <YAxis hide={true} axisLine={false} domain={positionDomain} />
        <Tooltip />
        <Area
          type="monotoneX"
          dataKey={dataKey}
          stroke={color}
          fill={`url(#color${title})`}
          baseValue={positionDomain[0]} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const MOCK_CHART_DATA: ChartData[] = [
  {
    "date": "2024-08-02",
    "clicks": 0,
    "ctr": 0,
    "impressions": 70,
    "position": 16
  },
  {
    "date": "2024-08-03",
    "clicks": 0,
    "ctr": 1,
    "impressions": 1,
    "position": 2
  },
  {
    "date": "2024-08-04",
    "clicks": 0,
    "ctr": 0,
    "impressions": 0,
    "position": 0
  },
  {
    "date": "2024-08-05",
    "clicks": 0,
    "ctr": 0,
    "impressions": 0,
    "position": 0
  },
  {
    "date": "2024-08-06",
    "clicks": 0,
    "ctr": 0.7,
    "impressions": 3,
    "position": 1
  },
  {
    "date": "2024-08-07",
    "clicks": 0,
    "ctr": 0,
    "impressions": 0,
    "position": 0
  },
  {
    "date": "2024-08-08",
    "clicks": 0,
    "ctr": 0,
    "impressions": 2,
    "position": 9.5
  }
]

export default Test