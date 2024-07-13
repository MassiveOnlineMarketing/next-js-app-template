'use client';

import React, { ReactNode, useEffect } from 'react';

import getAccountById from '@/application/useCases/user/getAccountById';

import { useCurrentUser } from '@/presentation/auth/hooks/user-current-user';
import { useUserAccountStore } from '@/presentation/stores/user-account-store';


// Define the props for your provider component
interface UserAccountStoreProviderProps {
  children: ReactNode;
}

// Create the provider component
export const UserAccountStoreProvider: React.FC<UserAccountStoreProviderProps> = ({ children }) => {
  const user = useCurrentUser();
  const setUserAccount = useUserAccountStore((state) => state.setAccountDetails);

  useEffect(() => {
    // console.log('UserAccountStoreProvider');

    const fetchAccount = async () => {
      if (!user?.id) throw new Error("User not found");
      try {
        const account = await getAccountById(user.id);

        if (!account) {
          console.error("Account not found");
          return;
        }

        // console.log('setting account', account);
        setUserAccount(account);
      } catch (error) {
        console.error('Error fetching user account:', error);
      }
    }

    fetchAccount();
  }, []);

  return (
    <>
      {children}
    </>
  );
};