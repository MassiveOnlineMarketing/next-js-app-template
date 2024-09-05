'use client';

import React, { useState } from 'react'

import { GoogleSearchCampaign } from '@/domain/serpTracker/enitities/GoogleSearchCampaign';

import useLoadWebsiteDetails, { WebsitesArrayType } from './useLoadWebsiteDetails';
import { useWebsiteDetailsStore } from '@/presentation/stores/website-details-store';
import { useGoogleSearchCampaignDetailsStore } from '@/presentation/stores/google-search-campaign-store';

import { getFaviconUrl } from '@/presentation/lib/utils';
import { cn } from '../utils';

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSubTriggerWithoutArrow, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu';

import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpDownIcon, MapPinIcon } from '@heroicons/react/20/solid';
import { useCurrentUser } from '@/presentation/auth/hooks/user-current-user';
import useWebsiteSelectionChecker from './useWebsiteSelectionChecker';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { capitalizeFirstLetter } from '@/presentation/utils/stringUtils';

const TestWebsiteSelectionButton = () => {
  const selectedWebsite = useWebsiteDetailsStore((state) => state.websiteDetails);
  const setWebsiteById = useWebsiteDetailsStore((state) => state.setWebsiteById);

  const selectedGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore((state) => state.campaignDetails);
  const setGoogleSearchCampaignById = useGoogleSearchCampaignDetailsStore((state) => state.setCampaignDetailsById);

  const { isLoading, websiteWithGoogleSearchCampaigns } = useLoadWebsiteDetails();
  useWebsiteSelectionChecker();

  const user = useCurrentUser();


  const handleClick = (data: any) => {
    console.log('clicked', data)
    if (!data.id) {
      console.log('campaing needs setting up')
      return;
    }

    if (!user?.id) {
      console.log('no user id')
      return
    }

    if (data.websiteId) {
      console.log('google search campaign', data)
      setWebsiteById(data.websiteId, user?.id)
      setGoogleSearchCampaignById(data.id)
      setPopoverOpen(false)
    } else {
      console.log('website', data)
      setWebsiteById(data.id, user?.id)
      setPopoverOpen(false)
    }
  }

  const [hoveredWebsite, setHoveredWebsite] = useState<WebsitesArrayType | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  if (isLoading === true) {
    return (
      <div className='flex flex-col p-[6px] rounded-md border dark:border-dark-stroke bg-white dark:bg-dark-bg-light w-[292px]'>
        <WebsiteSelectorMock label='Loading...' />
        <LocationSelectorMock label='Loading...' />
      </div>
    )
  }

  // no website with google search campaigns
  const handleCreateWebsite = () => {
    console.log('create website')
  }
  // console.log('websiteWithGoogleSearchCampaigns', websiteWithGoogleSearchCampaigns)
  if (websiteWithGoogleSearchCampaigns.length === 0) {
    return (
      <div className='flex flex-col p-[6px] rounded-md border dark:border-dark-stroke bg-white dark:bg-dark-bg-light w-[292px]'>
        <WebsiteSelectorMock label='Click to setup website' onClick={handleCreateWebsite} />
        <LocationSelectorMock label='No location to select' />
      </div>
    )
  }

  // no website selected
  if (!selectedWebsite) {
    return (
      <div className='flex flex-col p-[6px] rounded-md border dark:border-dark-stroke bg-white dark:bg-dark-bg-light w-[292px]'>
        <Popover onOpenChange={setPopoverOpen} open={popoverOpen} >
          <PopoverTrigger className='flex items-center mb-2'>
            <CubeTransparentIcon className="h-9 w-9 text-gray-700" />
            <p className='pl-3 text-light-text-dark dark:text-dark-text-light'>Select Website</p>
            <ChevronUpDownIcon className='min-w-5 h-5 ml-auto mr-[6px] text-light-text-light dark:text-dark-text-dark' />
          </PopoverTrigger>
          <WebsitePopover
            websiteWithGoogleSearchCampaigns={websiteWithGoogleSearchCampaigns}
            hoveredWebsite={hoveredWebsite}
            setHoveredWebsite={setHoveredWebsite}
            handleClick={handleClick}
          />
        </Popover>
        <LocationSelectorMock label='No location to select' />
      </div>
    )
  }


  // Have selected website, possible no location, then setup Location selector
  const handleCreateLocation = () => {
    console.log('create location')
  }
  return (
    <div className='flex flex-col p-[6px] rounded-md border dark:border-dark-stroke bg-white dark:bg-dark-bg-light w-[292px]'>
      {/* Website selector */}
      <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
        <PopoverTrigger className='flex items-center mb-2'>
          <img src={getFaviconUrl(selectedWebsite?.domainUrl)} width={36} height={36} alt='favicon' className='border dark:border-dark-stroke rounded-[4px]' />
          <p className='pl-3 text-light-text-dark dark:text-dark-text-light'>{selectedWebsite.websiteName}</p>
          <ChevronUpDownIcon className='min-w-5 h-5 ml-auto mr-[6px] text-light-text-light dark:text-dark-text-dark' />
        </PopoverTrigger>
        <WebsitePopover
          websiteWithGoogleSearchCampaigns={websiteWithGoogleSearchCampaigns}
          hoveredWebsite={hoveredWebsite}
          setHoveredWebsite={setHoveredWebsite}
          handleClick={handleClick}
        />
      </Popover>


      {/* Location selector */}
      {selectedWebsite && websiteWithGoogleSearchCampaigns.filter(website => website.id === selectedWebsite.id).length > 0 &&
        websiteWithGoogleSearchCampaigns.filter(website => website.id === selectedWebsite.id)[0].googleSearchCampaign.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger className='px-3 py-2 bg-p-25 dark:bg-dark-bg-light text-light-text-light dark:text-dark-text-dark text-left flex items-center gap-[6px]'>
            <MapPinIcon className='min-w-5 h-5 text-slate-400 dark:text-dark-text-dark' />
            <p className='text-nowrap text-sm'>
              {selectedGoogleSearchCampaign?.location ? `${selectedGoogleSearchCampaign.country} ${selectedGoogleSearchCampaign.location.split(',')[0]}` : (
                selectedGoogleSearchCampaign?.country ? selectedGoogleSearchCampaign.country : 'Select Location'
              )}
            </p>
            <div className='w-full h-[1px] bg-p-100 dark:bg-dark-stroke'></div>
            <ChevronDownIcon className='min-w-5 h-5 ml-auto text-light-text-light dark:text-dark-text-dark' />
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" className=" w-[292px]">
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
        <LocationSelectorMock label='Click to setup Location' onClick={handleCreateLocation} />
      )}
    </div>
  )
}


