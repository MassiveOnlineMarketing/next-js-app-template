'use server'

import React from 'react'

import { auth } from '@/application/services/AuthService';
import getAccountById from '@/application/useCases/user/getAccountById';

import { UserAccountStoreProvider } from './userAccountStoreProvider';
import { getWebsiteByUserId } from '@/application/useCases/website/getWebsiteByUserId';


const ServerProvider = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();
  const userId = session?.user.id

  let account = null;
  if (userId) {
    account = await getAccountById(userId);
  }


  return (
    <>
      <UserAccountStoreProvider account={account} />
      {children}
    </>
  )
}

export default ServerProvider