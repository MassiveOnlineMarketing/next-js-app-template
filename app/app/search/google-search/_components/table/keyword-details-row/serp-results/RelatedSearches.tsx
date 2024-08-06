"use client";

import React, { useState } from "react";

import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

// Hooks and Store
import { useToast } from "@/presentation/components/toast/use-toast";
import useKeywordOpperations from "@/presentation/hooks/serp/useKeywordOpperations";
import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";

// Components
import { Button } from "@/presentation/components/ui/button";

// Assets
import { PlusIcon } from "@heroicons/react/24/outline";
import { LoadingSpinnerSmall } from "@/presentation/components/ui/loading-spinner";
import useRelatedSearchesWithSearchVolume from "@/presentation/hooks/serp/fetching/useRelatedSearchesWithSearchVolume";
import { KeywordMetricsApiResponse } from "@/application/useCases/googleAdsApi/getGoogleSearchKeywordMetrics";

const RelatedSearchesComponent = ({
  keywordData,
}: {
  keywordData: GoogleSearchLatestKeywordResult;
}) => {
  const currentProject = useGoogleSearchCampaignDetailsStore((state) => state.campaignDetails);
  
  const keywords = keywordData.relatedSearches?.map((relatedSearch: any) => relatedSearch.query);
  // TODO: add loading state
  const { isLoading: searchVolumeIsLoading, data } = useRelatedSearchesWithSearchVolume(keywords, currentProject);

  // const [querriesWithSearchVolume, setQuerriesWithSearchVolume] = useState<string[]>([]);
  const [selectedSearches, setSelectedSearches] = useState<string[]>([]);
  const { handleProcessNewKeyword, isLoading } = useKeywordOpperations();
  const { toast } = useToast();

  // Function to handle checkbox selection
  const handleCheckboxChange = (search: string) => {
    if (selectedSearches.includes(search)) {
      setSelectedSearches(selectedSearches.filter((item) => item !== search));
    } else {
      setSelectedSearches([...selectedSearches, search]);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentProject) {
      return;
    }
    try {
      const res = await handleProcessNewKeyword(selectedSearches, currentProject);

      if (res.success) {
        toast({
          description: "Keywords added",
          icon: "success",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        description: "Failed to add keywords",
        variant: "destructive",
        icon: "destructive",
      });
    }
    setSelectedSearches([]);
  };

  return (
    <div className="mb-6 min-h-24">
      <form onSubmit={handleSubmit}>
        <div className="mb-3 flex justify-between items-end">
          <p className="text-lg leading-7 font-medium text-gray-800">
            Related Searches
          </p>
          <Button
            disabled={isLoading || selectedSearches.length === 0}
            size="sm"
            type="submit"
            variant="appWhite"
          >
            {isLoading ? (
              <LoadingSpinnerSmall className="w-4 h-4" />
            ) :
              (
                <PlusIcon className="w-4 h-4" />
              )}
            Add
          </Button>
        </div>
        {Array.isArray(data?.data) &&
          data.data.length > 0 ? (
          <>
            {data.data.map((relatedSearch: KeywordMetricsApiResponse ) => (
              <label
                className="flex items-center gap-[10px]"
                key={relatedSearch.text}
              >
                <input
                  type="checkbox"
                  name={relatedSearch.text}
                  className="h-4 w-4 my-auto rounded border-gray-300 accent-primary-500 focus:accent-primary-500"
                  value={relatedSearch.text}
                  checked={selectedSearches.includes(relatedSearch.text)}
                  onChange={() => handleCheckboxChange(relatedSearch.text)}
                />
                <p className="w-full flex justify-between text-base leading-6 font-normal text-gray-800">
                  <span>{relatedSearch.text}</span>
                  <span className="ml-auto">{relatedSearch.keyword_metrics.avg_monthly_searches}</span>
                </p>
              </label>
            ))}
          </>
        ) : (
          <p className="text-base leading-6 font-normal text-gray-800">
            No related searches
          </p>
        )}
      </form>
    </div>
  );
};

export default RelatedSearchesComponent;
