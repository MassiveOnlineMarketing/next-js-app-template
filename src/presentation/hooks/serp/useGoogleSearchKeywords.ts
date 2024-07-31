'use client';

import { useMemo } from "react";
import { useGoogleSearchKeywordResultStore } from "@/presentation/stores/google-search-keyword-result-store";

export const useGoogleSearchKeywords = () => {
  const keywordResults = useGoogleSearchKeywordResultStore((state) => state.keywordResults);
  const selectedTags = useGoogleSearchKeywordResultStore((state) => state.selectedTags);

  /**
   * Filters the keyword results based on the selected tags.
   * If no tags are selected, returns all keyword results.
   * If tags are selected, returns only the keyword results that have at least one matching tag.
   *
   * @returns {Array<KeywordResult>} The filtered keyword results.
   */
  const filteredResults = useMemo(() => {
    if (selectedTags.length === 0) return keywordResults;
    return keywordResults.filter((result) =>
      result.tags?.some((tag) => selectedTags.includes(tag.name)),
    );
  }, [keywordResults, selectedTags]);



  return {
    filteredResults
  }
}