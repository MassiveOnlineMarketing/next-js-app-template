'use client';

import React, { useState } from 'react'

import { useWebsiteDetailsStore } from '../../stores/website-details-store';
import WebsiteFormDialog from './website-form-dialog';
import { cn } from '../../lib/utils';

type UpdateWebsiteButtonProps = {
  children: React.ReactNode;
  className?: string;
}

const UpdateWebsiteButton = ({ children, className }: UpdateWebsiteButtonProps) => {
  const [openWebsiteDialog, setOpenWebsiteDialog] = useState(false);
  const currentWebsite = useWebsiteDetailsStore((state) => state.websiteDetails);
  
  return (
    <div>
      <button
        onClick={() => setOpenWebsiteDialog(true)}
        className={cn(
          "py-2 flex gap-4 items-center",
          className
        )}
      >
        {children}
      </button>
      <WebsiteFormDialog open={openWebsiteDialog} setOpen={setOpenWebsiteDialog} website={currentWebsite}/>
    </div>
  )
}

export default UpdateWebsiteButton