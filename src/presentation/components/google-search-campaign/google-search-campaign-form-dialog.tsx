"use client";

// External libraries
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

// Internal types
import { GoogleSearchCampaignSchemaType } from "@/application/schemas/googleSearchCampaignSchema";
import { GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS, DayOfWeek, DAYS_OF_WEEK, GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS } from "./form-options";
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { Website } from "@/domain/_entities/Website";
import { GoogleSearchLocation } from "@/domain/models/serperApi";


import useGoogleSearchCampaignOpperations from "@/presentation/hooks/useGoogleSearchCampaignOpperations";
import { getCompetitorsByGoogleSearchCampaignId } from "@/application/useCases/googleSearchCampaign/getCompetitorsByGoogleSearchCampaignId";

// Components
import { Dialog, DialogContent, DialogHeader } from "@/presentation/components/common/dialog";
import { InputFieldApp, TestInput, TextareaApp } from "@/presentation/components/ui/inputFields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";

import { PlusIcon } from "@heroicons/react/24/outline";

// Location search bar
import LocationSearchBar from "./location-search-bar";
import { LOCATIONS } from "./location-constant";


interface GoogleSearchProjectFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  googleSearchCampaign?: GoogleSearchCampaign | null;
  website?: Website;
}
/**
 * GoogleSearchProjectFormDialog component represents a dialog for creating or updating a Google Search Campaign.
 *
 * @component
 * @example
 * <GoogleSearchProjectFormDialog
 *   open={true}
 *   setOpen={setOpen}
 *   googleSearchCampaign={googleSearchCampaign}
 *   website={website}
 * />
 *
 * @param {boolean} open - Determines whether the dialog is open or not.
 * @param {function} setOpen - Callback function to set the open state of the dialog.
 * @param {object} googleSearchCampaign - The Google Search Campaign object to be updated. If null, a new campaign will be created.
 * @param {object} website - The website object associated with the campaign.
 * @returns {JSX.Element} GoogleSearchProjectFormDialog component.
 */
