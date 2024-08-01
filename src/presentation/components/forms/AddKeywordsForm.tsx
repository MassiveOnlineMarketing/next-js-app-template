"use client";

import React from "react";
import { useForm } from "react-hook-form";

import { GoogleSearchCampaignKeywordsSchemaType } from "@/application/schemas/googleSearchCampaignSchema";

import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import useGoogleSearchCampaignOpperations from "@/presentation/hooks/serp/useGoogleSearchCampaignOpperations";

import { TextareaApp } from "@/presentation/components/ui/inputFields";

/**
 * Component for adding keywords to a Google search campaign.
 *
 * @param children - The children of the component.
 * @param buttonClassName - The class name of the button.
 * @returns The JSX element for adding keywords to a Google search campaign.
 */
const AddKeywordsFrom = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {

  const currentGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore((state) => state.campaignDetails);
  const { handleAddNewKeyword, isLoading } = useGoogleSearchCampaignOpperations();
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <TextareaApp
        label="Keywords"
        rows={5}
        placeholder="Enter keywords..."
        {...register("keywords")}
      />

      <button
        disabled={isLoading}
        type="submit"
        className="mt-8 px-6 py-2 w-fit flex mx-auto rounded-lg text-lg font-semibold"
      >
        Add
      </button>
    </form>
  );
};

export default AddKeywordsFrom;
