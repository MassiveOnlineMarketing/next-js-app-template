import { auth } from '@/application/services/AuthService'
import { getGoogleSearchCampaignByUserId } from '@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignByUserId'
import Link from 'next/link';
import React from 'react'


const page = async () => {

  const session = await auth();
  const userId = session?.user?.id
  if (!userId) return null
  const userCampaigns = await getGoogleSearchCampaignByUserId(userId)

  return (
    <div>
      {userCampaigns.data?.map(campaign => (
        <div key={campaign.id}>
          <p>{campaign.id}</p>
          <p>{campaign.projectName}</p>
          <Link href={`/app/search/google-search/${campaign.id}`}>Go to project</Link>
        </div>
        ))}
      /app/search
    </div>
  )
}

export default page