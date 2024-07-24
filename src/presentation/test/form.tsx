'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { DayOfWeek, TestSchemaType } from "./schema"
import { GoogleSearchLocation } from "@/domain/models/serperApi"
import { testUseCase } from "./useCase"
import { LOCATIONS } from "../components/google-search-campaign/location-constant"

import React, { useState, FC, CSSProperties, useEffect } from "react";
import { Search } from "lucide-react"
import { FixedSizeList as List } from 'react-window';



import { InputFieldApp, InputFieldAppWithIcon } from "@/presentation/components/ui/inputFields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/ui/select";
import { GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS } from "../components/google-search-campaign/form-options"



export const TestForm = () => {


  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TestSchemaType>({})

  // console.log(LOCATIONS[0])

  useEffect(() => {
    setValue('location', LOCATIONS[0])
  }, [])

  const onSubmit: SubmitHandler<TestSchemaType> = async (data: TestSchemaType) => {
    console.log(data)

    const res = await testUseCase(locationObject)
    console.log(res)

    reset()
  }

  const locationObject = {
    campaignName: "Test Campaign",
    language: {
      "value": "en",
      "label": "English",
      "criterionId": 1000
    },
    location: {
      "name": "Afghanistan",
      "canonicalName": "Afghanistan",
      "googleId": 2004,
      "countryCode": "AF",
      "targetType": "Country"
    },
    country: {
      "value": "AF",
      "label": "Afghanistan",
      "criterionId": 204
    },
    specificDaysOfWeek: ["MONDAY", "TUESDAY", "WEDNESDAY"] as DayOfWeek[],
    keywords: "Test, Campaign"
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 text-gray-800 font-medium"
    >
      <p>Campaign Name</p>
      <InputFieldApp
        type="text"
        placeholder="Google Search DE"
        // required
        {...register("campaignName", { required: true })}
      />
      {errors.campaignName && <ErrorField error={"* A Name is Required"} />}

      <p className="mt-7">Language</p>
      <Controller
        name='language'
        control={control}
        render={({ field }) => (
          <LocationSearchBar
            placeholder="language"
            data={GOOGLE_SEARCH_CAMPAIGN_LANGUAGE_OPTIONS}
            onLocationSelect={(language) => setValue('language', language)}
            width={300}
          // onWordChange={(word) => console.log(word)}
          // initialLocation={LOCATIONS[0]}
          />
        )}
      />
      {errors.language && <ErrorField error={"* Language is Required"} />}

      <Controller
        name='location'
        control={control}
        render={({ field }) => (
          <LocationSearchBar<GoogleSearchLocation>
            placeholder="Location"
            data={LOCATIONS}
            onLocationSelect={(location) => setValue('location', location)}
            width={300}
            // onWordChange={(word) => console.log(word)}
            initialLocation={LOCATIONS[0]}
          />
        )}
      />

      <button type="submit">Submit</button>
    </form>
  )
}

const ErrorField = ({ error }: { error: string }) => {
  return <span className="text-red-500 text-xs">{error}</span>;
};


interface Item {
  name: string;
  googleId: number;
  countryCode: string;
}

interface SearchBarProps<T extends Item> {
  placeholder: string;
  data: T[];
  onLocationSelect: (location: T) => void;
  width: number;
  // onWordChange: (word: string) => void;
  initialValue?: T;
}

function LocationSearchBar<T extends Item>({ placeholder, data, onLocationSelect, width, initialValue }: SearchBarProps<T>) {
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [wordEntered, setWordEntered] = useState(initialValue?.name || "");

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    // onWordChange(searchWord);
    const newFilter = data.filter((value: T) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  function handleSelectItem(item: T) {
    setWordEntered(item.name);
    setFilteredData([]);
    onLocationSelect(item);
  };

  const listStyles: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 2,
    zIndex: 10,
    background: filteredData.length !== 0 ? 'white' : 'transparent',
    visibility: filteredData.length !== 0 ? 'visible' : 'hidden',
    // borderRadius: '12px',
    border: '1px solid #dadcff',
  };

  return (
    <div className={`w-[${width}px]`}>
      <CustomInput
        placeholder={placeholder}
        wordEntered={wordEntered}
        handleFilter={handleFilter}
      />
      <div className="relative">
        <List
          height={Math.min(filteredData.length * 40, 400)}
          itemCount={filteredData.length}
          itemSize={35}
          width={width}
          itemData={filteredData}
          style={listStyles}
          className="scroll custom-scrollbar"

        >
          {({ index, style }) => {
            const listItemStyles = {
              ...style,
              padding: '10px',
              height: '40px',
            }
            const item = filteredData[index];
            return (

              <div
                className='flex justify-between pr-2 bg-white '
                style={listItemStyles}
                onClick={() => handleSelectItem(item)}
              >
                <p>{item.name}</p>
                <div className='flex gap-2'>
                  {item.targetType && <p>{item.targetType}</p>}
                  <p>{item.countryCode}</p>
                </div>
              </div>
            )
          }}
        </List>
      </div>
    </div>
  );
}


interface CustomInputProps {
  placeholder: string;
  wordEntered: string;
  handleFilter: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: FC<CustomInputProps> = ({ placeholder, wordEntered, handleFilter }) => {

  return (
    <InputFieldAppWithIcon
      Icon={Search}
      type="text"
      placeholder={placeholder}
      value={wordEntered}
      onChange={handleFilter}
    />
  )
};

CustomInput.displayName = 'CustomInput';



export default LocationSearchBar;