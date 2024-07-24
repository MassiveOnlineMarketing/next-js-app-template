'use client';

import { LOCATIONS } from '@/presentation/components/google-search-campaign/location-constant';
import { TestForm } from '@/presentation/test/form';
import TestFormTwo from '@/presentation/test/testForm';
import MyVirtualizedList from '@/presentation/test/testsearchbar';
import React, { useState } from 'react'

const ClientPage = () => {

  return (
    <div className=''>
      {/* <TestForm /> */}
      {/* <MyVirtualizedList items={LOCATIONS} /> */}
      <TestFormTwo />
    </div>
  )
}

export default ClientPage