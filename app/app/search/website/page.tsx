import React from 'react'


import UpdateWebsiteButton from '@/presentation/components/website/update-website-button'
import WebsiteSelectionButton from '@/presentation/components/website/website-selection-button';

import { Cog6ToothIcon } from "@heroicons/react/20/solid";


const page = () => {
  return (
    <div>
      <WebsiteSelectionButton />

      <UpdateWebsiteButton>
        <Cog6ToothIcon className="w-6 h-6 text-gray-400" />
        <span className="text-gray-500 text-base leading-6 font-medium">
          Website Settings
        </span>
      </UpdateWebsiteButton>
    </div>
  )
}

export default page