'use client';

import { GoogleSearchLatestKeywordResult } from '@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult';
import { useGoogleSearchKeywordResultStore } from '@/presentation/stores/google-search-keyword-result-store';
import { useEffect } from 'react';

export const GoogleSearchKeywordResultStoreProvider = ({ googleSearchLatestSerpResult }: {googleSearchLatestSerpResult: GoogleSearchLatestKeywordResult[]}) => {
    const setGoogleSearchKeywordResult = useGoogleSearchKeywordResultStore((state) => state.setKeywordResults);

    useEffect(() => {
        console.log('🟢 setting new keyword results');
        console.log('googleSearchLatestSerpResult', googleSearchLatestSerpResult);
        setGoogleSearchKeywordResult(googleSearchLatestSerpResult);
    }, []);

    return null;
}