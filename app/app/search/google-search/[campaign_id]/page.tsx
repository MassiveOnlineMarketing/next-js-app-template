import { getGoogleSearchCampaignById } from '@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignById'
import React from 'react'
import ClientPage from '../client-page'
import { getGoogleSearchLatestSerpResults } from '@/application/useCases/googleSearchLatestSerpResults/getGoogleSearchLatestSerpResults'

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
  
  // console.log('🟢 filteredSerpResults:', filteredSerpResults);
  // console.log('🟢 campaign:', campaign);
  
  return (
    <div className="px-6 pb-6 w-full h-full">
      <p>Bread Crumb</p>
      <ClientPage googleSearchCampaign={campaign.data} latestSerpResults={filteredSerpResults} />
      <pre>{JSON.stringify(campaign, null, 2)}</pre>
    </div>
  )
}

export default page