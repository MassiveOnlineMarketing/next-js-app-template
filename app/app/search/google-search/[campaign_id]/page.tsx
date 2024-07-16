import { getGoogleSearchCampaignById } from '@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignById'
import React, { Suspense } from 'react'
import ClientComp from '../../search-project/clientComp'
import { LoadingSpinner } from '@/presentation/components/ui/loading-spinner'

const page = async ({
  params: { campaign_id }
}: {
  params: { campaign_id: string }
}) => {

  const campaign = await getGoogleSearchCampaignById(campaign_id)
  // TODO: handle error
  if (!campaign.success) {
    return <div className='flex h-full w-full items-center justify-center'>error</div>
  }

  return (
    <div className="px-6 pb-6 w-full h-full">
      <p>Bread Crumb</p>
      <Suspense fallback={<div className='flex h-full w-full items-center justify-center'><LoadingSpinner /></div>}>
        {campaign?.data && (
          <ClientComp campaing={campaign.data} />
        )}
      </Suspense>
      <pre>{JSON.stringify(campaign, null, 2)}</pre>
    </div>
  )
}

export default page