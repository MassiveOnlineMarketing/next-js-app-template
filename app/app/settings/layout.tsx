"use client";

import React from "react";
import { cn } from "@/presentation/components/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HomeScreenBanner from "@/presentation/components/layout/HomeScreenBanner";


import {
  BellAlertIcon,
  ChevronRightIcon,
  LinkIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import { useCurrentUser } from "@/presentation/auth/hooks/user-current-user";


const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const lastPath = pathname.split("/").filter(Boolean).pop() || "";
  const user = useCurrentUser();

  return (
    <>
      <HomeScreenBanner user={user} className="m-3">
        <Link href="/app/search">Home</Link>
        <ChevronRightIcon className="h-4 w-4" />
        <span>Settings</span>
        <ChevronRightIcon className="h-4 w-4" />
        <span className="text-gray-500">
          {lastPath.charAt(0).toUpperCase() + lastPath.slice(1).toLowerCase()}
        </span>
      </HomeScreenBanner>

      <div className="pl-16 mr-6 pt-11">
        <div className="mb-5 py-[10px]">
          <h2 className="text-3xl leading-9 font-semibold text-gray-800">
            Settings
          </h2>
          <p className="text-base-leading-6 font-normal text-gray-500">
            Manage your account details and preferences here.
          </p>
        </div>
        <div className="flex gap-[6px] text-base leading-6 font-medium">
          <Link
            className={cn(
              "px-5 py-3 bg-white rounded-t-lg shadow-base",
              "inline-flex items-center gap-1",
              lastPath === "profile" ? "text-primary-500" : "text-gray-500",
            )}
            href="/app/settings/profile"
          >
            <UserCircleIcon className="w-5 h-5" />
            Profile
          </Link>
          <Link
            className={cn(
              "px-5 py-3 bg-white rounded-t-lg shadow-base",
              "inline-flex items-center gap-1",
              lastPath === "integrations"
                ? "text-primary-500"
                : "text-gray-500",
            )}
            href="/app/settings/integrations"
          >
            <LinkIcon className="w-5 h-5" /> Integrations
          </Link>
          {/* <Link className={cn(
                        'px-5 py-3 bg-white rounded-t-lg shadow-base',
                        'inline-flex items-center gap-1',
                        lastPath === 'notifications' ? 'text-primary-500' : 'text-gray-500'
                    )} href='/app/settings/notifications'><BellAlertIcon className='w-5 h-5' /> Notifications</Link> */}
        </div>
        <div className="px-8 py-12 mb-3 w-full bg-white shadow-base rounded-b-2xl rounded-tr-2xl relative z-10">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
