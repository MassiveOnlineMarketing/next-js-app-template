"use client";

import React, { useEffect } from "react";

// Hooks
import { useWebsiteDetailsStore } from "@/presentation/stores/website-details-store";
import useFilteredKeywordResults from "@/presentation/keyword-tracker/hooks/useFilteredKeywordResults";
import useKeywordOpperations from "@/presentation/keyword-tracker/hooks/useKeywordOpperations";
import useGoogleSearchKeywordTracker from "@/presentation/keyword-tracker/hooks/useGoogleSearchKeywordTracker";

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

// Table
import DataTable from "@/presentation/keyword-tracker/components/table/keyword-table";
import { columns } from "@/presentation/keyword-tracker/components/table/columns";

// Components
import CampaignStats from "@/presentation/components/google-search-campaign/campaign-stats/CampaignStats";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from "@/presentation/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import { useGoogleSearchKeywordResultStore } from "@/presentation/stores/google-search-keyword-result-store";
import { LoadingSpinner } from "@/presentation/components/ui/loading-spinner";


const ClientPage = ({
  googleSearchCampaign,
  latestSerpResults,
}: {
  googleSearchCampaign: GoogleSearchCampaign;
  latestSerpResults: GoogleSearchLatestKeywordResult[];
}) => {
  const filteredResults = useFilteredKeywordResults();
  const currentWebsite = useWebsiteDetailsStore((state) => state.websiteDetails);
  const currentGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore((state) => state.campaignDetails);
  const keywordResults = useGoogleSearchKeywordResultStore((state) => state.keywordResults);

  const { isDeleteDialogOpen, setIsDeleteDialogOpen, cancelDelete, confirmDelete } = useKeywordOpperations();
  const { setNewSerpResultState } = useGoogleSearchKeywordTracker();

  const router = useRouter();

  useEffect(() => {
    setNewSerpResultState(latestSerpResults);
  }, []);

  if (latestSerpResults.length === 0) {
    return <div className='flex h-full w-full items-center justify-center'>No Results<LoadingSpinner /></div>;
  }
  // if (!currentGoogleSearchCampaign) {
  //   return <div>No current location</div>;
  // }

  if (!latestSerpResults) return <div className='flex h-full w-full items-center justify-center'><LoadingSpinner /></div>

  return (
    <>
      <CampaignStats filteredResults={filteredResults} />
      <div className="relative">
        <DataTable columns={columns(googleSearchCampaign.domainUrl)} data={filteredResults} googleSearchCampaign={googleSearchCampaign} />
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
