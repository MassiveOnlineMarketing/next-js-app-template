'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Controller, Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FixedSizeList as List } from 'react-window';
import useDebounce from './useDebounce';
import { GOOGLE_SEARCH_CAMPAIGN_CONTRIES_OPTIONS } from '../components/google-search-campaign/form-options';

interface SearchItem {
  name: string;
  [key: string]: any;
}

interface SearchProps<T> {
  items: T[];
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  displayField: keyof T;
  fieldName: string;
  placeholder?: string;
  disabled?: boolean;
  displayValue?: string;
}

const Search: React.FC<SearchProps<SearchItem>> = ({ items, control, setValue, displayField, fieldName, placeholder = "Search...", disabled, displayValue }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [filteredItems, setFilteredItems] = useState(items);
  const [showList, setShowList] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    if (debouncedQuery) {
      setFilteredItems(
        items.filter(item =>
          item[displayField].toLowerCase().includes(debouncedQuery.toLowerCase())
        )
      );
    } else {
      setFilteredItems(items);
    }
  }, [debouncedQuery, items, displayField]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setQuery(inputValue);
    if (inputValue === '') {
      setValue(fieldName, {});
    }
  };

  const handleItemClick = (item: SearchItem) => {
    setValue(fieldName, item);
    setQuery(item[displayField]);
    setShowList(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setShowList(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  

  
  const listHeight = Math.min(filteredItems.length * 35, 300);
  return (
    <div className='relative w-[300px]' ref={containerRef}>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <div className='relative'>
            <input
              {...field}
              type="text"
              placeholder={placeholder}
              onFocus={() => setShowList(true)}
              onChange={handleInputChange}
              value={displayValue ? displayValue : query}
              className='w-full p-2 box-border'
              disabled={disabled}
            />
            {showList && (
              <div className='absolute top-12 left-0 right-0 bg-white border border-red-500 z-10'>
                <List
                  height={listHeight}
                  itemCount={filteredItems.length}
                  itemSize={35}
                  width={300}
                >
                  {({ index, style }) => (
                    <div
                      style={style}
                      className='p-2 border-b cursor-pointer'
                      onClick={() => handleItemClick(filteredItems[index])}
                    >
                      <p>{filteredItems[index][displayField]}</p>
                    </div>
                  )}
                </List>
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Search;
