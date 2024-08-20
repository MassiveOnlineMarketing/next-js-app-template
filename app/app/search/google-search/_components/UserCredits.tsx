'use client';

import { useCurrentUser } from '@/presentation/auth/hooks/user-current-user';
import React from 'react'

const UserCredits = () => {
  const user = useCurrentUser();
  
  
  if (!user) {
    return null;
  }
  
  return (
    <p className='dark:text-dark-text-dark text-sm'>Credits: <span className='dark:text-dark-text-light'>{user?.credits}</span></p>
  )
}

export default UserCredits