import { Pill } from '@/components/ui/pill'
import { LatestResultsDTO } from '@/dashboard/google-search/serp-types'
import { FlagIcon } from '@heroicons/react/24/outline'
import React from 'react'

const PerformanceDetails = ({ keywordData }: { keywordData: LatestResultsDTO }) => {

  return (
    <div className="w-[285px] px-5 mt-14">
      <div className='flex justify-center gap-2'>
        <FlagIcon className="w-6 h-6 text-gray-700" />
        <h2 className="text-lg leading-7 font-medium text-gray-800">Performance Metrics</h2>
      </div>
      <div className='space-y-[10px] pt-4'>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Competition
          </p>
          <Pill color='primary' variant='text'>{keywordData.competition}</Pill>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Competition Index
          </p>
          <Pill color='primary' variant='text'>{keywordData.competitionIndex}/100 </Pill>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Keyword vol.
          </p>
          <Pill color='primary' variant='text'>{keywordData.avgMonthlySearches}/m </Pill>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Highest bid
          </p>
          <Pill color='primary' variant='text'>
            {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(Number(keywordData.highTopOfBidPage) / 1000000)}
          </Pill>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Lowest bid
          </p>
          <Pill color='primary' variant='text'>
            {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(Number(keywordData.lowTopOfBidPage) / 1000000)}
          </Pill>
        </div>
      </div>
    </div>
  )
}

export default PerformanceDetails