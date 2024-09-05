'use server';

import React from 'react'
import ProfileSettingsForm from './ProfileSettingsForm'
import { auth } from '@/application/services/AuthService';
// import { isAllowedToViewPage } from '@/app/(auth)/pageAuth';

const page = async () => {
  const session = await auth();
  if (!session) return <div>no session</div>;

  return (
    <>
      <div className='px-6 pt-6 pb-3 flex flex-col gap-[6px]'>
        <p className='text-xl font-medium text-p-800'>Profile Settings</p>
        <p>Manage your profile settings here</p>
      </div>
      <ProfileSettingsForm user={session.user} />
    </>
  )
}

export default page