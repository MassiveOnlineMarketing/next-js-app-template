'use client';

import { createGoogleSearchProject } from '@/application/useCases/googleSearchCampaign/createGoogleSearchCampaign';
import React, { useState } from 'react';

export default function CreateGoogleSearchCampaignForm() {
  const [campaign, setCampaign] = useState({
    name: '',
    keywords: [],
    budget: 0,
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setCampaign({ ...campaign, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      // Assuming userId is available through some means, like user authentication context
      const userId = 'user123';
      const createdCampaign = await createGoogleSearchProject(campaign, userId);
      console.log('Campaign created successfully:', createdCampaign);
      // Update UI to reflect success
    } catch (error) {
      console.error('Failed to create campaign:', error);
      // Update UI to reflect error
    }
  };

  return (
    <div className="min-h-screen p-24">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Campaign Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={campaign.name}
          onChange={handleChange}
        />

        {/* Additional form fields for keywords and budget */}
        {/* For simplicity, not handling keywords array input in this example */}

        <label htmlFor="budget">Budget:</label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={campaign.budget}
          onChange={handleChange}
        />

        <button type="submit">Create Campaign</button>
      </form>
    </div>
  );
}