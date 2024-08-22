"use client";

import React, { useState } from "react";

import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

// Hooks and Store
import { useToast } from "@/presentation/components/toast/use-toast";
import useKeywordOpperations from "@/presentation/keyword-tracker/hooks/useKeywordOpperations";
import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import useRelatedSearchesWithSearchVolume from "@/presentation/keyword-tracker/hooks/fetching/useRelatedSearchesWithSearchVolume";

// Components
import { Button } from "@/presentation/components/ui/button";
import { Card, CardTitle, CardRowInput } from "../Card";
import { LoadingSpinnerSmall } from "@/presentation/components/ui/loading-spinner";

// Assets
import { PlusIcon } from "@heroicons/react/24/outline";

const RelatedSearches = ({
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


  if (!data?.data) return null;

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardTitle title='Related Searches'>
          <Button
            disabled={isLoading || selectedSearches.length === 0}
            size="newXs"
            type="submit"
            variant="new"
          >
            {isLoading ? (
              <LoadingSpinnerSmall className="w-4 h-4" />
            ) :
              (
                <PlusIcon className="w-4 h-4" />
              )}
            Add
          </Button>
        </CardTitle>
        <div className='space-y-[6px]'>
          {data?.data.map((item) => (
            <CardRowInput item={item} selectedSearches={selectedSearches} handleCheckboxChange={handleCheckboxChange} key={item.text} />
          ))}
        </div>
      </form>
    </Card>
  );
};

export default RelatedSearches;
