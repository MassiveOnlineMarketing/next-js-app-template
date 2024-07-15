'use server'

import React from 'react'

import { auth } from '@/application/services/AuthService';
import getAccountById from '@/application/useCases/user/getAccountById';

import { UserAccountStoreProvider } from './userAccountStoreProvider';
import { getWebsiteByUserId } from '@/application/useCases/website/getWebsiteByUserId';
import { WebsiteDetailsProvider } from './websiteDetailsStoreProvider';
import { Website } from '@/domain/_entities/Website';


const ServerProvider = async ({
  children,
}: {
  children: React.ReactNode;
}) => {

  console.log('re render server provider');

  const session = await auth();
  const userId = session?.user.id

  let account = null;
  if (userId) {
    account = await getAccountById(userId);
  }

  let website = null;
  if (userId) {
    website = await getWebsiteByUserId(userId).then((res) => {
      return res.data
    });
  }


  return (
    <>
      <UserAccountStoreProvider account={account} />
      <WebsiteDetailsProvider websites={website} />
      {children}
    </>
  )
}

export default ServerProvider