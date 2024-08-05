'use client';

import React, { useState } from 'react'

import useGoogleSearchTopTenResults from '@/presentation/hooks/serp/fetching/useGoogleSearchTopTenResults';

import { GoogleSearchLatestKeywordResult } from '@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult';

import RelatedSearchesComponent from './serp-results/RelatedSearches';
import PeopleAlsoAsk from './serp-results/PeopleAlsoAsk';
import SerpResultCard from './serp-results/SerpResultCard';

import { Card, CardTitle } from './Card'

import { GoogleIconSvg } from '../../../../../../../assets/logos'


const GoogleSerpData = ({ keywordData }: {
  keywordData: GoogleSearchLatestKeywordResult
}) => {
  const { isLoading, data } = useGoogleSearchTopTenResults(keywordData.keywordId);
  const [showAll, setShowAll] = useState(false);

  // TODO: States
  if (isLoading) {
    return <div>Loading...</div>
  }

  const topTenResults = data?.data;

  if (!topTenResults) {
    return <div>No data</div>
  }
  
  return (
    <Card className="my-6 ">
      <CardTitle heading="Google Data" icon={GoogleIconSvg} />
      <div className="grid grid-cols-2">
        <div className="w-full min-h-[500px]">
          <p className="mb-3 pt-2 text-lg leading-7 font-medium text-gray-800">
            Top Search Results
          </p>
          <div className="max-w-[530px]">
            {topTenResults
              .slice(0, showAll ? topTenResults.length : 3)
              .map((result, index) => (
                <SerpResultCard key={result.id} result={result} />
              ))}
            <button
              className="mx-auto w-fit flex text-sm leading-5 font-medium text-gray-500"
              onClick={() => setShowAll(!showAll)}
            >
              {!showAll ? "Show More" : "Show Less"}
            </button>
          </div>
        </div>

        <div>
          <RelatedSearchesComponent keywordData={keywordData} />
          <PeopleAlsoAsk keywordData={keywordData} />
        </div>
      </div>
    </Card>
  )
}

export default GoogleSerpData