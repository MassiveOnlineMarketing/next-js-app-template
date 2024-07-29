'use client'

import React from 'react'

import { Website } from '@/domain/_entities/Website';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/common/dialog'
import { DialogDescription } from '@radix-ui/react-dialog';
import Websiteform from '../forms/WebsiteForm';



interface WebsiteFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  website?: Website | null;
}

const WebsiteFormDialog: React.FC<WebsiteFormDialogProps> = ({
  open,
  setOpen,
  website,
}) => {

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium text-2xl text-gray-800">
            {website
              ? "Update your Website"
              : "Setup your website"}
          </DialogTitle>
          <DialogDescription className="font-medium text-base text-gray-500 pt-[4px]">
            Please enter the details of your website
          </DialogDescription>
        </DialogHeader>

        <Websiteform open={open} setOpen={setOpen} website={website} />

      </DialogContent>
    </Dialog>
  )
}


export default WebsiteFormDialog