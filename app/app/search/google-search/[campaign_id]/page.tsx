import { getGoogleSearchCampaignById } from '@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignById'
import React from 'react'
import ClientPage from '../client-page'

const page = async ({
  params: { campaign_id }
}: {
  params: { campaign_id: string }
}) => {

  const campaign = await getGoogleSearchCampaignById(campaign_id)
  if (!campaign.data) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='bg-white p-4 rounded-xl text-xl'>
          {campaign.error ?? 'Campaign not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 pb-6 w-full h-full">
      <p>Bread Crumb</p>
      <ClientPage googleSearchCampaign={campaign.data} />
      <pre>{JSON.stringify(campaign, null, 2)}</pre>
    </div>
  )
}

export default page