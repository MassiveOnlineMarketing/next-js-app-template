"use client";

import React, { useEffect } from "react";

// Hooks
import { useWebsiteDetailsStore } from "@/presentation/stores/website-details-store";
import useFilteredKeywordResults from "@/presentation/hooks/serp/useFilteredKeywordResults";
import useKeywordOpperations from "@/presentation/hooks/serp/useKeywordOpperations";
import useGoogleSearchCampaignOpperations from "@/presentation/hooks/serp/useGoogleSearchCampaignOpperations";

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

// Table
import DataTable from "./table/keyword-table";
import { columns } from "./table/columns";

// Components
import KeywordTableHead from "./table/KeywordTableHead";
import CampaignStats from "@/presentation/components/google-search-campaign/campaign-stats/CampaignStats";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "@/presentation/components/ui/alert-dialog";



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

  const { setInitialStateSerpResults, isDeleteDialogOpen, setIsDeleteDialogOpen, cancelDelete, confirmDelete } = useKeywordOpperations();
  const { setGoogleSearchCampaignInitialState } = useGoogleSearchCampaignOpperations();
  useEffect(() => {
    setInitialStateSerpResults(latestSerpResults);
    setGoogleSearchCampaignInitialState(googleSearchCampaign);
  }, []);

  if (!currentWebsite) {
    return <div>loading</div>;
  }

  return (
    <>
      {/* <KeywordTableHead /> */}
      <CampaignStats filteredResults={filteredResults} />
      <div className="relative">
        <DataTable columns={columns(currentWebsite.domainUrl)} data={filteredResults} googleSearchCampaign={googleSearchCampaign} />
      </div>

      {/* Dialog for deleting keyword */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            Are you sure you want to delete this keyword?
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-200 hover:bg-red-300 text-red-500 hover:text-red-600 border border-red-300 px-[24px] py-[12px] rounded-lg"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClientPage;
