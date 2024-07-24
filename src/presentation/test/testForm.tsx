'use'

// pages/index.tsx
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Search from './TestSearchBarTwo';
import { LOCATIONS } from '../components/google-search-campaign/location-constant';
import { GoogleSearchLocation } from '@/domain/models/serperApi';
import { TestSchemaType } from "./schema";
import { GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS, GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS } from '../components/google-search-campaign/form-options';

export interface FormValues {
  location: GoogleSearchLocation;
}

const TestFormTwo: React.FC = () => {
  const { handleSubmit, control, setValue, watch } = useForm<TestSchemaType>();
  const onSubmit: SubmitHandler<TestSchemaType> = (data) => console.log(data);
  console.log('redner')

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


  return (
    <div>
      <h1>Location Search Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='text-gray-800'>

        <p className="mt-7">Language</p>
        <Search
          items={GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS}
          control={control}
          setValue={setValue}
          displayField="name"
          fieldName="language"
          placeholder="Search language..."
        />

        <p className="mt-7">Location</p>
        <Search
          items={LOCATIONS}
          control={control}
          setValue={setValue}
          displayField="name"
          fieldName="location"
          placeholder="Search location..."
        />

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
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TestFormTwo;
