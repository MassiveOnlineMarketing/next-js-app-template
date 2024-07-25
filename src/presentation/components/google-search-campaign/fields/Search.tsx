'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useController, Control, UseFormSetValue } from 'react-hook-form';
import { FixedSizeList as List } from 'react-window';
import useDebounce from '@/presentation/hooks/useDebounce';

import { InputFieldApp } from '@/presentation/components/ui/inputFields';

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
  initialValues?: T;
}

/**
 * Search component for Google Search Campaign.
 *
 * @component
 * @param {Object[]} items - The list of items to search from.
 * @param {Object} control - The form control object from react-hook-form.
 * @param {Function} setValue - The function to set the value of the form field.
 * @param {string} displayField - The field to display in the search results.
 * @param {string} fieldName - The name of the form field.
 * @param {string} [placeholder="Search..."] - The placeholder text for the search input.
 * @param {Object} [initialValues=undefined] - The initial values for the search input.
 * @param {boolean} disabled - Whether the search input is disabled or not.
 * @param {string} displayValue - The value to display in the search input.
 * @returns {JSX.Element} The Search component.
 */
const Search: React.FC<SearchProps<SearchItem>> = ({ items, control, setValue, displayField, fieldName, placeholder = "Search...", initialValues = undefined, disabled, displayValue }) => {
  const [query, setQuery] = useState(initialValues ? initialValues[displayField] : '');
  const [filteredItems, setFilteredItems] = useState(items);
  const [showList, setShowList] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { field } = useController({
    name: fieldName,
    control,
    defaultValue: initialValues,
  });

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
    <div className='relative w-[445px]' ref={containerRef}>
      <div className='relative'>
        <InputFieldApp
          {...field}
          type="text"
          placeholder={placeholder}
          onFocus={() => setShowList(true)}
          onChange={handleInputChange}
          value={displayValue ? displayValue : query}
          disabled={disabled}
        />
        {showList && (
          <div className='absolute top-20 left-0 right-0 z-10 rounded-xl border border-primary-100 bg-primary-50'>
            <List
              height={listHeight}
              itemCount={filteredItems.length}
              itemSize={35}
              width={440}
              className='scroll custom-scrollbar'
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
    </div>
  );
};

export default Search;