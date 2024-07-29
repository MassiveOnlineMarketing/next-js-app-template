"use client";

// External libraries
import React
  from "react";
// Internal types
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { Website } from "@/domain/_entities/Website";

// Components
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/presentation/components/common/dialog";
import GoogleSearchCampaignForm from "../forms/GoogleSearchCampaignFrom";


interface GoogleSearchProjectFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  googleSearchCampaign?: GoogleSearchCampaign | null;
  website?: Website;
}

const GoogleSearchProjectFormDialog: React.FC<GoogleSearchProjectFormDialogProps> = ({
  open,
  setOpen,
  googleSearchCampaign,
  website
}) => {


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby="google-search-campaign-form-description" className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-medium text-2xl text-gray-800">
            {googleSearchCampaign
              ? `Update ${googleSearchCampaign.campaignName}`
              : "Setup Google Search Campaign"}
          </DialogTitle>
          <DialogDescription className='font-medium text-base text-gray-500 pt-[4px]'>
            Please enter the details of your Campaign
          </DialogDescription>
        </DialogHeader>

        <GoogleSearchCampaignForm open={open} setOpen={setOpen} googleSearchCampaign={googleSearchCampaign} website={website} />

      </DialogContent>
    </Dialog>
  );
};

export default GoogleSearchProjectFormDialog;