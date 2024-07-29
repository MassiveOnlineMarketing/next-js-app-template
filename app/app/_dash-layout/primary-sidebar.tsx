import Link from "next/link";
import { cn } from "@/presentation/lib/utils";
import { NavigationProps } from "./layout";

// Components
import { Tooltip, TooltipContent, TooltipTrigger } from "@/presentation/components/ui/tooltip";
import WebsiteSelectionButton from "@/presentation/components/website/website-selection-button";

// Icons
import {
  ChevronDownIcon,
  Cog6ToothIcon,
  LockClosedIcon,
} from "@heroicons/react/20/solid";
import { GoogleSearchCampaign } from "@/domain/serpTracker/enitities/GoogleSearchCampaign";
import { getGoogleSearchCampaignByWebsiteId } from "@/application/useCases/googleSearchCampaign/getGoogleSearchCampaignByWebsiteId";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useWebsiteDetailsStore } from "@/presentation/stores/website-details-store";
import useGoogleToken from "@/presentation/hooks/useGoogleRefreshToken";
import {
  HomeIcon, DocumentMagnifyingGlassIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";

type PrimarySidebarProps = {
  // navigation: NavigationProps[];
  // pathname: string;
  // isActive: (href: string, pathname: string) => boolean;
  setSecondarySidebarOpen: (open: boolean) => void;
};

type TestProps = {
  name: string;
  href: string;
  disabled?: boolean;
  tooltipLabel?: string;
};

const PrimarySidebar = ({
  // navigation,
  // pathname,
  // isActive,
  setSecondarySidebarOpen,
}: PrimarySidebarProps) => {


  const pathname = usePathname();

  const [openWebsiteDialog, setOpenWebsiteDialog] = useState(false);
  const [openGoogleSearchProjectDialog, setOpenGoogleSearchProjectDialog] = useState(false);
  const currentWebsite = useWebsiteDetailsStore(
    (state) => state.websiteDetails,
  );
  const [campaignsChildren, setCampaignsChildren] = useState<TestProps[]>([]);

  const { hasAccess } = useGoogleToken("search-console");

  const navigation = [
    // { name: 'Dashboard', href: '/app/search/', icon: HomeIcon },
    { name: 'Home', href: '/app', icon: HomeIcon },
    {
      name: "SERP",
      href: "/app/search/results",
      icon: DocumentMagnifyingGlassIcon,
      children: [
        {
          name: "Google",
          href: "/app/search/results/google",
          disabled: hasAccess,
          tooltipLabel: "Connect Google Search Console",
        },
        {
          name: "Bing",
          href: "/app/search/results/bing",
          disabled: true,
          tooltipLabel: "Comming Soon",
        },
      ],
    },
    {
      name: "Campaigns",
      href: "/app/search/campaigns",
      icon: PresentationChartLineIcon,
      children: campaignsChildren,
    },
  ];

  useEffect(() => {
    fetchProjects();
  }, [currentWebsite]);

  const fetchProjects = async () => {
    if (!currentWebsite) return;
    const searchProjects = await getGoogleSearchCampaignByWebsiteId(
      currentWebsite.id,
    );

    if (!searchProjects.data) return;

    const newCampaignsChildren = searchProjects.data.map(
      (campaign: GoogleSearchCampaign) => ({
        name: campaign.campaignName,
        href: `/app/search/google-search/${campaign.id}`,
      }),
    );

    setCampaignsChildren(newCampaignsChildren); // Set the state here
  };

  // const handleAddProjectToSidebar = (project: GoogleSearchCampaign) => {
  //   const newCampaignsChildren = [
  //     ...campaignsChildren,
  //     {
  //       name: project.projectName,
  //       href: `/app/search/google-search/${project.id}`,
  //     },
  //   ];
  //   setCampaignsChildren(newCampaignsChildren);
  // };

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
      <div className="p-3">
        <WebsiteSelectionButton />
      </div>


      <div className="p-3">
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
            {item.name === "Campaigns" && (
              <button
                className="ml-[18px] px-[16px] py-2 border-l border-primary-100 flex items-center text-base leading-6 font-medium"
                onClick={() => setOpenGoogleSearchProjectDialog(true)}
              >
                Create New Google Search
              </button>
            )}
          </div>
        ))}
      </div>



      <div className="mt-auto">
        <button
          onClick={() => setOpenWebsiteDialog(true)}
          className="py-2 flex gap-4 items-center"
        >
          <Cog6ToothIcon className="w-6 h-6 text-gray-400" />
          <span className="text-gray-500 text-base leading-6 font-medium">
            Website Settings
          </span>
        </button>
        {/* <Link href="/search/help" className="py-2 flex gap-4 items-center">
            <QuestionMarkCircleIcon className="w-6 h-6 text-gray-400" />
            <span className="text-gray-500 text-base leading-6 font-medium">
              Help Center
            </span>
          </Link> */}
      </div>

    </nav>
  );
};

type NavItemProps = {
  item: NavigationProps;
  pathname: string;
  isActive: (href: string, pathname: string) => boolean;
  onClick: () => void;
  expandedItems?: string[];
};

const NavItem = ({ item, pathname, isActive, onClick, expandedItems }: NavItemProps) => {

  return (
    <div className={cn("pl-2 py-2 pr-3 flex items-center relative")} onClick={onClick}>
      <item.icon
        className={cn(
          "h-6 w-6 pr-2 ",
          isActive(item.href, pathname)
            ? "text-primary-500"
            : "text-gray-500",
        )}
      />
      <p
        className={cn(
          "text-base leading-6 font-medium",
          isActive(item.href, pathname)
            ? "text-primary-500"
            : "text-gray-800",
        )}
      >
        {item.name}
      </p>
      <div
        className={cn(
          "absolute -left-3 h-6 top-1/2 -translate-y-1/2 w-1 bg-primary-500 rounded-r-sm",
          isActive(item.href, pathname) ? "" : "hidden",
        )}
      ></div>
      {item. && (
        <ChevronDownIcon
          className={`h-5 w-5 ml-auto transition-transform ${expandedItems.includes(item.name) ? 'transform rotate-180' : ''
            }`}
        />
      )}
      <ChevronDownIcon
        className={cn(
          "h-5 w-5 ml-auto",
          expandedItems.includes(item.name) ? "transform rotate-180" : "",
        )}
      />
    </div>
  )
}


type NavItemChildProps = {
  child: TestProps;
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
