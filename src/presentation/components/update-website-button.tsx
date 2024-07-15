'use client';

import React, { useState } from 'react'

import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import WebsiteFormDialog from './website-form-dialog';
import { useWebsiteDetailsStore } from '../stores/website-details-store';

const UpdateWebsiteButton = () => {
  const [openWebsiteDialog, setOpenWebsiteDialog] = useState(false);
  const currentWebsite = useWebsiteDetailsStore((state) => state.websiteDetails);
  
  return (
    <div>
      <button
        onClick={() => setOpenWebsiteDialog(true)}
        className="py-2 flex gap-4 items-center"
      >
        <Cog6ToothIcon className="w-6 h-6 text-gray-400" />
        <span className="text-gray-500 text-base leading-6 font-medium">
          Website Settings
        </span>
      </button>
      <WebsiteFormDialog open={openWebsiteDialog} setOpen={setOpenWebsiteDialog} website={currentWebsite}/>
    </div>
  )
}

export default UpdateWebsiteButton