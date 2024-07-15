import React from 'react'

import LogoutButton from '@/presentation/auth/components/logout-button'
import ClientComp from './clientcomp'
import Link from 'next/link'





const page = async () => {

  return (
    <div>
      page
      <LogoutButton />
      <ClientComp />

      <Link href="/app/search/website">
        Website
      </Link>
    </div>
  )
}

export default page