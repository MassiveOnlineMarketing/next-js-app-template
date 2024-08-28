'use client';

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

import GoogleSearchConsoleDataGraphs from "./keyword-details-row/cards/GoogleSearchConsoleDataGraphs";
import KeywordDetails from "./keyword-details-row/cards/KeywordDetails";
import Url from "./keyword-details-row/cards/Url";
import MetaData from "./keyword-details-row/cards/MetaData";
import GoogleAdsMetrics from "./keyword-details-row/cards/GoogleAdsMetrics";
import PeopleAlsoAsk from "./keyword-details-row/cards/PeopleAlsoAsk";
import RelatedSearches from "./keyword-details-row/cards/RelatedSearches";
import PositionInsight from "./keyword-details-row/cards/PositionInsight";
import TopSerpResults from "./keyword-details-row/cards/TopSerpResults";

const KeywordDetailsRow = ({ keywordData, googleSearchCampaign }: {
  keywordData: GoogleSearchLatestKeywordResult,
  googleSearchCampaign: GoogleSearchCampaign
}) => {

  console.log('KeywordDetailsRow', keywordData, googleSearchCampaign);

  return (
    <div className="dark:bg-p-1100 max-w-[1240px] mx-auto animate-open-down overflow-hidden">
      <GoogleSearchConsoleDataGraphs keywordName={keywordData.keywordName} websiteId={googleSearchCampaign.websiteId} googleSearchCampaign={googleSearchCampaign}/>
      <div className="grid grid-cols-2 gap-6 pb-6">
        <div className="space-y-6">
          <KeywordDetails keywordData={keywordData} />
          <Url url={keywordData.url} domainUrl={googleSearchCampaign.domainUrl} />
          <MetaData metaTitle={keywordData.metaTitle} metaDescription={keywordData.metaDescription}/>
          <RelatedSearches keywordData={keywordData} />
        </div>
        <div className="space-y-6">
          <GoogleAdsMetrics keywordData={keywordData} />
          <PositionInsight keywordId={keywordData.keywordId} />
          <TopSerpResults keywordId={keywordData.keywordId} userDomain={googleSearchCampaign.domainUrl} />
          <PeopleAlsoAsk keywordData={keywordData} />
        </div>
      </div>
    </div>
  );
}


export default KeywordDetailsRow;