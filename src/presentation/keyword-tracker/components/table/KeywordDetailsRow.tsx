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
import { BarChart } from "lucide-react";

const KeywordDetailsRow = ({ keywordData, googleSearchCampaign }: {
  keywordData: GoogleSearchLatestKeywordResult,
  googleSearchCampaign: GoogleSearchCampaign
}) => {

  console.log('KeywordDetailsRow', keywordData, googleSearchCampaign);

  return (
    <div className="dark:bg-p-1100 max-w-[1240px] mx-auto animate-open-down overflow-hidden">
      <GoogleSearchConsoleDataGraphs keywordName={keywordData.keywordName} websiteId={googleSearchCampaign.websiteId} googleSearchCampaign={googleSearchCampaign} />
      <Sepetator Icon={BarChart} text="Keyword Insight" />
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <KeywordDetails keywordData={keywordData} />
        </div>
        <div className="space-y-6">
          <GoogleAdsMetrics keywordData={keywordData} />
        </div>
        <PositionInsight className='col-span-2' keywordId={keywordData.keywordId} />
      </div>

      <Sepetator Icon={BarChart} text="SERP Data" />

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <Url url={keywordData.url} domainUrl={googleSearchCampaign.domainUrl} />
          <MetaData metaTitle={keywordData.metaTitle} metaDescription={keywordData.metaDescription} />
        </div>
        <div className="space-y-6">
          <TopSerpResults keywordId={keywordData.keywordId} userDomain={googleSearchCampaign.domainUrl} />
        </div>
      </div>

      <Sepetator Icon={BarChart} text="Organic Search" />

      <div className="grid grid-cols-2 gap-6 pb-6">
        <RelatedSearches keywordData={keywordData} />
        <PeopleAlsoAsk keywordData={keywordData} />
      </div>

    </div>
  );
}

const Sepetator = ({ Icon, text }: { Icon: React.ElementType, text: string }) => {

  return (
    <div className="py-6 flex items-center gap-2">
      <Icon className="text-primary-500 w-[18px] h-[18px]" />
      <p className="text-xl text-light-text-dark dark:text-dark-text-light font-medium">{text}</p>
      <Svg />
    </div>
  );
}


const Svg = () => {
  return (
    <svg width="82" height="9" viewBox="0 0 82 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M43.5 8.42371L50 0.423706L6.5 0.423708L0 8.42371L43.5 8.42371Z" fill="#DFE5FA" />
      <path d="M54.5 8.42371L61 0.423706L54.5 0.423706L48 8.42371L54.5 8.42371Z" fill="#DFE5FA" />
      <path d="M65 8.42371L71 0.423706L65 0.423706L59 8.42371L65 8.42371Z" fill="#DFE5FA" />
      <path d="M75.5 8.42371L82 0.423706L75.5 0.423706L69 8.42371L75.5 8.42371Z" fill="#DFE5FA" />
    </svg>

  )
}

export default KeywordDetailsRow;