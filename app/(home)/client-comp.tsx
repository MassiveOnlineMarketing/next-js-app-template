'use client'

import React from 'react'

import { useUserAccountStore } from '@/presentation/stores/user-account-store'


const ClientComp = () => {
  // console.log('ClientComp')

  const hasAccess = useUserAccountStore((state) => state.hasAccess('search-console'))
  const refreshToken = useUserAccountStore((state) => state.accountDetails?.refresh_token)
  const accountDetails = useUserAccountStore((state) => state.accountDetails)

  return (
    <div>
      <button onClick={() => {console.log(accountDetails)}}>Click</button>
      {hasAccess ? <p>User has access to the scope</p> : <p>User does not have access to the scope</p>}
      {hasAccess ? <p>Refresh Token: {refreshToken}</p> : null}
    </div>
  );
}

export default ClientComp