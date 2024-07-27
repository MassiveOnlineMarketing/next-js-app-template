'use client';

import useKeywordOpperations from '@/presentation/hooks/useKeywordOpperations';
import { useGoogleSearchCampaignDetailsStore } from '@/presentation/stores/google-search-campaign-store';
import React, { useState } from 'react'

const ClientPage = () => {

  const { handleProcessNewKeyword } = useKeywordOpperations()
  const googleSearchCampaign = useGoogleSearchCampaignDetailsStore(state => state.campaignDetails)
  console.log('googleSearchCampaign', googleSearchCampaign)

  const handleClick = () => {
    console.log('test')
  }

  return (
    <div className=''>
      <button onClick={handleClick}>test</button>
    </div>
  )
}

export default ClientPage