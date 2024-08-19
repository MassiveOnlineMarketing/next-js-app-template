'use client';

import React from 'react'
import Link from 'next/link';

import { GoogleSearchCampaign } from '@/domain/serpTracker/enitities/GoogleSearchCampaign';

import useTestWebsiteSelection, { WebsitesArrayType } from './useTestWebsiteSelection';
import { useWebsiteDetailsStore } from '@/presentation/stores/website-details-store';
import { useGoogleSearchCampaignDetailsStore } from '@/presentation/stores/google-search-campaign-store';

import { getFaviconUrl } from '@/presentation/lib/utils';

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSubTriggerWithoutArrow, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu';

import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpDownIcon, MapPinIcon } from '@heroicons/react/20/solid';

const TestWebsiteSelectionButton = () => {
  const { isLoading, websiteWithGoogleSearchCampaigns, setWebsiteById, setGoogleSearchCampaignById } = useTestWebsiteSelection();
  const selectedWebsite = useWebsiteDetailsStore((state) => state.websiteDetails);
  const selectedGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore((state) => state.campaignDetails);
  // console.log('googleSearchCampaigns', googleSearchCampaigns)

  const handleClick = (data: any) => {
    if (!data.id) {
      console.log('campaing needs setting up')
      return;
    }

    if (data.websiteId) {
      console.log('google search campaign', data)
      setWebsiteById(data.websiteId)
      setGoogleSearchCampaignById(data.id)
    } else {
      console.log('website', data)
      setWebsiteById(data.id)
    }
  }


  if (isLoading === true) {
    return (
      <div className='flex flex-col p-[6px] rounded-md border dark:border-dark-stroke dark:bg-dark-bg-light w-[350px]'>
        <WebsiteSelectorMock label='Loading...' />
        <LocationSelectorMock label='Loading...' />
      </div>
    )
  }

  console.log('selectedWesbite', selectedWebsite)
  console.log('websiteWithGoogleSearchCampaigns', websiteWithGoogleSearchCampaigns)
  console.log('filtered selected website', websiteWithGoogleSearchCampaigns.filter(website => website.id === selectedWebsite?.id)[0])

  console.log('test', websiteWithGoogleSearchCampaigns, 'loading', isLoading)




  return (
    <div className='flex flex-col p-[6px] rounded-md border dark:border-dark-stroke dark:bg-dark-bg-light w-[350px]'>
      {/* Website selector */}

      {selectedWebsite ? (
        <DropdownMenu dir="ltr">
          <DropdownMenuTrigger className='flex items-center mb-2'>
            <img src={getFaviconUrl(selectedWebsite?.domainUrl)} width={36} height={36} alt='favicon' className='border dark:border-dark-stroke rounded-[4px]' />
            <p className='pl-3 dark:text-dark-text-light'>{selectedWebsite.websiteName}</p>
            <ChevronUpDownIcon className='min-w-6 h-6 ml-auto mr-[6px] dark:text-dark-text-dark' />
          </DropdownMenuTrigger>
          {websiteWithGoogleSearchCampaigns.length > 0 && (
            <DropdownMenuContent side="right" className="w-fit flex flex-row min-w-[40px]">
              {websiteWithGoogleSearchCampaigns.map((website) => (
                <WebsiteItem key={website.id} website={website} handleClick={handleClick} />
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      ) : (
        websiteWithGoogleSearchCampaigns.length > 0 ? (
          <DropdownMenu dir="ltr">
            <DropdownMenuTrigger className='flex items-center mb-2'>
              <CubeTransparentIcon className="h-9 w-9 text-gray-700" />
              <p className='pl-3 dark:text-dark-text-light'>Select Website</p>
              <ChevronUpDownIcon className='min-w-6 h-6 ml-auto mr-[6px] dark:text-dark-text-dark' />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-fit flex flex-row min-w-[40px]">
              {websiteWithGoogleSearchCampaigns.map((website) => (
                <WebsiteItem key={website.id} website={website} handleClick={handleClick} />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <WebsiteSelectorMock label='No website to select' />
        )
      )}


      {/* Campaign selector */}
      {selectedWebsite && websiteWithGoogleSearchCampaigns.filter(website => website.id === selectedWebsite.id).length > 0 &&
        websiteWithGoogleSearchCampaigns.filter(website => website.id === selectedWebsite.id)[0].googleSearchCampaign.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger className='px-3 py-2 dark:bg-dark-bg-light dark:text-dark-text-dark text-left flex items-center gap-[6px]'>
            <MapPinIcon className='min-w-5 h-5 dark:text-dark-text-dark' />
            <p className='text-nowrap text-sm'>
              {selectedGoogleSearchCampaign?.location ? `${selectedGoogleSearchCampaign.country} ${selectedGoogleSearchCampaign.location.split(',')[0]}` : (
                selectedGoogleSearchCampaign?.country ? selectedGoogleSearchCampaign.country : 'Select Location'
              )}
            </p>
            <div className='w-full h-[1px] bg-p-100 dark:bg-dark-stroke'></div>
            <ChevronDownIcon className='min-w-5 h-5 ml-auto dark:text-dark-text-dark' />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" className=" w-[350px]">
            {websiteWithGoogleSearchCampaigns.filter(website => website.id === selectedWebsite?.id).map((website) => (
              <React.Fragment key={website.id}>
                {website.googleSearchCampaign.map((campaign) => (
                  <DropdownMenuItem className='w-full' key={campaign.id} onClick={() => handleClick(campaign)}>
                    {campaign.location ? `${campaign.country} ${campaign.location.split(',')[0]}` : campaign.country}
                  </DropdownMenuItem>
                ))}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <LocationSelectorMock label='No location to select' />
      )}
    </div>
  )
}


const WebsiteSelectorMock = ({ label }: { label: string }) => {
  return (
    <div className='flex items-center mb-2'>
      <CubeTransparentIcon className="h-9 w-9 text-gray-700" />
      <p className='pl-3 dark:text-dark-text-light'>{label}</p>
      <ChevronUpDownIcon className='min-w-6 h-6 ml-auto mr-[6px] dark:text-dark-text-dark' />
    </div>
  )
}

const LocationSelectorMock = ({ label }: { label: string }) => {
  return (
    <div className='px-3 py-2 dark:bg-dark-bg-light dark:text-dark-text-dark text-left flex items-center gap-[6px]'>
      <MapPinIcon className='min-w-5 h-5 dark:text-dark-text-dark' />
      <p className='text-nowrap text-sm'>
        {label}
      </p>
      <div className='w-full h-[1px] bg-p-100 dark:bg-dark-stroke'></div>
      <ChevronDownIcon className='min-w-5 h-5 ml-auto dark:text-dark-text-dark' />
    </div>
  )
}

const WebsiteItem = ({ website, handleClick }: { website: WebsitesArrayType, handleClick: (data: any) => void }) => {
  // console.log('website', website)
  if (website.googleSearchCampaign.length === 0) {
    return (
      <DropdownMenuItem onClick={() => handleClick(website)}>
        <img src={getFaviconUrl(website.domainUrl)} width={32} height={32} alt='favicon' />
      </DropdownMenuItem>
    )
  }

  const googleSearchCampaign = website.googleSearchCampaign as GoogleSearchCampaign[];

  const groupedCampaigns = googleSearchCampaign.reduce((acc, campaign) => {
    if (!campaign.location) {
      // If the campaign has no location, add it as a primary campaign
      acc[campaign.country] = acc[campaign.country] || { ...campaign, location: [] };
    } else {
      // If the campaign has a location, add it to the locations array of the respective country
      if (acc[campaign.country]) {
        acc[campaign.country].location.push(campaign);
      } else {
        // If there is no primary campaign for the country, create an empty primary campaign with locations
        //@ts-ignore
        acc[campaign.country] = { country: campaign.country, location: [campaign] };
      }
    }
    return acc;
  }, {} as Record<string, GoogleSearchCampaign & { location: GoogleSearchCampaign[] }>);


  // console.log('grouped camopaign', groupedCampaigns)

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTriggerWithoutArrow onClick={() => handleClick(website)}>
          <img src={getFaviconUrl(website.domainUrl)} width={32} height={32} alt='favicon' />
        </DropdownMenuSubTriggerWithoutArrow>
        <DropdownMenuPortal>
          <DropdownMenuSubContent alignOffset={40} sideOffset={-80} key={website.id}>
            <DropdownMenuLabel>Countries</DropdownMenuLabel>

            {Object.values(groupedCampaigns).map((campaign) => (
              <CampaignItem website={website} campaign={campaign} key={campaign.id} handleClick={handleClick} />
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  )
}

const CampaignItem = ({ campaign, website, handleClick }: { campaign: GoogleSearchCampaign, website: WebsitesArrayType, handleClick: (data: any) => void }) => {
  // console.log('campaigns', campaign)

  if (campaign.location?.length === 0 || !campaign.location) {
    return (
      <DropdownMenuItem onClick={() => handleClick(campaign)}>
        {website.websiteName} {campaign.country}
      </DropdownMenuItem>
    )
  }
  return (
    <DropdownMenuGroup key={campaign.id}>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger onClick={() => handleClick(campaign)}>
          <p>{website.websiteName} {campaign.country}</p>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuLabel>Locations</DropdownMenuLabel>
            {/* @ts-ignore -- we pushed a custom campaign as a location instead of the standard string that is in the database schema */}
            {campaign.location.map(locationCampaign => (
              <DropdownMenuItem key={locationCampaign.id} onClick={() => handleClick(locationCampaign)}>
                {`${website.websiteName} ${campaign.country}, ${locationCampaign.location.split(',')[0]}`}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  )
}

export default TestWebsiteSelectionButton;