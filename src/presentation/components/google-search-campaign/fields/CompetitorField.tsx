'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { InputFieldApp } from "@/presentation/components/ui/inputFields";

import { PlusIcon } from "@heroicons/react/24/outline";

interface CompetitorsFieldProps {
  addedCompetitors: string[];
  removedCompetitors: string[];
  setAddedCompetitors: React.Dispatch<React.SetStateAction<string[]>>;
  setRemovedCompetitors: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * CompetitorsField component.
 * Renders a field for managing competitors in a Google Search Campaign.
 *
 * @component
 * @example
 * return (
 *   <CompetitorsField
 *     addedCompetitors={addedCompetitors}
 *     removedCompetitors={removedCompetitors}
 *     setAddedCompetitors={setAddedCompetitors}
 *     setRemovedCompetitors={setRemovedCompetitors}
 *   />
 * );
 */
const CompetitorsField: React.FC<CompetitorsFieldProps> = ({
  addedCompetitors,
  removedCompetitors,
  setAddedCompetitors,
  setRemovedCompetitors,
}) => {

  useEffect(() => {
    // TODO: Fetch competitors
    console.log('useEffect CompetitorsField')
  },[])

  const [domainInput, setDomainInput] = useState('');
  const [fetchedCompetitors, setFetchedCompetitors] = useState<string[]>([]);

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
  const currentCompetitors = useMemo(() => {
    const combinedCompetitors = [...fetchedCompetitors, ...addedCompetitors];
    return combinedCompetitors.filter(domain => !removedCompetitors.includes(domain));
  }, [fetchedCompetitors, addedCompetitors, removedCompetitors]);

  return (
    <>
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
    </>
  )
}

export default CompetitorsField;