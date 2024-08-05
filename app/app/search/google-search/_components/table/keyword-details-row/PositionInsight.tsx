import React from 'react'

import useGoogleSearchCompetitorGraphData from '@/presentation/hooks/serp/fetching/useGoogleSearchCompetitorGraphData';
import { YAxis, XAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid, Legend } from "recharts";

import { Card, CardTitle } from './Card'
import { format, parse } from "date-fns";

// Define a color array for the different websites

const COLORS = ["#059669", "#3B82F6", "#7857FE", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

const PositionInsight = ({ keywordId }: {
  keywordId: string
}) => {
  const { isLoading, data: res } = useGoogleSearchCompetitorGraphData(keywordId);
  console.log('google search competitor graph data', res);

  // TODO: States
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!res?.data) {
    return <div>No data</div>
  }

  const data = res.data
  const keys = Object.keys(data?.[data.length - 1] || {});

  // Remove the "date" key
  const websiteKeys = keys.filter(key => key !== 'date');

  return (
    <Card className="mt-6">
      <CardTitle heading="Position Insight" />
      <div className="grid grid-flow-col">

        <div style={{ width: '100%', height: '265px' }}><ResponsiveContainer>
          <AreaChart data={data} style={{ paddingBottom: 0 }} >
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
            <Tooltip />
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
                type="linear"
                dataKey={websiteKey}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                fill="transparent"
              />
            ))}

          </AreaChart>
        </ResponsiveContainer></div>
      </div>
    </Card>
  )
}

export default PositionInsight