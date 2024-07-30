'use client';

import React, { useState } from "react";
import { useSession } from "next-auth/react";

import { useCurrentUser } from "../auth/hooks/user-current-user";

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";

import { splitAndTrimKeywords } from "../lib/utils";
import { useGoogleSearchKeywordResultStore } from "../stores/google-search-keyword-result-store";
import { useToast } from "../components/toast/use-toast";
import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

export function useKeywordOpperations() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const user = useCurrentUser()
  const { update } = useSession();
  const updateKeywordResults = useGoogleSearchKeywordResultStore((state) => state.updateKeywordResults);


  /**
   * Handles the process of adding new keywords to a Google search campaign.
   * 
   * @param keywordsString - The string containing the keywords to be added.
   * @param googleSearchCampaign - The Google search campaign to add the keywords to.
   * @returns An object indicating the success of the operation.
   */
  const handleProcessNewKeyword = async (
    keywordsString: string,
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

    const keywordsArray = splitAndTrimKeywords(keywordsString);

    if (keywordsArray.length > user.credits) {
      const neededCredits = keywordsArray.length - user.credits;
      showErrorToast(`You need ${neededCredits} more credits to add ${keywordsArray.length} keywords`);
      return { success: false };
    }

    setIsLoading(true);
    const BATCH_SIZE = 50;

    try {
      for (let i = 0; i < keywordsArray.length; i += BATCH_SIZE) {
        const batch = keywordsArray.slice(i, i + BATCH_SIZE);

        const payload = {
          campaignId: googleSearchCampaign.id,
          keywordNames: batch,
        }


        const response = await fetch("/api/serp", {
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
      }
      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      console.error('error creating keyword:', error);
      showErrorToast('Error creating keyword');
      setIsLoading(false);
      return { success: false };
    }
  }

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

  return { isLoading, handleProcessNewKeyword };
}

export default useKeywordOpperations;