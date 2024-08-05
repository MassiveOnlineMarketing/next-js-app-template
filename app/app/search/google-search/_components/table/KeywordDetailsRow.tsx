'use client';

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

import GoogleSearchConsoleGraphs from "./keyword-details-row/GoogleSearchConsoleGraphs";
import KeywordInsight from "./keyword-details-row/KeywordInsight";
import PositionInsight from "./keyword-details-row/PositionInsight";
import GoogleSerpData from "./keyword-details-row/GoogleSerpData";

const KeywordDetailsRow = ({ keywordData, googleSearchCampaign }: {
  keywordData: GoogleSearchLatestKeywordResult,
  googleSearchCampaign: GoogleSearchCampaign
}) => {
  
  return (
    <div>
      <GoogleSearchConsoleGraphs keywordName={keywordData.keywordName} websiteId={googleSearchCampaign.websiteId} />
      <KeywordInsight keywordData={keywordData} domainUrl={googleSearchCampaign.domainUrl} />
      <PositionInsight keywordId={keywordData.keywordId} />
      <GoogleSerpData keywordData={keywordData} />
    </div>
  );
}


export default KeywordDetailsRow;