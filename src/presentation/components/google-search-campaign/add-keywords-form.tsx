"use client";

import React from "react";
import { useForm } from "react-hook-form";

import { GoogleSearchCampaignKeywordsSchemaType } from "@/application/schemas/googleSearchCampaignSchema";

import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import useGoogleSearchCampaignOpperations from "@/presentation/hooks/useGoogleSearchCampaignOpperations";

// components
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTriggerNoButton,
// } from "@/website/features/dialog/dialog";
import { TextareaApp } from "@/presentation/components/ui/inputFields";

/**
 * Component for adding keywords to a Google search campaign.
 *
 * @param children - The children of the component.
 * @param buttonClassName - The class name of the button.
 * @returns The JSX element for adding keywords to a Google search campaign.
 */
const AddKeywordsFrom = ({
  children,
  buttonClassName,
}: {
  children: React.ReactNode;
  buttonClassName?: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const currentGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore(
    (state) => state.campaignDetails
  );
  const { handleAddNewKeyword, isLoading } =
    useGoogleSearchCampaignOpperations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoogleSearchCampaignKeywordsSchemaType>({});

  const onSubmit = async (data: GoogleSearchCampaignKeywordsSchemaType) => {
    if (!currentGoogleSearchCampaign) {
      return;
    }

    const res = await handleAddNewKeyword(data, currentGoogleSearchCampaign);
    if (res.success) {
      reset();
    }
    setOpen(false);
  };

  return (
    <>
      {/* <Dialog open={open} onOpenChange={setOpen}>
        <DialogTriggerNoButton
          className={buttonClassName}
          onClick={() => setOpen(true)}
        >
          {children}
        </DialogTriggerNoButton>
        <DialogContent>
          <DialogHeader> */}
      <h2 className="font-medium text-2xl text-gray-800">
        Add Keywords to Campaign
      </h2>
      <p className="font-medium text-base text-gray-500 pt-[4px]">
        Please enter the keywords you want to track separated by line.
      </p>
      {/* </DialogHeader> */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <TextareaApp
          label="Keywords"
          rows={5}
          placeholder="Enter keywords..."
          {...register("keywords")}
        />
        {/* <textarea
              className="border-2 border-black"
              rows={10}
              {...register("keywords")}
            /> */}
        <button
          disabled={isLoading}
          type="submit"
          className="mt-8 px-6 py-2 w-fit flex mx-auto rounded-lg text-lg font-semibold"
        >
          Add
        </button>
      </form>
      {/* </DialogContent>
      </Dialog> */}
    </>
  );
};

export default AddKeywordsFrom;
