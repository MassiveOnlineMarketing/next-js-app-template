import { getGoogleSearchCampaignById } from '@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignById'
import React from 'react'

import { getGoogleSearchLatestSerpResults } from '@/application/useCases/googleSearchLatestSerpResults/getGoogleSearchLatestSerpResults'
import BreadCrumbsSearchKeywords from '../_components/bread-crumbs'
import ClientPage from '../_components/ClientPage'

const page = async ({
  params: { campaign_id }
}: {
  params: { campaign_id: string }
}) => {

  const [campaign, latestSerpResults] = await Promise.all([
    getGoogleSearchCampaignById(campaign_id),
    getGoogleSearchLatestSerpResults(campaign_id)
  ]);
  
  if (!campaign.data) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='bg-white p-4 rounded-xl text-xl'>
          {campaign.error ?? 'Campaign not found'}
        </div>
      </div>
    );
  }
  
  // BUG: nadat je een projeect aanmaakt staan er geen serp results in de database
  if (!latestSerpResults.data) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='bg-white p-4 rounded-xl text-xl'>
          {latestSerpResults.error ?? 'Latest Serp Results not found'}
        </div>
      </div>
    );
  }
  
  // Filter out null values from latestSerpResults.data
  const filteredSerpResults = latestSerpResults.data.filter(result => result !== null);
  
  return (
    <div className="w-full h-full">
      <BreadCrumbsSearchKeywords campaignName={campaign.data.campaignName} />
      <ClientPage googleSearchCampaign={campaign.data} latestSerpResults={filteredSerpResults} />
    </div>
  )
}

export default page