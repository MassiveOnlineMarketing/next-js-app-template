'use client';

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { cn } from "@/presentation/components/utils";

import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";
import { useCurrentUser } from "@/presentation/auth/hooks/user-current-user";
import useLogout from "@/presentation/auth/hooks/use-logout";

// Components
import ThemeSwitcher from "./ThemeSwitcher";
import TestWebsiteSelectionButton from "@/presentation/components/website/test-website-selection-button";
import UpdateWebsiteButton from "@/presentation/components/website/update-website-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/presentation/components/ui/tooltip";
// import WebsiteSelectionButton from "@/presentation/components/website/NUwebsite-selection-button";

// Icons
import { ChevronDownIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { HomeIcon, PresentationChartLineIcon, Cog6ToothIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { MassiveDashLogo } from "../../../assets/branding";
import { LogOutIcon } from "lucide-react";



type NavigationProps = {
  name: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
};

function isActive(href: string, pathname: string) {
  // console.log('href', href)
  // console.log('pathname', pathname)
  return (
    (href === "/app" && pathname === href) ||
    (pathname.includes(href) && href !== "/app")
  );
};


const PrimarySidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  // const googleSearchCampaigns = useGoogleSearchCampaignDetailsStore((state) => state.campaigns);

  const selectedGoogleSearchCampaign = useGoogleSearchCampaignDetailsStore((state) => state.campaignDetails);

  const navigation = [
    { name: 'Home', href: '/app', icon: HomeIcon },
    { name: "Keyword Tracker", href: `/app/search/google-search/${selectedGoogleSearchCampaign?.id}`, icon: PresentationChartLineIcon, disabled: !selectedGoogleSearchCampaign?.id },
    { name: 'Intergration', href: '/app/settings/integrations', icon: PresentationChartLineIcon },
    { name: 'Billing', href: '/app/billing', icon: CreditCardIcon },
  ];


  return (
    <nav className="lg:block hidden h-full w-fit min-w-[398px] bg-white-50 relative z-10 bg-primary-50 dark:bg-p-1100">
      <ul className="flex gap-6 flex-col min-h-full">
        <li className="mb-6 px-6">
          <div className="pb-[15px] flex items-center justify-center border-b">
            <MassiveDashLogo />
          </div>
        </li>

        <li className="px-6">
          <TestWebsiteSelectionButton />
        </li>

        <li className="px-6">
          <ul>
            {navigation.map((item) => (
              <li key={item.name}>
                <NavItem item={item} pathname={pathname}/>
              </li>
            ))}
          </ul>
        </li>

        <li className="mt-auto px-6">
          <ThemeSwitcher />
          <div>
            <button onClick={() => router.back()}>
              <p>back</p>
            </button>
            <button onClick={() => router.forward()}>
              <p>forward</p>
            </button>
          </div>
        </li>
        <li className="px-6">
          <UpdateWebsiteButton>
            <Cog6ToothIcon className="w-6 h-6 text-gray-400" />
            <span className="text-gray-500 text-base font-medium">
              Website Settings
            </span>
          </UpdateWebsiteButton>
          {/* <Link href="/search/help" className="py-2 flex gap-4 items-center">
            <QuestionMarkCircleIcon className="w-6 h-6 text-gray-400" />
            <span className="text-gray-500 text-base font-medium">
              Help Center
            </span>
          </Link> */}
        </li>
        <li className="p-6">
          <UserActions />
        </li>
      </ul>
    </nav>
  );
};

type NavItemProps = {
  item: NavigationProps;
  pathname: string;
};

const NavItem = ({ item, pathname }: NavItemProps) => {

  return (
    <div
      className={cn(
        "relative",
        'transition-all duration-500',
        isActive(item.href, pathname)
          ? "dark:bg-dark-bg-light"
          : "",
      )}
    >
      <div className="p-3 flex gap-[10px] items-center ">
        <item.icon
          className={cn(
            "h-6 w-6",
            isActive(item.href, pathname)
              ? "text-primary-500 dark:text-dark-text-light"
              : "text-gray-500 dark:text-dark-text-dark",
          )}
        />
        <Link
          href={item.disabled ? "#" : item.href}
          className={cn(
            "text-base font-medium",
            isActive(item.href, pathname)
              ? "text-primary-500 dark:text-dark-text-light"
              : "text-gray-500 dark:text-dark-text-dark",
          )}
        >
          {item.name}
        </Link>
      </div>
      <div
        className={cn(
          "absolute top-0 h-full transition-all duration-500",
          isActive(item.href, pathname)
            ? "bg-gradient-to-r from-primary-500/15 to-transparent  border-x dark:border-dark-stroke  w-[350px]"
            : "w-0",
        )}
      >
      </div>
      {/* <div
        className={cn(
          "absolute -left-3 h-6 top-1/2 -translate-y-1/2 w-1 bg-primary-500 rounded-r-sm",
          isActive(item.href, pathname) ? "" : "hidden",
        )}
      >
      </div> */}
    </div>
  )
}



const UserActions = () => {
  const user = useCurrentUser();
  const logout = useLogout();
  const handleLogout = async () => {
    await logout();
  };
  // console.log(user);

  return (
    <div className="p-1 border dark:bg-dark-bg-light dark:border-dark-stroke border-mix-blend-multiply dark:border-mix-blend-plus-lighter rounded-xl group bg-white ">
      <div className="h-[54px] p-[6px] flex gap-3 justify-center items-center">
        <p className="text-gray-500 dark:text-dark-text-light font-medium text-sm text-nowrap">
          {user?.name}
        </p>
        <div className="w-full h-[1px] bg-p-100 dark:bg-dark-stroke mix-blend-multiply dark:mix-blend-plus-lighter"></div>
        <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-dark-text-dark shrink-0 transition-transform duration-200 group-hover:-rotate-90" />
      </div>
      <div className="h-0 group-hover:h-[88px] transition-all duration-300 overflow-hidden text-gray-500 dark:text-dark-text-dark dark:bg-p-1100 rounded-md">
        <div className="px-[6px] py-[10px]  flex items-center gap-2">
          <Cog6ToothIcon className="w-6 h-6" />
          <Link
            className="w-full"
            href="/app/settings/profile"
          >
            Account Settings
          </Link>
        </div>
        <div className="px-[6px] py-[10px] flex items-center gap-2">
          <LogOutIcon className="w-6 h-6" />
          <button
            className="w-full text-left"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrimarySidebar;
