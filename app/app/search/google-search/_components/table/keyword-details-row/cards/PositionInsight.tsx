'use client';

import React from 'react'

import useGoogleSearchCompetitorGraphData from '@/presentation/hooks/serp/fetching/useGoogleSearchCompetitorGraphData';
import { YAxis, XAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid, Legend, TooltipProps } from "recharts";

import { Card, CardTitle } from '../Card'
import { format, parse } from "date-fns";

// Define a color array for the different websites

const COLORS = ["#059669", "#3B82F6", "#7857FE", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

const PositionInsight = ({ keywordId }: {
  keywordId: string
}) => {
  const { isLoading, data: res } = useGoogleSearchCompetitorGraphData(keywordId);
  // console.log('google search competitor graph data', res);

  // TODO: States
  if (isLoading || !res?.data) return

  const data = res.data
  const keys = Object.keys(data?.[data.length - 1] || {});

  // Remove the "date" key
  const websiteKeys = keys.filter(key => key !== 'date');
  console.log('data', data)

  return (
    <Card className=" mb-6">
      <CardTitle title="Position Insight" />

      <div style={{ width: '100%', height: '265px' }}>
        <ResponsiveContainer>
          <AreaChart data={data} style={{ paddingBottom: 0, marginLeft: -25 }} >
            <XAxis
              dataKey={'date'}
              interval={0}
              tickFormatter={(tickItem) => {
                const date = parse(tickItem, "yyyy-MM-dd", new Date());
                return format(date, "MM/dd");
              }}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
            />
            <Legend />
            <CartesianGrid stroke="#E5E7EB" horizontal={true} vertical={false} />
            <Tooltip content={< CustomTooltip />} />
            <YAxis
              reversed
              yAxisId={1}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
            />
            {websiteKeys.map((websiteKey, index) => (
              <Area
                key={websiteKey}
                isAnimationActive={false}
                yAxisId={1}
                type="monotone"
                dataKey={websiteKey}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                fill="transparent"
              />
            ))}

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}


const CustomTooltip = ({payload, label }: TooltipProps<string, string>) => {

  return (
    <div
      className='p-3 bg-white shadow-md rounded-lg debug dark:bg-dark-bg-light dark:border dark:border-dark-stroke backdrop-blur'
      style={{
        transform: 'translate(-80px,-110px)',
      }}
    >
      <p>{label}</p>
      <div>
        {payload?.map((entry, index) => (
          <div key={index}>
            <span style={{ color: entry.color }}>{entry.name}</span> : {entry.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PositionInsight