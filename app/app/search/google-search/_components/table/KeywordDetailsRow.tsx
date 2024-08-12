'use client';

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";


import RelatedSearches from "./keyword-details-row/comps/RelatedSearches";
import GoogleAdsMetrics from "./keyword-details-row/comps/GoogleAdsMetrics";
import PeopleAlsoAsk from "./keyword-details-row/comps/PeopleAlsoAsk";
import MetaTitle from "./keyword-details-row/comps/MetaData";
import MetaDescription from "./keyword-details-row/comps/MetaDescription";
import Url from "./keyword-details-row/comps/Url";
import KeywordDetails from "./keyword-details-row/comps/KeywordDetails";
import { Card } from "./keyword-details-row/GoogleSearchConsoleGraphCard";
import SearchConsoleDataCard from "./keyword-details-row/comps/SearchConsoleDataCard";
import Test from "./keyword-details-row/comps/Test";

const KeywordDetailsRow = ({ keywordData, googleSearchCampaign }: {
  keywordData: GoogleSearchLatestKeywordResult,
  googleSearchCampaign: GoogleSearchCampaign
}) => {

  console.log('KeywordDetailsRow', keywordData, googleSearchCampaign);

  return (
    <div className="dark:bg-p-1100 max-w-[1240px] mx-auto ">
      <Test keywordName={keywordData.keywordName} websiteId={googleSearchCampaign.websiteId}/>

      <div className="grid grid-cols-2 gap-6 pb-6">
        <div className="space-y-6">
          <KeywordDetails keywordData={keywordData} />
          <Url url={keywordData.url} domainUrl={googleSearchCampaign.domainUrl} />
          <MetaTitle metaTitle={keywordData.metaTitle} metaDescription={keywordData.metaDescription}/>
        </div>
        <div className="space-y-6">
          <GoogleAdsMetrics keywordData={keywordData} />
          <PeopleAlsoAsk keywordData={keywordData} />
          <RelatedSearches keywordData={keywordData} />
        </div>
      </div>
    </div>
  );
}


export default KeywordDetailsRow;