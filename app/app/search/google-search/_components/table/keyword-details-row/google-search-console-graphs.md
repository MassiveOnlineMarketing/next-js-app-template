import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Types
import { PythonApiKeywordDetailSearchConsoleData } from "@/dashboard/types";

// Components
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TooltipTrigger, Tooltip as UiTooltop, TooltipContent } from "@/components/ui/tooltip";

import { LockClosedIcon } from "@heroicons/react/20/solid";
import { LoadingSpinner } from "@/components/loading-spinner";

type Props = {
  searchConsoleData: PythonApiKeywordDetailSearchConsoleData | null;
  hasGscUrl: boolean;
  refresh_token?: string | null;
};

const GoogleSearchConsoleGraphs = ({
  searchConsoleData,
  hasGscUrl,
  refresh_token,
}: Props) => {
  const hasRefreshToken = refresh_token !== null;

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

  return (
    <div>
      {hasGscUrl ? (
        <>
          {searchConsoleData ? (
            <SearchConsoleChart searchConsoleData={searchConsoleData} />
          ) : (
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
          )}
        </>
      ) : (
        <div className="flex gap-4 w-full h-[152px]">
          {chartConfigs.map((config, index) => (
            <SearchConsoleNotAuthorized
              key={index}
              title={config.title}
              hasRefreshToken={hasRefreshToken}
            /> 
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleSearchConsoleGraphs;

type SearchConsoleLoadingProps = {
  title: string;
  borderColor: string;
  backgroundGradientColor: string;
};

const SearchConsoleLoading = ({
  title,
  borderColor,
  backgroundGradientColor,
}: SearchConsoleLoadingProps) => {
  return (
    <div
      className={`w-full h-full border border-${borderColor} rounded-2xl p-[6px]`}
    >
      <div
        className={cn(
          "relative w-full h-full border rounded-xl",
          `border-${borderColor} bg-gradient-to-b from-white to-[#${backgroundGradientColor}]`,
        )}
      >
        <h2 className="ml-4 mt-4 text-base leading-6 font-medium text-gray-800">
          {title}
        </h2>
        <LoadingSpinner className="absolute left-1/2 top-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
};

type SearchConsoleNotAuthorizedProps = {
  title: string;
  hasRefreshToken: boolean;
};

const SearchConsoleNotAuthorized = ({
  title,
  hasRefreshToken,
}: SearchConsoleNotAuthorizedProps) => {
  return (
    <div
      className={`w-full h-[152px] border border-gray-100 rounded-2xl p-[6px]`}
    >
      <div
        className={cn(
          "relative w-full h-full border rounded-xl",
          `border-gray-100 bg-gradient-to-b from-white to-[#f8fafc]`,
        )}
      >
        <h2 className="ml-4 mt-4 text-base leading-6 font-medium text-gray-800">
          {title}
        </h2>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 flex flex-col justify-center gap-1">
          <UiTooltop>
            <TooltipTrigger>
              <LockClosedIcon className="w-8 h-8 text-gray-400 mx-auto" />
            </TooltipTrigger>
            <TooltipContent>
              {hasRefreshToken ? (
                <p className="text-gray-500 text-center">
                  Add GSC account to website
                </p>
              ) : (
                <Link
                  href="/app/settings/integrations"
                  className="text-primary-500 text-center"
                >
                  Connect Search Console
                </Link>
              )}
            </TooltipContent>
          </UiTooltop>
        </div>
      </div>
    </div>
  );
};

const SearchConsoleChart = ({
  searchConsoleData,
}: {
  searchConsoleData: PythonApiKeywordDetailSearchConsoleData;
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