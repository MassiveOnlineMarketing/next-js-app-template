'use client';

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";


import RelatedSearches from "./keyword-details-row/comps/RelatedSearches";
import GoogleAdsMetrics from "./keyword-details-row/comps/GoogleAdsMetrics";
import PeopleAlsoAsk from "./keyword-details-row/comps/PeopleAlsoAsk";
import MetaTitle from "./keyword-details-row/comps/MetaTitle";
import MetaDescription from "./keyword-details-row/comps/MetaDescription";
import Url from "./keyword-details-row/comps/Url";
import KeywordDetails from "./keyword-details-row/comps/KeywordDetails";

const KeywordDetailsRow = ({ keywordData, googleSearchCampaign }: {
  keywordData: GoogleSearchLatestKeywordResult,
  googleSearchCampaign: GoogleSearchCampaign
}) => {

  return (
    <div className="dark:bg-p-1100 max-w-[1240px] mx-auto grid grid-cols-2 gap-6">
      <div className="space-y-6">
        <KeywordDetails keywordData={keywordData} />
        <Url url={keywordData.url} />
        <MetaTitle metaTitle={keywordData.metaTitle} />
        <MetaDescription metaDescription={keywordData.metaDescription} />
      </div>
      <div className="space-y-6">
        <GoogleAdsMetrics keywordData={keywordData} />
        <PeopleAlsoAsk keywordData={keywordData} />
        <RelatedSearches keywordData={keywordData} />
      </div>
    </div>
  );
}


export default KeywordDetailsRow;