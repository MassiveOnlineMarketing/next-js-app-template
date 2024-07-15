import React from 'react'

import LogoutButton from '@/presentation/auth/components/logout-button'
import WebsiteSelectionButton from '@/presentation/components/website-selection-button'
import ClientComp from './clientcomp'

const page = async () => {

  return (
    <div>
      page
      <LogoutButton />
      <ClientComp />
      <WebsiteSelectionButton />
    </div>
  )
}

export default page