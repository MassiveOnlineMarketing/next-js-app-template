"use client";

import { useEffect, useState } from "react";

import { Website } from "@/domain/_entities/Website";
import { useWebsiteDetailsStore } from "@/presentation/stores/website-details-store";
import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";

// Utils
import { getFaviconUrl } from "@/presentation/lib/utils";
import { cn } from "@/presentation/components/utils";
import { getGoogleSearchCampaignByWebsiteId } from "@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignByWebsiteId";

// Components
import CreateWebsiteFormDialog from "./website-form-dialog";

import { Button } from "@/presentation/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/presentation/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/presentation/components/ui/popover";

// Assets
import { ChevronDownIcon, CubeTransparentIcon } from "@heroicons/react/24/outline";


const WebsiteSelectionButton = () => {
  const currentWebsite = useWebsiteDetailsStore((state) => state.websiteDetails);
  const setSelectedWebsite = useWebsiteDetailsStore((state) => state.setWebsiteDetails);
  const setGoogleSearchCampaigns = useGoogleSearchCampaignDetailsStore((state) => state.setCampaigns);
  const websites = useWebsiteDetailsStore((state) => state.websites);

  // load website details on mount
  useEffect(() => {
    const sessionDetails = sessionStorage.getItem("websiteDetails");
    if (sessionDetails && !currentWebsite) {
      setSelectedWebsite(JSON.parse(sessionDetails));
    }
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [websiteDialogOpen, setWebsiteDialogOpen] = useState(false);

  // load website details on mount
  useEffect(() => {
    if (websites !== null) {
      setIsLoading(false);
    }
  }, [websites])



  // Set the google search campaigns for the current website
  useEffect(() => {
    fetchProjects();
  }, [currentWebsite]);

  const fetchProjects = async () => {
    if (!currentWebsite) return;
    const searchProjects = await getGoogleSearchCampaignByWebsiteId(currentWebsite.id);
    setGoogleSearchCampaigns(searchProjects.data ?? []); 
  };



  return (
    <>
      {(!websites || isLoading === true || websites.length === 0) && (
        <LoadingAndNoWebsiteButton
          isLoading={isLoading}
          setWebsiteDialogOpen={setWebsiteDialogOpen}
        />
      )}
      {websites && websites.length > 0 && (
        <WebsiteSelectionButtonn
          setSelectedWebsite={setSelectedWebsite}
          setWebsiteDialogOpen={setWebsiteDialogOpen}
          currentWebsite={currentWebsite}
          websiteList={websites}
        />
      )}

      <CreateWebsiteFormDialog
        open={websiteDialogOpen}
        setOpen={setWebsiteDialogOpen}
      />
    </>
  )
};

export default WebsiteSelectionButton;


type LoadingAndNoWebsiteButtonProps = {
  isLoading: boolean;
  setWebsiteDialogOpen: (value: boolean) => void;
}

const LoadingAndNoWebsiteButton = ({ isLoading, setWebsiteDialogOpen }: LoadingAndNoWebsiteButtonProps) => {
  return (
    <Button
      {...(isLoading ? { disabled: true } : {})}
      onClick={() => setWebsiteDialogOpen(true)}
      size="sm"
      className="w-[350px] justify-start px-3 py-3 flex items-center gap-5 text-base leading-6 font-medium"
    >
      <div className="p-3 w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center">

        <CubeTransparentIcon className="h-6 w-6 text-gray-700" />

      </div>
      <div className="text-left">
        <p className="text-gray-800">Loading</p>
        <p className="text-gray-500">...</p>
      </div>
      <ChevronDownIcon className="ml-auto h-4 w-4 text-gray-400" />
    </Button>
  )
}

type WebsiteSelectionProps = {
  setSelectedWebsite: (website: Website) => void;
  setWebsiteDialogOpen: (value: boolean) => void;
  currentWebsite: Website | undefined;
  websiteList: Website[];
}

const WebsiteSelectionButtonn = ({ setSelectedWebsite, setWebsiteDialogOpen, currentWebsite, websiteList }: WebsiteSelectionProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleSelectWebsite = (website: Website) => {
    setSelectedWebsite(website);
    setPopoverOpen(false);
  }


  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger>
        {/* <Button
          variant="glass"
          size="sm"
          className="w-[350px] justify-start px-3 py-3 text-base leading-6 font-medium"
        > */}
        <div className="w-[350px] px-3 py-3 flex items-center justify-start gap-5 text-base leading-6 font-medium">
          <div className="p-3 w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center">
            {
              currentWebsite ? (
                <img src={getFaviconUrl(currentWebsite.domainUrl)} width={32} height={32} alt='favicon' />
              ) : (
                <CubeTransparentIcon className="h-6 w-6 text-gray-700" />
              )
            }
          </div>
          <div className="text-left">
            <p className="text-gray-800">{currentWebsite ? currentWebsite.websiteName : 'Website'} </p>
            <p className="text-gray-500">{currentWebsite ? currentWebsite.domainUrl : "Select website..."}</p>
          </div>
          <ChevronDownIcon className="ml-auto h-4 w-4 text-gray-400" />
        </div>
        {/* </Button> */}
      </PopoverTrigger>
      <PopoverContent className="w-[350px] bg-primary-50 p-0">
        <Command>
          <CommandInput placeholder="Search website..." />
          <CommandGroup>
            {websiteList.map((website) => (
              <CommandItem
                key={website.id}
                value={website.websiteName}
                className={cn(
                  "px-6 py-[16px]",
                  website.id === currentWebsite?.id && "bg-primary-50",
                )}
                onSelect={() => handleSelectWebsite(website)}
              >
                {website.websiteName}
              </CommandItem>
            ))}
            <CommandItem
              className="px-6 py-[16px]"
              onSelect={() => setWebsiteDialogOpen(true)}
            >
              Add new Website
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )

}