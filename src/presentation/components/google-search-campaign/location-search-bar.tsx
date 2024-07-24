'use client';

import React, { useState, FC, CSSProperties } from "react";
import { Search } from "lucide-react"
import { FixedSizeList as List } from 'react-window';
import { InputFieldAppWithIcon } from "@/presentation/components/ui/inputFields";
import { GoogleSearchLocation } from "@/domain/models/serperApi";

interface SearchBarProps {
  placeholder: string;
  data: GoogleSearchLocation[];
  onLocationSelect: (location: GoogleSearchLocation) => void;
  width: number;
  onWordChange: (word: string) => void;
  initialLocation: string;
}

function LocationSearchBar({ placeholder, data, onLocationSelect, width, onWordChange, initialLocation }: SearchBarProps) {
  const [filteredData, setFilteredData] = useState<GoogleSearchLocation[]>([]);
  const [wordEntered, setWordEntered] = useState(initialLocation || "");

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    onWordChange(searchWord);
    const newFilter = data.filter((value) => {
      return value.name.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const handleSelectItem = (item: GoogleSearchLocation) => {
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
            return (
              <CustomListItem
                index={index}
                style={listItemStyles}
                data={filteredData}
                onSelectItem={handleSelectItem}
              />
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


interface CustomListItemProps {
  index: number;
  style: React.CSSProperties;
  data: GoogleSearchLocation[];
  onSelectItem: (item: GoogleSearchLocation) => void;
}

const CustomListItem: FC<CustomListItemProps> = React.memo(({ index, style, data, onSelectItem }) => {
  const item = data[index];
  return (
    <div
      className='flex justify-between pr-2 bg-white '
      style={style}
      onClick={() => onSelectItem(item)}
    >
      <p>{item.name}</p>
      <div className='flex gap-2'>
        <p>{item.targetType}</p>
        <p>{item.countryCode}</p>
      </div>
    </div>
  )
});

CustomListItem.displayName = 'CustomListItem';


export default LocationSearchBar;