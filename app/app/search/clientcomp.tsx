'use client'
import { useCurrentUser } from '@/presentation/auth/hooks/user-current-user'
import { useUserAccountStore } from '@/presentation/stores/user-account-store'
import React, { useEffect } from 'react'

const Clientcomp = () => {
  // const user = useCurrentUser()

  // useEffect(() => {
  //   console.log('Clientcomp user changed')
  // }, [user])


  // const account = useUserAccountStore((state) => state.accountDetails)
  // console.log('Clientcomp account', account)

  return (
    <div>Clientcomp</div>
  )
}

export default Clientcomp