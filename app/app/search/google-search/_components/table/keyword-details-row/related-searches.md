"use client";

import React, { useState } from "react";

import { LatestResultsDTO } from "@/dashboard/google-search/serp-types";

// Hooks and Store
import { useGoogleSearchProjectDetailsStore } from "@/lib/zustand/google-search-details-store";
import { useProcessNewKeywords } from "@/dashboard/google-search/hooks/useProcessNewKeywords";
import { useToast } from "@/website/features/toast/use-toast";

// Components
import { Button } from "@/components/ui/button";

// Assets
import { PlusIcon } from "@heroicons/react/24/outline";

const RelatedSearchesComponent = ({
  keywordData,
}: {
  keywordData: LatestResultsDTO;
}) => {
  const currentProject = useGoogleSearchProjectDetailsStore(
    (state) => state.ProjectDetails,
  );

  const [selectedSearches, setSelectedSearches] = useState<string[]>([]);
  const { processNewKeywords, isLoading } = useProcessNewKeywords();
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
      await processNewKeywords(selectedSearches, currentProject);
      toast({
        description: "Keywords added",
        icon: "success",
        variant: "success",
      });
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
            <PlusIcon className="w-4 h-4" />
            Add
          </Button>
        </div>
        {Array.isArray(keywordData.relatedSearches) &&
        keywordData.relatedSearches.length > 0 ? (
          <>
            {keywordData.relatedSearches.map((relatedSearch: any) => (
              <label
                className="flex items-center gap-[10px]"
                key={relatedSearch.query}
              >
                <input
                  type="checkbox"
                  name={relatedSearch.query}
                  className="h-4 w-4 my-auto rounded border-gray-300 accent-primary-500 focus:accent-primary-500"
                  value={relatedSearch.query}
                  checked={selectedSearches.includes(relatedSearch.query)}
                  onChange={() => handleCheckboxChange(relatedSearch.query)}
                />
                <p className="text-base leading-6 font-normal text-gray-800">
                  {relatedSearch.query}
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
