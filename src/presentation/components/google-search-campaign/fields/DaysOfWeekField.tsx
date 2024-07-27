'use client'

import React from 'react';
import { useController, Control } from 'react-hook-form';

import { DAYS_OF_WEEK } from '@/presentation/components/google-search-campaign/form-options';

interface DaysOfWeekFieldProps {
  control: Control<any>;
  fieldName: string;
  initialValues?: string[];
}

/**
 * DaysOfWeekField component displays a set of checkboxes for selecting days of the week.
 *
 * @component
 * @param {DaysOfWeekFieldProps} props - The component props.
 * @param {Control} props.control - The form control object from react-hook-form.
 * @param {string} props.fieldName - The name of the field.
 * @param {string[]} [props.initialValues=[]] - The initial values for the checkboxes.
 * @returns {JSX.Element} The DaysOfWeekField component.
 */
const DaysOfWeekField: React.FC<DaysOfWeekFieldProps> = ({ control, fieldName, initialValues = undefined }) => {
  const { field } = useController({
    name: fieldName,
    control,
    defaultValue: initialValues,
  });

  React.useEffect(() => {
    if (!field.value || field.value.length === 0) {
      field.onChange(DAYS_OF_WEEK.map((day) => day.value)); // Set all days if no initial value
    }
  }, [field]);

  const handleCheckboxChange = (day: string) => {
    const currentValue = field.value || [];
    const newValue = currentValue.includes(day)
      ? currentValue.filter((d: string) => d !== day)
      : [...currentValue, day];
    field.onChange(newValue);
  };

  return (
    <div className="flex space-x-2">
      {DAYS_OF_WEEK.map((day) => (
        <label key={day.value} className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            value={day.value}
            checked={(field.value || []).includes(day.value)}
            onChange={() => handleCheckboxChange(day.value)}
            className="hidden"
          />
          <span className={`inline-block w-8 h-8 text-center leading-8 border-2 rounded ${field.value?.includes(day.value) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-black border-gray-300'}`}>
            {day.label.slice(0, 2)}
          </span>
        </label>
      ))}
    </div>
  );
};

export default DaysOfWeekField;