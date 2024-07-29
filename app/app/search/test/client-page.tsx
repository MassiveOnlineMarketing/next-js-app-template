'use client';

import useKeywordOpperations from '@/presentation/hooks/useKeywordOpperations';
import { useGoogleSearchCampaignDetailsStore } from '@/presentation/stores/google-search-campaign-store';
import Image from 'next/image';
import React, { useState } from 'react'

const ClientPage = () => {
  const googleSearchCampaign = useGoogleSearchCampaignDetailsStore(state => state.campaignDetails)
  console.log('googleSearchCampaign', googleSearchCampaign)

  const handleClick = async () => {
    console.log('test')
    const payload = {
      campaignId: 'c0c1a2fb-d21c-430c-8a6f-edff631cdcd2',
      keywordNames: ['eureka mignon specialita']
    }

    const response = await fetch("/api/serp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resultResponse = await response.json();

    console.log('response', response)
    console.log('resultResponse', resultResponse)
  }

  return (
    <div className=''>
      <img src='https://www.telegraaf.nl/favicon.ico' width={32} height={32} alt='favicon' />
      <button onClick={handleClick}>test</button>
    </div>
  )
}

export default ClientPage