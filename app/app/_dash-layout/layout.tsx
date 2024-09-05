'use client';

import React, { useState } from 'react'

import TopBar from './topbar'
import PrimarySidebar from './primary-sidebar';

import { TooltipProvider } from '@/presentation/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex min-h-screen bg-p-25 dark:bg-p-1100'>
      <TooltipProvider>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>

          <PrimarySidebar />
          <div className='w-full px-3 pt-3 layout'>
            <div className='h-fit bg-white dark:bg-p-1100 rounded-t-xl border border-light-stroke dark:border-dark-stroke'>
              <div className='h-[calc(100vh-14px)] custom-scrollbar -mr-3 pr-[3px]'>
                {children}
              </div>
            </div>
          </div>

        </ThemeProvider>
      </TooltipProvider>
    </div>
  )
}

export default DashboardLayout