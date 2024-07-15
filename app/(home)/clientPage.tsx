'use client'

import useGoogleToken from '@/presentation/hooks/useGoogleRefreshToken'

import React from 'react'

const ClientPage = () => {
  // console.log('ClientPage')
  const { hasAccess, refreshToken, isLoading } = useGoogleToken('search-console');
  // console.log('hasAccess', hasAccess)

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }
  

  return (
    <div>
      {hasAccess ? <p>User has access to the scope</p> : <p>User does not have access to the scope</p>}
      {hasAccess ? <p>Refresh Token: {refreshToken}</p> : null}
    </div>
  );
}

export default ClientPage