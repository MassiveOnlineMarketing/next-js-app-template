import { auth } from '@/application/services/AuthService'
import { getGoogleSearchCampaignByUserId } from '@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignByUserId'
import { getAllWebsites } from '@/application/useCases/website/getAllWebsites'
import { GoogleSearchCampaign } from '@/domain/serpTracker/enitities/GoogleSearchCampaign'
import React from 'react'
import ClientComp from './clientComp'
import { getWebsiteById } from '@/application/useCases/website/getWebsiteById'

const page = async () => {

  // const allWebsites = await getAllWebsites()
  // console.log(allWebsites)

  const session = await auth()
  const userId = session?.user.id


  if (!userId) {
    return <div>Not authenticated</div>
  }

  const googleSearchCampaigns = await getGoogleSearchCampaignByUserId(userId)
  
  if (!googleSearchCampaigns.data) {
    return <div>No campaigns</div>
  }
  
  const websiteId = googleSearchCampaigns.data[0].websiteId
  const websiteRes = await getWebsiteById(websiteId)
  const googleSearchCampaign = googleSearchCampaigns.data[0]
  const website = websiteRes.data

  if (!website) {
    return <div>No website</div>
  }

  return (
    <div>
      {/* <CampaingTable campaigns={googleSearchCampaigns} /> */}
      <ClientComp campaign={googleSearchCampaign } website={website} />
      <pre>{JSON.stringify(googleSearchCampaigns, null, 2)}</pre>
      
    </div>
  )
}


const CampaingTable = ({ campaigns }: {campaigns: GoogleSearchCampaign[]}) => {
  return (
    <div>
      {campaigns.map((campaign) => (
        <div key={campaign.id} className='flex'>
          <h1>{campaign.id}</h1>
          <p>{campaign.country}</p>
          <p>{campaign.domainUrl}</p>
          <p>{campaign.campaignName}</p>
          <p>{campaign.language}</p>
        </div>
      ))}
    </div>
  )
}

export default page