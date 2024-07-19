'use client';

import React, { useEffect } from 'react'

import { useGoogleSearchCampaignDetailsStore } from '@/presentation/stores/google-search-campaign-store'
import { useWebsiteDetailsStore } from '@/presentation/stores/website-details-store'

import { GoogleSearchCampaign } from '@/domain/serpTracker/enitities/GoogleSearchCampaign'

import GoogleSearchProjectFormDialog from '@/presentation/components/google-search-campaign/google-search-campaign-form-dialog'
import { testUseCase } from '@/application/useCases/test';
import { Keyword, TKeyword } from '@/domain/serpTracker/enitities/Keyword';

const ClientPage = ({
  googleSearchCampaign
}: {
  googleSearchCampaign: GoogleSearchCampaign
}) => {
  const setGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore(state => state.setCampaignDetails)
  useEffect(() => {
    console.log('updating campaign')
    setGoogleSearchCampaign(googleSearchCampaign)
  }, [googleSearchCampaign])


  const currentGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore(state => state.campaignDetails)
  const currentWebsite = useWebsiteDetailsStore(state => state.websiteDetails)


  const [open, setOpen] = React.useState(false)
  if (!currentWebsite) {
    return <div>loading</div>
  }

  const process = async () => {
    console.log('processing keyword') 

    const test = await testUseCase({projectId:'clysntuu4000dq3sgq5ibey2j', keywordNames: ['baristart', 'eureka Mignon'], country: 'NL', language: 'nl', domainUrl: 'https://www.baristart.nl', userId: 'clv3tdoqv000010uqcdlbewnz'})
    console.log('test:', test)
  }

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Campaign Dialog</button>
      <GoogleSearchProjectFormDialog open={open} setOpen={setOpen}
        googleSearchCampaign={currentGoogleSearchCampaign}
        website={currentWebsite}
      />
      <button onClick={process}>Process keyword</button>
    </div>
  )
}

export default ClientPage