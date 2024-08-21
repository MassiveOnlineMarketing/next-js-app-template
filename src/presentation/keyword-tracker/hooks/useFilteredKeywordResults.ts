'use client';

import { useMemo } from "react";
import { useGoogleSearchKeywordResultStore } from "@/presentation/stores/google-search-keyword-result-store";

const useFilteredKeywordResults = () => {
  const keywordResults = useGoogleSearchKeywordResultStore(
    (state) => state.keywordResults,
  );
  const selectedTags = useGoogleSearchKeywordResultStore((state) => state.selectedTags);

  const filteredResults = useMemo(() => {
    if (selectedTags.length === 0) return keywordResults;
    return keywordResults.filter((result) =>
      result.tags?.some((tag) => selectedTags.includes(tag.name)),
    );
  }, [keywordResults, selectedTags]);

  return filteredResults;
};

export default useFilteredKeywordResults;