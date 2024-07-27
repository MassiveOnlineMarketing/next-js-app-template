'use client';

import React, { useState } from 'react'
import { usePathname } from 'next/navigation';

import TopBar from './topbar'
import PrimarySidebar from './primary-sidebar';

import { TooltipProvider } from '@/presentation/components/ui/tooltip';

import { CreditCardIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SecondarySidebar from './secondary-sidebar';

export type NavigationProps = {
  name: string;
  href: string;
  icon: React.ElementType;
};


const navigation = [
  // { name: 'Dashboard', href: '/app', icon: HomeIcon },
  { name: "Search", href: "/app/search", icon: MagnifyingGlassIcon },
  // { name: 'Website', href: '/app/website', icon: ComputerDesktopIcon },
  { name: "Billing", href: "/app/billing", icon: CreditCardIcon },
];



const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [secondarySidebarOpen, setSecondarySidebarOpen] = useState(true);

  const isActive = (href: string, pathname: string) => {
    return (
      (href === "/app" && pathname === href) ||
      (pathname.includes(href) && href !== "/app")
    );
  };

  return (
    <div className='h-full'>
      <TooltipProvider>
        <TopBar setMobileSidebarOpen={setMobileSidebarOpen} />

        <div className="flex flex-row h-[calc(100vh-64px)]">
          <PrimarySidebar
            navigation={navigation}
            pathname={pathname}
            isActive={isActive}
            setSecondarySidebarOpen={setSecondarySidebarOpen}
          />

          <div className="w-full h-full p-[8px] relative ">
            <div className="absolute inset-0 bg-transparent box-content inner-shadow lg:rounded-tl-3xl border-2 overflow-hidden flex">
              {/* Secondary Nav */}
              <SecondarySidebar />

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