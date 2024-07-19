'use client'

import React, { useEffect, useState } from 'react'

import UpdateWebsiteButton from '@/presentation/components/website/update-website-button'
import WebsiteSelectionButton from '@/presentation/components/website/website-selection-button'

import { Cog6ToothIcon } from '@heroicons/react/24/solid'

import { useWebsiteDetailsStore } from '@/presentation/stores/website-details-store'
import { getGoogleSearchCampaignByWebsiteId } from '@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignByWebsiteId'
import { GoogleSearchCampaign } from '@/domain/serpTracker/enitities/GoogleSearchCampaign'


import GoogleSearchProjectFormDialog from '@/presentation/components/google-search-campaign/google-search-campaign-form-dialog'
import Link from 'next/link'
import { useGoogleSearchCampaignDetailsStore } from '@/presentation/stores/google-search-campaign-store'


type CampaingProps = {
  name: string;
  href: string;
  disabled?: boolean;
  tooltipLabel?: string;
};

const SecondarySidebar = () => {
  const currentWebsite = useWebsiteDetailsStore(state => state.websiteDetails)
  const googleSearchCampaigns = useGoogleSearchCampaignDetailsStore(state => state.campaigns)
  const setGoogleSearchCampaigns = useGoogleSearchCampaignDetailsStore(state => state.setCampaigns)

  const [campaignsChildren, setCampaignsChildren] = useState<CampaingProps[] | undefined>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchProjects();
  }, [currentWebsite]);

  const fetchProjects = async () => {
    if (!currentWebsite) return;
    const searchProjects = await getGoogleSearchCampaignByWebsiteId(currentWebsite.id);
    setGoogleSearchCampaigns(searchProjects.data ?? []); 
  };

  return (
    <div className='p-2'>
      <WebsiteSelectionButton />

      <p>Campaigns</p>
      {googleSearchCampaigns?.map((campaign) => (
        <Link key={campaign.id} href={`/app/search/google-search/${campaign.id}`} className='text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-4 py-2 block'>
          {campaign.projectName}
        </Link>
      ))}


      <div className="mt-auto">
        <button onClick={() => setOpen(true)} className="text-black bg-green-500">+ Open</button>
        <GoogleSearchProjectFormDialog open={open} setOpen={setOpen} website={currentWebsite} />
      </div>


      <UpdateWebsiteButton>
        <Cog6ToothIcon className="w-6 h-6 text-gray-400" />
        <span className="text-gray-500 text-base leading-6 font-medium">
          Website Settings
        </span>
      </UpdateWebsiteButton>
    </div>
  )
}

export default SecondarySidebar