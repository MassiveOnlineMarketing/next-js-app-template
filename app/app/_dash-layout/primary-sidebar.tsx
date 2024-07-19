import Link from "next/link";
import { cn } from "@/presentation/lib/utils";
import { NavigationProps } from "./layout";

// Components
import { Tooltip, TooltipContent, TooltipTrigger } from "@/presentation/components/ui/tooltip";


type PrimarySidebarProps = {
  navigation: NavigationProps[];
  pathname: string;
  isActive: (href: string, pathname: string) => boolean;
  setSecondarySidebarOpen: (open: boolean) => void;
};

const PrimarySidebar = ({
  navigation,
  pathname,
  isActive,
  setSecondarySidebarOpen,
}: PrimarySidebarProps) => {

  return (
    <nav className="lg:block hidden h-full w-fit bg-white-50 relative z-10 bg-white">
      <ul role="list" className="flex flex-col h-full">
        {navigation.map((item) => (
          <li key={item.name}>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={item.href}
                  onClick={() => setSecondarySidebarOpen(true)}
                  className={cn(
                    "px-6 py-[16px] flex items-center justify-center relative",
                    isActive(item.href, pathname)
                      ? "before:content-[''] before:w-[2px] before:h-full before:bg-purple-500 before:absolute before:left-0"
                      : "",
                  )}
                >
                  <item.icon
                    className="h-8 w-8 text-gray-600"
                    aria-hidden="true"
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          </li>
        ))}

      </ul>
    </nav>
  );
};

export default PrimarySidebar;
