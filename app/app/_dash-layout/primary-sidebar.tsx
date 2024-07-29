'use client';

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { cn } from "@/presentation/lib/utils";

// Components
import { Tooltip, TooltipContent, TooltipTrigger } from "@/presentation/components/ui/tooltip";
import WebsiteSelectionButton from "@/presentation/components/website/website-selection-button";

// Icons
import { ChevronDownIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { HomeIcon, PresentationChartLineIcon, Cog6ToothIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import UpdateWebsiteButton from "@/presentation/components/website/update-website-button";
import { useGoogleSearchCampaignDetailsStore } from "@/presentation/stores/google-search-campaign-store";


type NavigationProps = {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: NavigationChildrenProps[];
};

type NavigationChildrenProps = {
  name: string;
  href: string;
  disabled?: boolean;
  tooltipLabel?: string;
};

const PrimarySidebar = () => {
  const pathname = usePathname();
  const googleSearchCampaigns = useGoogleSearchCampaignDetailsStore((state) => state.campaigns);

  const navigation = [
    { name: 'Home', href: '/app', icon: HomeIcon },
    {
      name: "Campaigns",
      href: "/app/search",
      icon: PresentationChartLineIcon,
      children: googleSearchCampaigns.map((campaign: GoogleSearchCampaign) => ({
        name: campaign.campaignName,
        href: `/app/search/google-search/${campaign.id}`,
      })),
    },
    { name: 'Billing', href: '/app/billing', icon: CreditCardIcon },
  ];

  const isActive = (href: string, pathname: string) => {
    return (
      (href === "/app" && pathname === href) ||
      (pathname.includes(href) && href !== "/app")
    );
  };


  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const handleNavItemClick = (itemName: string) => {
    setExpandedItems((prevExpandedItems) =>
      prevExpandedItems.includes(itemName)
        ? prevExpandedItems.filter((item) => item !== itemName)
        : [...prevExpandedItems, itemName]
    );
  };

  return (
    <nav className="lg:block hidden h-full w-fit bg-white-50 relative z-10 bg-white">
      <ul className="flex flex-col min-h-full">
        <li className="p-3">
          <WebsiteSelectionButton />
        </li>
        <li className="p-3">
          {navigation.map((item) => (
            <div key={item.name}>
              <NavItem item={item} pathname={pathname} isActive={isActive} onClick={() => handleNavItemClick(item.name)} expandedItems={expandedItems} />
              {item.children && expandedItems.includes(item.name) && (
                item.children.map((child) => (
                  <NavItemChild
                    key={child.name}
                    child={child}
                    pathname={pathname}
                    isActive={isActive}
                  />
                ))
              )}
            </div>
          ))}
        </li>

        <li className="mt-auto p-3">
          <UpdateWebsiteButton>
            <Cog6ToothIcon className="w-6 h-6 text-gray-400" />
            <span className="text-gray-500 text-base leading-6 font-medium">
              Website Settings
            </span>
          </UpdateWebsiteButton>
          {/* <Link href="/search/help" className="py-2 flex gap-4 items-center">
            <QuestionMarkCircleIcon className="w-6 h-6 text-gray-400" />
            <span className="text-gray-500 text-base leading-6 font-medium">
              Help Center
            </span>
          </Link> */}
        </li>
      </ul>
    </nav>
  );
};

type NavItemProps = {
  item: NavigationProps;
  pathname: string;
  isActive: (href: string, pathname: string) => boolean;
  onClick: () => void;
  expandedItems: string[];
};

const NavItem = ({ item, pathname, isActive, onClick, expandedItems }: NavItemProps) => {

  return (
    <div className={cn("pl-2 py-2 pr-3 flex items-center relative")}>
      <item.icon
        className={cn(
          "h-6 w-6 pr-2 ",
          isActive(item.href, pathname)
            ? "text-primary-500"
            : "text-gray-500",
        )}
      />
      <Link
        href={item.href}
        className={cn(
          "text-base leading-6 font-medium",
          isActive(item.href, pathname)
            ? "text-primary-500"
            : "text-gray-500",
        )}
      >
        {item.name}
      </Link>
      <div
        className={cn(
          "absolute -left-3 h-6 top-1/2 -translate-y-1/2 w-1 bg-primary-500 rounded-r-sm",
          isActive(item.href, pathname) ? "" : "hidden",
        )}
      ></div>
      {item.children && (
        <ChevronDownIcon
          onClick={onClick}
          className={`ml-auto cursor-pointer h-5 w-5 transition-transform text-gray-500 ${expandedItems.includes(item.name) ? 'transform rotate-180' : ''
            }`}
        />
      )}
    </div>
  )
}


type NavItemChildProps = {
  child: NavigationChildrenProps;
  pathname: string;
  isActive: (href: string, pathname: string) => boolean;
};

const NavItemChild = ({ child, pathname, isActive }: NavItemChildProps) => {
  return (
    <Link
      key={child.name}
      href={child.disabled ? "#" : child.href}
      className={cn(
        "ml-[18px] px-[16px] py-2 border-l border-primary-100 flex items-center relative",
        child.disabled ? "text-gray-400" : "text-gray-500",
      )}
    >
      <span
        className={cn(
          "text-base leading-6 font-medium",
          isActive(child.href, pathname)
            ? "text-primary-500"
            : "text-gray-800",
        )}
      >
        {child.name}
      </span>
      {child.disabled && (
        <Tooltip>
          <TooltipTrigger className="ml-auto">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{child.tooltipLabel}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </Link>
  )
}

export default PrimarySidebar;
