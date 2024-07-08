import { auth } from '@/application/services/AuthService'
import { logout } from '@/presentation/auth/actions/logout'
import LogoutButton from '@/presentation/auth/components/logout-button'
import React from 'react'

const page = async () => {

  const session = await auth()
  console.log('session', session)

  return (
    <div>
      page

      <LogoutButton />
    </div>
  )
}

export default page