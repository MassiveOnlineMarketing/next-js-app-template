'use client';

import { useEffect } from 'react';

import { useUserAccountStore } from '@/presentation/stores/user-account-store';
import { Account } from '@prisma/client';


export const UserAccountStoreProvider = ({ account }: {account: Account | null;}) => {
  // console.log('re render account', account)

  const setUserAccount = useUserAccountStore((state) => state.setAccountDetails);
  useEffect(() => {
    setUserAccount(account);
  }, []);

  return null;
};