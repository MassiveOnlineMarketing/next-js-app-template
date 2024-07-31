import React from 'react'

import { YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid, Legend } from "recharts";

import { FormattedDataItem } from '@/dashboard/google-search/actions/get-competitor-result-data';
import { createXAxis } from '@/components/recharts';


// Define a color array for the different websites
const COLORS = ["#059669", "#3B82F6", "#7857FE", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

const CompetitorsGraph = ({ data }: { data: FormattedDataItem[] }) => {
  // Get the keys from the first object in the data array
  const keys = Object.keys(data?.[data.length - 1] || {});

  // Remove the "date" key
  const websiteKeys = keys.filter(key => key !== 'date');

  return (
    <div style={{ width: '100%', height: '265px' }}><ResponsiveContainer>
      <AreaChart data={data} style={{ paddingBottom: 0 }} >
        {createXAxis('date')}
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
  )
}

export default CompetitorsGraph