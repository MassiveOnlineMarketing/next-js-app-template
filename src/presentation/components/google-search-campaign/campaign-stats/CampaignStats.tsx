import React from "react";

import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";
import { RadialChart } from "./RadialChart";

export const CampaignStats = ({ filteredResults }: { filteredResults: GoogleSearchLatestKeywordResult[] | [] }) => {

  const numberOfKeywords = filteredResults.length;


  let numberOfKeywordsInTop3 = 0;
  let numberOfKeywordsInTop10 = 0;
  let numberOfKeywordsInTop100 = 0;
  let numberOfKeyowrdsBettered = 0;
  let numberOfKeyowrdsWorsened = 0;
  let positionSum = 0;

  filteredResults.forEach((keyword) => {
    if (keyword.position) {
      positionSum += keyword.position;
    }
    if (keyword.position && keyword.position <= 3) {
      numberOfKeywordsInTop3++;
    }
    if (keyword.position && keyword.position <= 10) {
      numberOfKeywordsInTop10++;
    }
    if (keyword.position && keyword.position <= 100) {
      numberOfKeywordsInTop100++;
    }
    if (keyword.latestChange && keyword.latestChange > 0) {
      numberOfKeyowrdsBettered++;
    }
    if (keyword.latestChange && keyword.latestChange < 0) {
      numberOfKeyowrdsWorsened++;
    }
  });

  const dataArray = [
    { title: 'Top 3', value: numberOfKeywordsInTop3 },
    { title: 'Top 10', value: numberOfKeywordsInTop10 },
    { title: 'Top 100', value: numberOfKeywordsInTop100 },
    { title: 'Bettered', value: numberOfKeyowrdsBettered },
    { title: 'Worsened', value: numberOfKeyowrdsWorsened }
  ];

  return (
    <div className="p-6 w-full grid grid-cols-4 gap-2">
      {/* Keywords Card*/}
      <div className="py-4 px-6 bg-white dark:bg-[rgba(223,229,250,0.02)] rounded-xl shadow-sm w-full h-full flex gap-6 items-center">
        <p className="text-4xl font-semibold text-gray-700 dark:text-[#DFE5FA]/90 w-[60px] h-[60px] flex items-center justify-center">
          {numberOfKeywords}
        </p>
        <div className="h-fit">
          <h2 className="mr-auto mb-[20px] text-lg font-semibold text-gray-800 dark:text-[#DFE5FA]/90">
            Keywords
          </h2>
        </div>
      </div>
      {/* Other Cards*/}
      {dataArray.map((item, i) => (
        <StatsCardWithChart key={i} item={item} total={numberOfKeywords} />
      ))}
      {/* Avg pos Card*/}
      <div className="py-4 px-6 bg-white dark:bg-[rgba(223,229,250,0.02)] rounded-xl shadow-sm w-full h-full flex gap-6 items-center">
        <p className="text-4xl font-semibold text-gray-700 dark:text-[#DFE5FA]/90 w-[60px] h-[60px] flex items-center justify-center">
          {
            ((positionSum / numberOfKeywords).toFixed(1) === "NaN" ? "0" : (positionSum / numberOfKeywords).toFixed(1))
          }
        </p>
        <div className="h-fit">
          <h2 className="mr-auto mb-[20px] text-lg font-semibold text-gray-800 dark:text-[#DFE5FA]/90">
            Average Position
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CampaignStats;

type StatsCardWithChartProps = {
  item: {
    title: string;
    value: number;
  };
  total: number;
};

const StatsCardWithChart = ({ item, total }: StatsCardWithChartProps) => {
  const { title, value } = item;
  return (
    <div className="py-4 px-6 bg-white dark:bg-[rgba(223,229,250,0.02)] rounded-xl shadow-sm w-full h-full flex gap-6 items-center">
      <RadialChart value={value} total={total} />
      <div className="h-fit">
        <h2 className="mr-auto text-lg font-semibold text-gray-800 dark:text-[#DFE5FA]/90">
          {title}
        </h2>
        <p className="text-sm font-light text-gray-500 dark:text-[#DFE5FA]/50 ">Vs Yesterday</p>
      </div>
    </div>
  );
}