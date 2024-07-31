'use client';

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

import useKeywordDetailsSearchConsoleData from "@/presentation/hooks/serp/useKeywordDetailsSearchConsoleData";
import useGoogleSearchTopTenResults from "@/presentation/hooks/serp/useGoogleSearchTopTenResults";
import useGoogleSearchCompetitorGraphData from "@/presentation/hooks/serp/useGoogleSearchCompetitorGraphData";

const TestKeywordDetailsRow = ({ keywordData, googleSearchCampaign }: { keywordData: GoogleSearchLatestKeywordResult, googleSearchCampaign: GoogleSearchCampaign }) => {
  const { isLoading: GSCDataIsLoading, searchConsoleData } = useKeywordDetailsSearchConsoleData(keywordData.keywordName, googleSearchCampaign.websiteId);
  // console.log("searchConsoleData", searchConsoleData, GSCDataIsLoading);  
  const { isLoading: TopTenSerpResultsIsLoading, topTenSerpResults } = useGoogleSearchTopTenResults(keywordData.keywordId);
  // console.log("topTenSerpResults", topTenSerpResults, TopTenSerpResultsIsLoading);  
  const { isLoading: CompetitorsDataIsLoading, competitorGraphData } = useGoogleSearchCompetitorGraphData(keywordData.keywordId);
  // console.log("competitorGraphData", competitorGraphData, CompetitorsDataIsLoading);

 
  return (
    <div>
      TestKeywordDetailsRow
    </div>
  );
}


export default TestKeywordDetailsRow;