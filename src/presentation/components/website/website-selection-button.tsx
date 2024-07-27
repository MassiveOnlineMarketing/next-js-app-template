"use client";

import { useEffect, useState } from "react";

import { Website } from "@/domain/_entities/Website";
import { useWebsiteDetailsStore } from "@/presentation/stores/website-details-store";

// Utils
import { cn } from "@/presentation/lib/utils";

// Components
import { Button } from "@/presentation/components/ui/button";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/presentation/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/presentation/components/ui/popover";

// Assets
import {
  ChevronDownIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";

import CreateWebsiteFormDialog from "./website-form-dialog";

const WebsiteSelectionButton = () => {
  const currentWebsite = useWebsiteDetailsStore((state) => state.websiteDetails);
  const setSelectedWebsite = useWebsiteDetailsStore((state) => state.setWebsiteDetails);
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
      variant="glass"
      size="sm"
      className="w-[350px] justify-start px-3 py-3 text-base leading-6 font-medium"
    >
      <CubeTransparentIcon className="h-6 w-6 text-gray-700 " />
      <span className="text-gray-800">Website: </span>
      <span className="text-gray-500">
        {isLoading ? "Loading" : "+ Setup website"}
      </span>
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
      <PopoverTrigger asChild>
        <Button
          variant="glass"
          size="sm"
          className="w-[350px] justify-start px-3 py-3 text-base leading-6 font-medium"
        >
          <CubeTransparentIcon className="h-6 w-6 text-gray-700 " />
          <span className="text-gray-800">Website: </span>
          <span className="text-gray-500">
            {currentWebsite
              ? currentWebsite.websiteName
              : "Select website..."}
          </span>
          <ChevronDownIcon className="ml-auto h-4 w-4 text-gray-400" />
        </Button>
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