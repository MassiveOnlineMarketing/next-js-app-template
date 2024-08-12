'use client';

import { GoogleSearchConsoleKeywordDetailsData } from "@/domain/models/googleSearchConsoleApi";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";


const SearchConsoleChart = ({
  searchConsoleData,
}: {
  searchConsoleData: GoogleSearchConsoleKeywordDetailsData;
}) => {
  // Convert data into an array of objects also round the numbers
  const data = Object.entries(searchConsoleData).map(([date, data]) => ({
    date,
    clicks: Number(data.clicks.toFixed(1)),
    ctr: Number(data.ctr.toFixed(1)),
    impressions: Number(data.impressions.toFixed(1)),
    position: Number(data.position.toFixed(1)),
  }));

  return (
    <div className="flex gap-4 w-full h-[152px]">
      <div className="w-full border border-blue-100 rounded-2xl p-[6px]">
        <div className="w-full border border-blue-100 rounded-xl bg-gradient-to-b from-white to-[#Eff6FF]">
          <Chart title="Clicks" data={data} color="#3B82F6" dataKey="clicks" />
        </div>
      </div>
      <div className="w-full border border-green-100 rounded-2xl p-[6px]">
        <div className="w-full border border-green-100 rounded-xl bg-gradient-to-b from-white to-[#ECFDF5]">
          <Chart title="CTR" data={data} color="#059669" dataKey="ctr" />
        </div>
      </div>
      <div className="w-full border border-yellow-100 rounded-2xl p-[6px]">
        <div className="w-full border border-yellow-100 rounded-xl bg-gradient-to-b from-white to-[#FFFBEB]">
          <Chart
            title="Position"
            data={data}
            color="#F59E0B"
            dataKey="position"
            reversed={true}
          />
        </div>
      </div>
      <div className="w-full border border-primary-100 rounded-2xl p-[6px]">
        <div className="w-full border border-primary-100 rounded-xl bg-gradient-to-b from-white to-[#F8F8FF]">
          <Chart
            title="Impressions"
            data={data}
            color="#7857FE"
            dataKey="impressions"
          />
        </div>
      </div>
    </div>
  );
};

const Chart = ({ title, data, color, dataKey, reversed }: {
  title: string;
  data: any[];
  color: string;
  dataKey: string;
  reversed?: boolean;
}) => (
  <>
    <h2 className="ml-4 mt-4 text-base leading-6 font-medium text-gray-800">
      {title}
    </h2>
    <div style={{ width: "100%", height: 96 }}>
      <ResponsiveContainer>
        <AreaChart data={data} style={{ paddingBottom: 0 }}>
          <defs>
            {reversed ? (
              <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0} />
                <stop offset="100%" stopColor={color} stopOpacity={0.15} />
              </linearGradient>
            ) : (
              <linearGradient id={`color${title}`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <XAxis dataKey="date" hide={true} />
          <YAxis reversed={reversed} axisLine={false} hide={true} />
          <Tooltip />
          <Area
            type="linear"
            strokeWidth={2}
            dataKey={dataKey}
            stroke={color}
            fill={`url(#color${title})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </>
);


export default SearchConsoleChart;