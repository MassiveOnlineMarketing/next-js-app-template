import React from 'react'

import LogoutButton from '@/presentation/auth/components/logout-button'
import WebsiteSelectionButton from '@/presentation/components/website-selection-button'
import ClientComp from './clientcomp'
import UpdateWebsiteButton from '@/presentation/components/update-website-button'

const page = async () => {

  return (
    <div>
      page
      <LogoutButton />
      <ClientComp />
      <WebsiteSelectionButton />
      <UpdateWebsiteButton />
    </div>
  )
}

export default page