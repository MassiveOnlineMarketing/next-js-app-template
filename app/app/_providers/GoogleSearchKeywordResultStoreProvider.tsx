'use client';

import { GoogleSearchLatestKeywordResult } from '@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult';
import { useGoogleSearchKeywordResultStore } from '@/presentation/stores/google-search-keyword-result-store';
import { useEffect } from 'react';

export const GoogleSearchKeywordResultStoreProvider = ({ googleSearchLatestSerpResult }: { googleSearchLatestSerpResult: GoogleSearchLatestKeywordResult[] }) => {
  const setGoogleSearchKeywordResult = useGoogleSearchKeywordResultStore((state) => state.setKeywordResults);
  const resetResults = useGoogleSearchKeywordResultStore((state) => state.resetKeywordResults);
  const resetSelectedTags = useGoogleSearchKeywordResultStore((state) => state.resetSelectedTags);

  useEffect(() => {
    console.log('resetting results');
    resetResults();
    resetSelectedTags();

    console.log('🟢 setting new keyword results');
    console.log('googleSearchLatestSerpResult', googleSearchLatestSerpResult);
    setGoogleSearchKeywordResult(googleSearchLatestSerpResult);
  }, []);

  return null;
}