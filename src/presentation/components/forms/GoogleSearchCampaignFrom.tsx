"use client";

// External libraries
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Internal types
import { GoogleSearchCampaignSchema, GoogleSearchCampaignSchemaType } from "@/application/schemas/googleSearchCampaignSchema";
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { LOCATIONS } from '@/presentation/components/google-search-campaign/location-constant';
import { GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS, DayOfWeek, GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS, GoogleSearchLanguage, GoogleSearchCountry } from "@/presentation/components/google-search-campaign/form-options";
import { Website } from "@/domain/_entities/Website";
import { GoogleSearchLocation } from "@/domain/models/serperApi";

import useGoogleSearchCampaignOpperations from "@/presentation/hooks/useGoogleSearchCampaignOpperations";

// Components
import { InputFieldApp, TextareaApp } from "@/presentation/components/ui/inputFields";

import Search from '@/presentation/components/google-search-campaign/fields/Search';
import CompetitorsField from '@/presentation/components/google-search-campaign//fields/CompetitorField';
import DaysOfWeekField from '@/presentation/components/google-search-campaign//fields/DaysOfWeekField';


interface GoogleSearchProjectFormDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    googleSearchCampaign?: GoogleSearchCampaign | null;
    website?: Website;
}

const GoogleSearchCampaignForm: React.FC<GoogleSearchProjectFormDialogProps> = ({
    open,
    setOpen,
    googleSearchCampaign,
    website
}) => {

    const router = useRouter();
    const path = usePathname();
  
    const { isLoading, handleCreateCampaign, handleUpdateCampaign, handleDeleteCampaign } = useGoogleSearchCampaignOpperations();
  
    const { handleSubmit, control, setValue, watch, register, reset, formState: { errors } } = useForm<GoogleSearchCampaignSchemaType>({
      resolver: zodResolver(GoogleSearchCampaignSchema),
    });
  
    useEffect(() => {
      if (googleSearchCampaign) {
        setValue('campaignName', googleSearchCampaign.campaignName);
        setValue('specificDaysOfWeek', googleSearchCampaign.refreshDays as DayOfWeek[]);
      }
    }, [googleSearchCampaign]);
    const languageInitialValues = googleSearchCampaign ? GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS.find(option => option.googleId.toString() === googleSearchCampaign.languageCode) as GoogleSearchLanguage : undefined;
    const locationInitialValues = googleSearchCampaign ? LOCATIONS.find(option => option.canonicalName === googleSearchCampaign.location) as GoogleSearchLocation : undefined;
    const countryInitialValues = googleSearchCampaign ? GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS.find(option => option.countryCode === googleSearchCampaign.country) as GoogleSearchCountry : undefined;
  
  
  
  
    const onSubmit: SubmitHandler<GoogleSearchCampaignSchemaType> = async (data) => {
      if (!googleSearchCampaign) {
        const res = await handleCreateCampaign(data, website?.id, website?.gscUrl, website?.domainUrl, addedCompetitors);
        if (res?.success) {
          resetForm();
          router.push(`/app/search/google-search/${res.campaignId}`);
        }
      } else {
        const res = await handleUpdateCampaign(data, googleSearchCampaign.id, website?.gscUrl, addedCompetitors, removedCompetitors);
        if (res?.success) {
          resetForm();
        }
      }
    };
  
    const onDelete = async () => {
      if (!googleSearchCampaign) return;
      const res = await handleDeleteCampaign(googleSearchCampaign?.id);
      if (res?.success) {
        // Send user to the search page
        if (path.includes(googleSearchCampaign?.id)) {
          router.push("/app/search");
        }
        resetForm();
      }
    }
  
    function resetForm() {
      reset();
      resetCompetitors();
      setOpen(false);
    }
  
  
    // Stuff for location anc country
    const location = watch('location') as GoogleSearchLocation;
    const [disabledCountry, setDisabledCountry] = useState(false);
    const [query, setQuery] = useState('');
    // Set country if location is set
    useEffect(() => {
      if (location && location.countryCode) {
        const country = GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS.find(
          (option) => option.countryCode === location.countryCode
        );
        if (country) {
          setValue('country', country, { shouldValidate: true });
        }
      }
    }, [location, setValue]);
  
    useEffect(() => {
      if (location) {
        if (Object.keys(location).length === 0) {
          setDisabledCountry(false);
        } else {
          setQuery(GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS.find((option) => option.countryCode === location.countryCode)?.name as string);
          setDisabledCountry(true);
        }
      }
    }, [location]);
  
  
    // Stuff for competitors
    const [addedCompetitors, setAddedCompetitors] = useState<string[]>([]);
    const [removedCompetitors, setRemovedCompetitors] = useState<string[]>([]);
  
    const resetCompetitors = () => {
      setAddedCompetitors([]);
      setRemovedCompetitors([]);
    }
  

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='text-gray-800'>
          <p>Campaign Name</p>
          <InputFieldApp
            type="text"
            placeholder="Google Search DE"
            // required
            {...register("campaignName")}
          />
          {errors.campaignName && <p className="text-sm font-medium text-red-500 dark:text-red-900">{errors.campaignName.message}</p>}

          <p className="mt-7">Language</p>
          <Search
            items={GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS}
            control={control}
            setValue={setValue}
            displayField="name"
            fieldName="language"
            placeholder="Search language..."
            initialValues={languageInitialValues}
          />
          {errors.language && <p className="text-sm font-medium text-red-500 dark:text-red-900">{errors.language.message}</p>}


          <p className="mt-7">Location</p>
          <Search
            items={LOCATIONS}
            control={control}
            setValue={setValue}
            displayField="name"
            fieldName="location"
            placeholder="Search location..."
            initialValues={locationInitialValues}
          />
          {errors.location && <p className="text-sm font-medium text-red-500 dark:text-red-900">{errors.location.message}</p>}

          <p className="mt-7">Country</p>
          <Search
            items={GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS}
            control={control}
            setValue={setValue}
            displayField="name"
            fieldName="country"
            placeholder="Search country..."
            disabled={disabledCountry}
            displayValue={query}
            initialValues={countryInitialValues}
          />
          {errors.country && <p className="text-sm font-medium text-red-500 dark:text-red-900">{errors.country.message}</p>}

          <p className="mt-7">Competitors</p>
          <CompetitorsField
            addedCompetitors={addedCompetitors}
            removedCompetitors={removedCompetitors}
            setAddedCompetitors={setAddedCompetitors}
            setRemovedCompetitors={setRemovedCompetitors}
          />

          <p className="mt-7">Refresh</p>
          <DaysOfWeekField control={control} fieldName='specificDaysOfWeek' />

          {!googleSearchCampaign && (
            <>
              <p className="mt-7">Keywords</p>
              <TextareaApp
                rows={5}
                placeholder="Enter the keywords you want to track, seperated by enter."
                {...register("keywords")}
              />
            </>
          )}

          {/* TODO: Button styling */}
          <div className="flex justify-between mt-8">
            {googleSearchCampaign && (
              <button
                disabled={isLoading}
                type="button"
                className="px-6 py-2 w-fit flex mx-auto rounded-lg text-lg font-semibold"
                onClick={onDelete}
              >
                Delete Campaign
              </button>
            )}
            <button
              disabled={isLoading}
              type="submit"
              className="px-6 py-2 w-fit flex mx-auto rounded-lg text-lg font-semibold"
            >
              {googleSearchCampaign ? "Update" : "Create"}
            </button>
          </div>
        </form>
    )
}


export default GoogleSearchCampaignForm;