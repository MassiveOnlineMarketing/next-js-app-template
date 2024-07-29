'use client';

import React, { useState } from 'react'

import TopBar from './topbar'
import PrimarySidebar from './primary-sidebar';

import { TooltipProvider } from '@/presentation/components/ui/tooltip';


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className='h-full'>
      <TooltipProvider>
        <TopBar setMobileSidebarOpen={setMobileSidebarOpen} />

        <div className="flex flex-row h-[calc(100vh-64px)]">
          <PrimarySidebar />

          <div className="w-full h-full p-[8px] relative ">
            <div className="absolute inset-0 bg-transparent box-content inner-shadow lg:rounded-tl-3xl border-2 overflow-hidden flex">
              <div className="h-full w-full overflow-y-auto bg-primary-50">
                <div className='p-6 h-full'>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}

export default DashboardLayout