const GoogleSearchProjectFormDialog: React.FC<GoogleSearchProjectFormDialogProps> = ({
  open,
  setOpen,
  googleSearchCampaign,
  website
}) => {
  const router = useRouter();
  const path = usePathname();

  const currentWebsite = website;
  const { handleCreateCampaign, handleUpdateCampaign, handleDeleteCampaign } = useGoogleSearchCampaignOpperations();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GoogleSearchCampaignSchemaType>({});

  useEffect(() => {
    if (open && googleSearchCampaign) {
      setValue("projectName", googleSearchCampaign.projectName);
      setValue("language", googleSearchCampaign.language);
      // setValue("specificDaysOfWeek", googleSearchCampaign.specificDaysOfWeek);
      setValue("country", googleSearchCampaign.country);

      console.log('googleSearchCampaign', googleSearchCampaign);
      if (googleSearchCampaign.location ) {
        const location = LOCATIONS.find((location: GoogleSearchLocation) => location.canonicalName === googleSearchCampaign.location);
        const updatedLocation = location || null;
        console.log('location', updatedLocation);
        
        setSelectedLocation(updatedLocation);
      }


      const fetchData = async () => {
        if (!googleSearchCampaign) return;
        const res = await getCompetitorsByGoogleSearchCampaignId(googleSearchCampaign.id);
        if (!res || !res.data) return;
        setFetchedCompetitors(res.data.map(competitor => competitor.domainUrl));
      };

      fetchData();
    }
  }, [open]);

  // TODO: Create reset function
  const onSubmit: SubmitHandler<GoogleSearchCampaignSchemaType> = async (data) => {
    if (!googleSearchCampaign) {
      // TODO: handle no current website there
      if (!currentWebsite) return;
      const res = await handleCreateCampaign(data, selectedLocation, currentWebsite.id, currentWebsite?.domainUrl, addedCompetitors);
      if (res?.success) {
        reset();
        setAddedCompetitors([]);
        setWordFromChild('');
        // Send user to the campaign route
        router.push(`/app/search/google-search/${res.campaignId}`);
        setOpen(false);
      }
    } else {
      const res = await handleUpdateCampaign(data, googleSearchCampaign?.id, addedCompetitors, removedCompetitors);
      if (res?.success) {
        setAddedCompetitors([]);
        setWordFromChild('');
        setRemovedCompetitors([]);
        reset();
        setOpen(false);
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
      reset();
      setWordFromChild('');
      setRemovedCompetitors([])
      setAddedCompetitors([]);
      setOpen(false);
    }
  }


  // Stuff for location
  const [wordFromChild, setWordFromChild] = React.useState("");
  const handleWordChangeFromChild = (word: string) => {
    setWordFromChild(word);
  };
  console.log('wordFromChild', wordFromChild);
  const [selectedLocation, setSelectedLocation] = React.useState<GoogleSearchLocation | null>(null);
  // Callback function to update the selected location
  const handleLocationSelect = (location: GoogleSearchLocation) => {
    setSelectedLocation(location);
    setValue("country", location.countryCode);
  };

  
  // Stuff for competitors 
  const [domainInput, setDomainInput] = React.useState('');
  const [fetchedCompetitors, setFetchedCompetitors] = React.useState<string[]>([]);
  const [addedCompetitors, setAddedCompetitors] = React.useState<string[]>([]);
  const [removedCompetitors, setRemovedCompetitors] = React.useState<string[]>([]);

  const handleAddCompetitor = () => {
    setAddedCompetitors(prev => [...prev, domainInput]);
    setRemovedCompetitors(prev => prev.filter(domain => domain !== domainInput));
    setDomainInput('');
  };

  const handleRemoveCompetitor = (domain: string) => {
    if (fetchedCompetitors.includes(domain)) {
      setRemovedCompetitors(prev => [...prev, domain]);
    } else {
      setAddedCompetitors(prev => prev.filter(d => d !== domain));
    }
  };

  // Combine and filter competitors
  const currentCompetitors = React.useMemo(() => {
    const combinedCompetitors = [...fetchedCompetitors, ...addedCompetitors];
    return combinedCompetitors.filter(domain => !removedCompetitors.includes(domain));
  }, [fetchedCompetitors, addedCompetitors, removedCompetitors]);

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <h2 className="font-medium text-2xl text-gray-800">
            {googleSearchCampaign
              ? `Update ${googleSearchCampaign.projectName}`
              : "Setup Google Search Campaign"}
          </h2>
          <p className="font-medium text-base text-gray-500 pt-[4px]">
            Please enter the details of your Campaign
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 text-gray-800 font-medium"
        >
          <p>Campaign Name</p>
          <InputFieldApp
            type="text"
            placeholder="Google Search DE"
            // required
            {...register("projectName", { required: true })}
          />
          {errors.projectName && <ErrorField error={"* A Name is Required"} />}

          <p className="mt-7">Language</p>
          <Controller
            name="language"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select a language"
                    className="placeholder-gray-400 text-gray-400"
                  />
                </SelectTrigger>
                <SelectContent>
                  {GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS.map((option) => {
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
          {errors.language && <ErrorField error={"* Language is Required"} />}

          <p className="mt-7">Location</p>
          <LocationSearchBar placeholder='Select Location' width={444} data={LOCATIONS} initialLocation={selectedLocation?.canonicalName || ''} onLocationSelect={handleLocationSelect} onWordChange={handleWordChangeFromChild} />

          <p className="mt-7">County</p>
          <Controller
            name="country"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} disabled={wordFromChild ? true : false}>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select a country"
                    className="placeholder-gray-400 text-gray-400"
                  />
                </SelectTrigger>
                <SelectContent>
                  {GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS.map((option) => {
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />
          {errors.country && <ErrorField error={"* Location is Required"} />}

          <p className="mt-7">Days we check the results</p>
          <div className="space-y-2 mt-2">
            <Controller
              name="specificDaysOfWeek"
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <>
                  {DAYS_OF_WEEK.map((day) => (
                    <>
                      <input
                        key={day.value}
                        type="checkbox"
                        {...restField}
                        value={day.value}
                        checked={!value || value.includes(day.value)}
                        onChange={(e) => {
                          const dayValue: DayOfWeek = e.target.value as DayOfWeek; // Cast to DayOfWeek
                          // Ensure value is treated as an array, defaulting to an empty array if undefined
                          const currentValue = value || [];
                          const updatedValue = e.target.checked
                            ? [...currentValue, dayValue] // Use currentValue here
                            : currentValue.filter((v) => v !== dayValue); // And here
                          onChange(updatedValue); // Update the form state
                        }}
                      />
                      <label htmlFor={day.value}>{day.label}</label>
                    </>
                  ))}
                </>
              )}
            />
          </div>


          <p className="mt-7">Competitors</p>
          <div className="flex gap-2">
            <InputFieldApp
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="https://www.example.com"
            />
            <button onClick={handleAddCompetitor} type="button" className="p-4 mt-3 rounded-xl border border-primary-100 h-fit"><PlusIcon className="w-6 h-6 text-gray-400 " /></button>
          </div>
          <div className="p-2 space-y-2">
            {currentCompetitors.map((domain, index) => (
              <div key={index} className="flex justify-between items-center">
                <p>{domain}</p>
                {/* TODO: Set styles */}
                <button type="button" onClick={() => handleRemoveCompetitor(domain)}>Remove</button>
              </div>
            ))}
          </div>

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

          <div className="flex justify-between mt-8">
            {googleSearchCampaign && (
              <button
                type="button"
                className="px-6 py-2 w-fit flex mx-auto rounded-lg text-lg font-semibold"
                onClick={onDelete}
              >
                Delete Campaign
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 w-fit flex mx-auto rounded-lg text-lg font-semibold"
            >
              {googleSearchCampaign ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleSearchProjectFormDialog;

const ErrorField = ({ error }: { error: string }) => {
  return <span className="text-red-500 text-xs">{error}</span>;
};
