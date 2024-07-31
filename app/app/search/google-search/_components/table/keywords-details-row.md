import React, { useEffect, useState } from "react";
import axios from "axios";

import { PythonApiKeywordDetailSearchConsoleData } from "@/dashboard/types";
import { GoogleSearchSerpResult } from "@prisma/client";
import { LatestResultsDTO } from "@/dashboard/google-search/serp-types";

import { useWebsiteDetailsStore } from "@/lib/zustand/website-details-store";
import { getTopTenSerpResults } from "@/dashboard/google-search/data/google-search-serp-result";
import { FormattedDataItem, getCompetitorResultDataGraphA } from "@/dashboard/google-search/actions/get-competitor-result-data";

// Components
import { Card, CardTitle } from "./keyword-details-row/card";
import { GoogleIconSvg } from "../../_assets";

// Elements
import RelatedSearchesComponent from "./keyword-details-row/related-searches";
import PeopleAlsoAsk from "./keyword-details-row/people-also-ask";
import GoogleSearchConsoleGraphs from "./keyword-details-row/google-search-console-graphs";
import SerpResultCard from "./keyword-details-row/serp-result-card";
import UserResultDetails from "./keyword-details-row/user-result-details";
import CompetitorsGraph from "./keyword-details-row/competitors-graph";
import { Pill } from "@/components/ui/pill";
import PerformanceDetails from "./keyword-details-row/performance-details";



type Props = {
  keywordData: LatestResultsDTO;
  refresh_token: string | null;
};

const KeywordDetailsRow = ({ keywordData, refresh_token }: Props) => {
  const domainUrl = useWebsiteDetailsStore((state) => state.WebsiteDetails?.domainUrl);
  const gscUrl = useWebsiteDetailsStore((state) => state.WebsiteDetails?.gscUrl);
  const hasGscUrl = gscUrl !== null && gscUrl !== "";

  const [showAll, setShowAll] = useState(false);

  const { isLoading: GSCDataIsLoading, searchConsoleData } = useKeywordDetailsSearchConsoleData(keywordName, googleSearchCampaign.websiteId);
  // console.log("searchConsoleData", searchConsoleData, GSCDataIsLoading);  
  const { isLoading: TopTenSerpResultsIsLoading, topTenSerpResults } = useGoogleSearchTopTenResults("c46043f0-45e4-4950-926b-e50cbb3b5f27");
  // console.log("topTenSerpResults", topTenSerpResults, TopTenSerpResultsIsLoading);  
  const { isLoading: CompetitorsDataIsLoading, competitorGraphData } = useGoogleSearchCompetitorGraphData("c46043f0-45e4-4950-926b-e50cbb3b5f27");
  // console.log("competitorGraphData", competitorGraphData, CompetitorsDataIsLoading);

  return (
    <div>
      <GoogleSearchConsoleGraphs
        searchConsoleData={searchConsoleData}
        refresh_token={refresh_token}
        hasGscUrl={hasGscUrl}
      />

      {keywordData.position && (
        <Card className="mt-6">
          <CardTitle heading="Keyword Insight" icon={GoogleIconSvg} />
          <div className="grid grid-flow-col">
            <div className="flex-grow flex flex-row gap-[10px] w-fit bg-primary-50 p-[6px] rounded-lg">
              <UserResultDetails keywordData={keywordData} domainUrl={domainUrl} />
              <PerformanceDetails keywordData={keywordData} />
            </div>
            {competitorResults && (
              <div>
                <h2 className="text-center text-lg leading-7 font-medium text-gray-800">Competitors Positions</h2>
                <CompetitorsGraph data={competitorResults} />
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="my-6 ">
        <CardTitle heading="Google Data" icon={GoogleIconSvg} />
        <div className="grid grid-cols-2">
          <div className="w-full min-h-[500px]">
            <p className="mb-3 pt-2 text-lg leading-7 font-medium text-gray-800">
              Top Search Results
            </p>
            <div className="max-w-[530px]">
              {topTenResults
                .slice(0, showAll ? topTenResults.length : 3)
                .map((result, index) => (
                  <SerpResultCard key={result.id} result={result} />
                ))}
              <button
                className="mx-auto w-fit flex text-sm leading-5 font-medium text-gray-500"
                onClick={() => setShowAll(!showAll)}
              >
                {!showAll ? "Show More" : "Show Less"}
              </button>
            </div>
          </div>

          <div>
            <RelatedSearchesComponent keywordData={keywordData} />
            <PeopleAlsoAsk keywordData={keywordData} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KeywordDetailsRow;
