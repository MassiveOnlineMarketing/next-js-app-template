'use client';

import React, { useEffect } from 'react'

import { useGoogleSearchCampaignDetailsStore } from '@/presentation/stores/google-search-campaign-store'
import { useWebsiteDetailsStore } from '@/presentation/stores/website-details-store'

import { GoogleSearchCampaign } from '@/domain/serpTracker/enitities/GoogleSearchCampaign'

import GoogleSearchProjectFormDialog from '@/presentation/components/google-search-campaign/google-search-campaign-form-dialog'
import { testUseCase } from '@/application/useCases/test';
import { Keyword, TKeyword } from '@/domain/serpTracker/enitities/Keyword';
import useKeywordOpperations from '@/presentation/hooks/useKeywordOpperations';
import { useGoogleSearchKeywordResultStore } from '@/presentation/stores/google-search-keyword-result-store';

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
  const googleSearchKeywordResult = useGoogleSearchKeywordResultStore(state => state.keywordResults)

  const currentGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore(state => state.campaignDetails)
  const currentWebsite = useWebsiteDetailsStore(state => state.websiteDetails)
console.log('currentGoogleSearchCampaign', googleSearchKeywordResult)
  const { handleProcessNewKeyword } = useKeywordOpperations()

  const [open, setOpen] = React.useState(false)
  if (!currentWebsite) {
    return <div>loading</div>
  }

  const process = async () => {
    console.log('processing keyword')

    const test = await testUseCase({ projectId: 'clysntuu4000dq3sgq5ibey2j', keywordNames: ['baristart', 'eureka Mignon'], country: 'NL', language: 'nl', domainUrl: 'https://www.baristart.nl', userId: 'clv3tdoqv000010uqcdlbewnz' })
    console.log('test:', test)
  }

  if (!currentGoogleSearchCampaign) {
    return <div>loading</div>
  }
  const handleClick = async () => {
    console.log('test')
    const res = await handleProcessNewKeyword('baristart\neureka Mignon', currentGoogleSearchCampaign)
    console.log('res', res)
  }

  return (
    <div className='flex flex-col'>
      <button onClick={() => setOpen(true)}>Open Campaign Dialog</button>
      <GoogleSearchProjectFormDialog open={open} setOpen={setOpen}
        googleSearchCampaign={currentGoogleSearchCampaign}
        website={currentWebsite}
      />
      <button onClick={handleClick}>Click</button>
      <button onClick={process}>Process keyword</button>
      {googleSearchKeywordResult.map((keyword) => {
        return (
          <div key={keyword.id} className='grid grid-cols-11'>
            <h1>{keyword.bestPosition}</h1>
            <h1>{keyword.id}</h1>
            <h1>{keyword.keywordId}</h1>
            <h1>{keyword.keywordName}</h1>
            <h1>{keyword.position}</h1>
            <h1>{keyword.url}</h1>
            <h1>{keyword.metaTitle}</h1>
            <h1>{keyword.metaDescription}</h1>
            <h1>{keyword.firstPosition}</h1>
            <h1>{keyword.bestPosition}</h1>
            <h1>{keyword.latestChange}</h1>

          </div>
        ) 
      })}
    </div>
  )
}

export default ClientPage