const WebsiteSelectorMock = ({ label, onClick }: { label: string, onClick?: () => void }) => {
  return (
    <div
      className={cn(
        'flex items-center mb-2',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <CubeTransparentIcon className="h-9 w-9 text-gray-700" />
      <p className='pl-3 text-light-text-dark dark:text-dark-text-light'>{label}</p>
      <ChevronUpDownIcon className='min-w-5 h-5 ml-auto mr-[6px] text-light-text-light dark:text-dark-text-dark' />
    </div>
  )
}

const LocationSelectorMock = ({ label, onClick }: { label: string, onClick?: () => void }) => {
  return (
    <div
      className={cn(
        'px-3 py-2 bg-p-25 dark:bg-dark-bg-light dark:text-dark-text-dark text-left flex items-center gap-[6px] rounded-md',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <MapPinIcon className='min-w-5 h-5 text-slate-400 dark:text-dark-text-dark' />
      <p className='text-nowrap text-sm'>
        {label}
      </p>
      <div className='w-full h-[1px] bg-p-100 dark:bg-dark-stroke'></div>
      <ChevronDownIcon className='min-w-5 h-5 ml-auto text-light-text-light dark:text-dark-text-dark' />
    </div>
  )
}

const WebsitePopover = ({
  websiteWithGoogleSearchCampaigns,
  hoveredWebsite,
  setHoveredWebsite,
  handleClick
}: {
  websiteWithGoogleSearchCampaigns: WebsitesArrayType[],
  hoveredWebsite: WebsitesArrayType | null,
  setHoveredWebsite: React.Dispatch<React.SetStateAction<WebsitesArrayType | null>>,
  handleClick: (data: any) => void
}) => {

  return (
    <PopoverContent side="right" className="w-[600px] h-[330px] translate-y-1/3 grid grid-cols-2">
      <div className='border-r'>
        {websiteWithGoogleSearchCampaigns.map((website) => (
          <div
            key={website.id}
            className='flex gap-2 items-center  cursor-pointer'
            onMouseEnter={() => setHoveredWebsite(website)}
            onClick={() => handleClick(website)}
          >
            <img src={getFaviconUrl(website.domainUrl)} width={32} height={32} alt='favicon' className='w-8 h-8' />
            <div>
              <p>{website.websiteName}</p>
              <p className='text-sm'>{website.domainUrl}</p>
            </div>
          </div>
        ))}
        <p className='pt-4'>button to add</p>
      </div>
      <div>
        {hoveredWebsite ? (
          <div>
            <h3 className='text-lg'>{capitalizeFirstLetter(hoveredWebsite.websiteName)}</h3>
            <div>
              {/* // <p key={campaign.id}>{`${hoveredWebsite.websiteName} ${campaign.country}, ${campaign.location.split(',')[0]}`}</p> */}
              {renderCampaigns(hoveredWebsite.googleSearchCampaign, handleClick)}
            </div>
            <p className='pt-4'>button to add</p>
          </div>
        ) : (
          <p>Hover over a website to see its Google Search Campaigns</p>
        )}
      </div>
    </PopoverContent>
  )
}

const renderCampaigns = (campaigns: GoogleSearchCampaign[], handleClick: (data: any) => void) => {
  // Sort campaigns by country and location
  const sortedCampaigns = campaigns.sort((a, b) => {
    if (a.country < b.country) return -1;
    if (a.country > b.country) return 1;
    if (a.location === null) return -1;
    if (b.location === null) return 1;
    return a.location.localeCompare(b.location);
  });

  // Group campaigns by country
  const groupedCampaigns = sortedCampaigns.reduce<Record<string, GoogleSearchCampaign[]>>((acc, campaign) => {
    if (!acc[campaign.country]) {
      acc[campaign.country] = [];
    }
    acc[campaign.country].push(campaign);
    return acc;
  }, {});

  // Render campaigns
  return Object.keys(groupedCampaigns).map((country) => (
    <div key={country} >
      {groupedCampaigns[country].map((campaign) => {
        if (!campaign.location) {
          return (
            <div key={campaign.id} className='cursor-pointer mt-2' onClick={() => handleClick(campaign)}>
              <p >{`${campaign.country}`}</p>
            </div>
          );
        }
        return (
          <div key={campaign.id} className='cursor-pointer' onClick={() => handleClick(campaign)}>
            <p className='pl-4' >{`${campaign.country}, ${campaign.location.split(',')[0]}`}</p>
          </div>
        );
      })}
    </div>
  ));
};


export default TestWebsiteSelectionButton