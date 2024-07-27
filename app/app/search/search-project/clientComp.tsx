'use client'

import React, { useEffect } from 'react'


import { useGoogleSearchCampaignDetailsStore } from '@/presentation/stores/google-search-campaign-store'

import { GoogleSearchCampaign } from '@/domain/serpTracker/enitities/GoogleSearchCampaign'
import GoogleSearchProjectFormDialog from '@/presentation/components/google-search-campaign/google-search-campaign-form-dialog'
import { Website } from '@/domain/_entities/Website'

const ClientComp = ({
  campaign,
  website
}: {
  campaign: GoogleSearchCampaign
  website: Website
}) => {

  const setGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore(state => state.setCampaignDetails)

  useEffect(() => {
    console.log('updating campaign')
    setGoogleSearchCampaign(campaign)
  }, [campaign])

  const [open, setOpen] = React.useState(true)


  return (
    <div>
      <button></button>
      <GoogleSearchProjectFormDialog open={open} setOpen={setOpen}
        googleSearchCampaign={campaign}
        website={website} 
      />
    </div>
  )
}

export default ClientComp