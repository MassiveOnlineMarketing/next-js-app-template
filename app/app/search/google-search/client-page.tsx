"use client";

import React from "react";

import { GoogleSearchKeywordResultStoreProvider } from "../../_providers/GoogleSearchKeywordResultStoreProvider";
import { GoogleSearchCampaignDetailsStoreProvider } from "../../_providers/GoogleSearchCampaignDetailsStoreProvider";
import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import { useWebsiteDetailsStore } from "@/presentation/stores/website-details-store";
import { useGoogleSearchKeywordResultStore } from "@/presentation/stores/google-search-keyword-result-store";

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

import GoogleSearchProjectFormDialog from "@/presentation/components/google-search-campaign/google-search-campaign-form-dialog";
import AddKeywordsFrom from "@/presentation/components/google-search-campaign/add-keywords-form";

const ClientPage = ({
  googleSearchCampaign,
  latestSerpResults,
}: {
  googleSearchCampaign: GoogleSearchCampaign;
  latestSerpResults: GoogleSearchLatestKeywordResult[];
}) => {
  const googleSearchKeywordResult = useGoogleSearchKeywordResultStore(
    (state) => state.keywordResults
  );
  console.log("googleSearchKeywordResult", googleSearchKeywordResult);
  const currentGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore(
    (state) => state.campaignDetails
  );
  const currentWebsite = useWebsiteDetailsStore(
    (state) => state.websiteDetails
  );

  const [open, setOpen] = React.useState(false);

  if (!currentWebsite) {
    return <div>loading</div>;
  }


  return (
    <div>
      <GoogleSearchKeywordResultStoreProvider
        googleSearchLatestSerpResult={latestSerpResults}
      />
      <GoogleSearchCampaignDetailsStoreProvider
        googleSearchCampaignDetails={googleSearchCampaign}
      />
      <div>
        <AddKeywordsFrom buttonClassName="bg-blue-500 text-white">
          Add Keyword
        </AddKeywordsFrom>
      </div>
      <div className="flex flex-col">
        <button onClick={() => setOpen(true)}>Open Campaign Dialog</button>
        <GoogleSearchProjectFormDialog
          open={open}
          setOpen={setOpen}
          googleSearchCampaign={currentGoogleSearchCampaign}
          website={currentWebsite}
        />
      </div>
      <div>
        {googleSearchKeywordResult
          ? googleSearchKeywordResult.map((keyword) => {
              return (
                <div key={keyword.id} className="grid grid-cols-11">
                  <h1>{keyword.bestPosition}</h1>
                  <h1>{keyword.id}</h1>
                  <h1>{keyword.keywordId}</h1>
                  <h1>{keyword.keywordName}</h1>
                  <h1>{keyword.position}</h1>
                  <h1>{keyword.url}</h1>
                  <h1>{keyword.metaTitle}</h1>
                  <h1>{keyword.metaDescription}</h1>
                  <h1>{keyword.firstPosition}</h1>
                  <h1>{keyword.bestPosition}</h1>
                  <h1>{keyword.latestChange}</h1>
                </div>
              );
            })
          : latestSerpResults.map((keyword) => {
              return (
                <div key={keyword.id} className="grid grid-cols-11">
                  <h1>{keyword.bestPosition}</h1>
                  <h1>{keyword.id}</h1>
                  <h1>{keyword.keywordId}</h1>
                  <h1>{keyword.keywordName}</h1>
                  <h1>{keyword.position}</h1>
                  <h1>{keyword.url}</h1>
                  <h1>{keyword.metaTitle}</h1>
                  <h1>{keyword.metaDescription}</h1>
                  <h1>{keyword.firstPosition}</h1>
                  <h1>{keyword.bestPosition}</h1>
                  <h1>{keyword.latestChange}</h1>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default ClientPage;
