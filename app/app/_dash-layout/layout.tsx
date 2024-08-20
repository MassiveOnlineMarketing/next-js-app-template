'use client';

import React, { useState } from 'react'

import TopBar from './topbar'
import PrimarySidebar from './primary-sidebar';

import { TooltipProvider } from '@/presentation/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full bg-primary-50  dark:bg-p-1100'>
      <TooltipProvider>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <div className="flex flex-row h-screen  pt-6">
            <PrimarySidebar />

            <div className="w-full h-full relative  ">
              <div className="h-full w-full overflow-y-hidden">
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