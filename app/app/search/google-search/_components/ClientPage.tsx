"use client";

import React from "react";

import { GoogleSearchKeywordResultStoreProvider } from "../../../_providers/GoogleSearchKeywordResultStoreProvider";
import { GoogleSearchCampaignDetailsStoreProvider } from "../../../_providers/GoogleSearchCampaignDetailsStoreProvider";

import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import { useWebsiteDetailsStore } from "@/presentation/stores/website-details-store";
import { useGoogleSearchKeywordResultStore } from "@/presentation/stores/google-search-keyword-result-store";

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

import GoogleSearchProjectFormDialog from "@/presentation/components/google-search-campaign/google-search-campaign-form-dialog";
import AddKeywordsFrom from "@/presentation/components/forms/AddKeywordsForm";
import CampaignStats from "@/presentation/components/google-search-campaign/campaign-stats/CampaignStats";
import DataTable from "./table/keyword-table";
import { columns } from "./table/columns";
import useFilteredKeywordResults from "@/presentation/hooks/serp/useFilteredKeywordResults";
import KeywordTableHead from "./table/KeywordTableHead";


const ClientPage = ({
  googleSearchCampaign,
  latestSerpResults,
}: {
  googleSearchCampaign: GoogleSearchCampaign;
  latestSerpResults: GoogleSearchLatestKeywordResult[];
}) => {
  const filteredResults = useFilteredKeywordResults();
  console.log("filtered google search results", filteredResults);
  const currentWebsite = useWebsiteDetailsStore((state) => state.websiteDetails);

  const [open, setOpen] = React.useState(false);

  if (!currentWebsite) {
    return <div>loading</div>;
  }


  return (
    <>
      <GoogleSearchKeywordResultStoreProvider
        googleSearchLatestSerpResult={latestSerpResults}
      />
      <GoogleSearchCampaignDetailsStoreProvider
        googleSearchCampaignDetails={googleSearchCampaign}
      />

      <KeywordTableHead />
      <CampaignStats filteredResults={filteredResults} />
      <DataTable columns={columns()} data={filteredResults} googleSearchCampaign={googleSearchCampaign} />
    </>
  );
};

export default ClientPage;
