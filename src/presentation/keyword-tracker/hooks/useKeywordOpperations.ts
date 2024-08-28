'use client';

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "../../auth/hooks/user-current-user";
import { useToast } from "@/presentation/components/toast/use-toast";

import { useGoogleSearchKeywordResultStore } from "@/presentation/stores/google-search-keyword-result-store";
import { deleteGoogleSearchKeywordByIds } from "@/application/useCases/googleSearchKeyword/deleteGoogleSearchKeywordByIds";

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";
import { GoogleSearchCampaignKeywordsSchemaType } from "@/application/schemas/googleSearchCampaignSchema";

import { splitAndTrimKeywords } from "@/presentation/lib/utils";


export function useKeywordOpperations() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { update } = useSession();
  const user = useCurrentUser()

  const updateKeywordResults = useGoogleSearchKeywordResultStore((state) => state.updateKeywordResults);
  const setKeywordResults = useGoogleSearchKeywordResultStore((state) => state.setKeywordResults);
  const results = useGoogleSearchKeywordResultStore((state) => state.keywordResults);

  /**
   * Handles the addition of new keywords to a Google Search Campaign.
   * 
   * @param keywords - The keywords to be added.
   * @param googleSearchCampaign - The Google Search Campaign to add the keywords to.
   * @returns An object indicating the success of the operation.
   */
  const handleAddNewKeyword = async (keywords: GoogleSearchCampaignKeywordsSchemaType, googleSearchCampaign: GoogleSearchCampaign) => {
    setIsLoading(true);
    showProcessingToast('Adding keywords...');

    const startTime = Date.now(); // Start time

    try {
      const response = await handleProcessNewKeyword(keywords.keywords, googleSearchCampaign);
      const endTime = Date.now(); // End time
      const duration = endTime - startTime; // Duration in milliseconds
      console.log(`handleAddNewKeyword took ${duration} ms`);

      if (response.success) {
        showSuccessToast('Keywords added successfully!');
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error: any) {
      console.error('error adding keywords:', error);
      showErrorToast('Error adding keywords');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Handles the process of adding new keywords to a Google search campaign.
   * 
   * @param keywordsString - The string containing the keywords to be added.
   * @param googleSearchCampaign - The Google search campaign to add the keywords to.
   * @returns An object indicating the success of the operation.
   */
  const handleProcessNewKeyword = async (
    keywordsString: string | string[],
    googleSearchCampaign: GoogleSearchCampaign
  ) => {
    if (!googleSearchCampaign) {
      showErrorToast('Please add a Google search campaign first');
      return { success: false };
    }
    if (!user || !user.id) {
      showErrorToast('Please sign in first');
      return { success: false };
    }

    let keywordsArray: string[] = [];
    if (typeof keywordsString === 'string') {
      keywordsArray = splitAndTrimKeywords(keywordsString);
    } else {
      keywordsArray = keywordsString;
    }

    if (keywordsArray.length > user.credits) {
      const neededCredits = keywordsArray.length - user.credits;
      showErrorToast(`You need ${neededCredits} more credits to add ${keywordsArray.length} keywords`);
      return { success: false };
    }

    setIsLoading(true);
    const BATCH_SIZE = 99;

    try {
      // for (let i = 0; i < keywordsArray.length; i += BATCH_SIZE) {
      //   const batch = keywordsArray.slice(i, i + BATCH_SIZE);

        const payload = {
          campaignId: googleSearchCampaign.id,
          keywordNames: keywordsArray,
        }


        const response = await fetch("/api/serp-test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const resultResponse = await response.json();

        if (!resultResponse.success) {
          setIsLoading(false);
          return { success: false };
        }

        const userResults: GoogleSearchLatestKeywordResult[] = JSON.parse(resultResponse.data);

        updateKeywordResults(userResults);
        update({ credits: user.credits - userResults.length });
      // }
      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error('error creating keyword:', error);
      showErrorToast('Error creating keyword');
      setIsLoading(false);
      return { success: false };
    }
  }


  // Stuff for deleting a keyword, including the dialog with confirmation
  const [keywordsToDelete, setKeywordsToDelete] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false); // Dialog is located in the [campaign_id] client page
  const handleDeleteKeyword = async (keywordId: string[]) => {
    setKeywordsToDelete(keywordId);
    setIsDeleteDialogOpen(true);
  }

  const confirmDelete = async () => {
    if (keywordsToDelete !== null) {
      const responses = await deleteGoogleSearchKeywordByIds(keywordsToDelete);
      // if response is only one array show tost else console.log
      if (keywordsToDelete.length === 1) {
        showSuccessToast(`The keyword deleted.`);
      } else if (keywordsToDelete.length > 1) {
        showSuccessToast(`The keywords are deleted.`);
      } else {
        showErrorToast('Failed to delete keyword');
        console.log("Failed to delete keyword:", responses);
      }

      const newResults = results.filter(
        (result: GoogleSearchLatestKeywordResult) =>
          !keywordsToDelete.includes(result.keywordId),
      );
      setKeywordResults(newResults);
      setIsDeleteDialogOpen(false);
    }
  };

  const cancelDelete = () => {
    setKeywordsToDelete([]);
    setIsDeleteDialogOpen(false);
  };

  const showErrorToast = (message: string) => {
    toast({
      description: `Error creating keyword: ${message}`,
      variant: 'destructive',
    });
  }

  const showSuccessToast = (message: string) => {
    toast({
      icon: 'success',
      description: message,
      variant: 'success',
    });
  }

  const showProcessingToast = (message: string) => {
    toast({
      description: message,
      variant: 'warning',
    });
  }

  return { handleAddNewKeyword, isLoading, handleProcessNewKeyword, handleDeleteKeyword, confirmDelete, cancelDelete, isDeleteDialogOpen, setIsDeleteDialogOpen };
}

export default useKeywordOpperations;