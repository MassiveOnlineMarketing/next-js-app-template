"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { ExtendedUser } from "../../../next-auth";
import { logout } from "@/presentation/auth/actions/logout";
import { useCurrentUser } from "@/presentation/auth/hooks/user-current-user";


// Components
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuLabel } from "@/presentation/components/ui/dropdown-menu";

// Assets
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { MassiveTextLogo } from "../../../assets/branding";
import ThemeSwitcher from "./ThemeSwitcher";


const TopBar = ({
  setMobileSidebarOpen,
}: {
  setMobileSidebarOpen: (open: boolean) => void;
}) => {
  const user = useCurrentUser();

  return (
    <div className="h-16 w-full flex shrink-0 items-center gap-x-4 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <MassiveTextLogo className="w-auto my-auto" />

      <ThemeSwitcher />


      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <UserDropdownButton user={user} />
        </div>
      </div>
    </div>
  );
};

export default TopBar;

const UserDropdownButton = ({ user }: { user?: ExtendedUser }) => {
  const handleLogout = () => {
    logout();
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="-m-1.5 flex items-center p-1.5">
          <span className="sr-only">Open user menu</span>

          {user?.image ? (
            <Image
              className="h-8 w-8 rounded-full bg-gray-50"
              src={user?.image || "/images/avatars/default.png"}
              alt="user image"
              width={32}
              height={32}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-50" />
          )}
          <span className="hidden lg:flex lg:items-center">
            <span
              className="ml-4 text-sm font-semibold leading-6 text-gray-900"
              aria-hidden="true"
            >
              {user?.name}
            </span>
            {isOpen ? (
              <ChevronDownIcon
                className="ml-2 h-5 w-5 text-gray-400 rotate-180"
                aria-hidden="true"
              />
            ) : (
              <ChevronDownIcon
                className="ml-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>
          <p>Settings</p>
        </DropdownMenuLabel>
        <DropdownMenuItem>
          <Link
            className="w-full"
            onClick={() => setIsOpen(false)}
            href="/app/settings/profile"
          >
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            className="w-full"
            onClick={() => setIsOpen(false)}
            href="/app/settings/integrations"
          >
            Integrations
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>
                    <Link
                        className='w-full'
                        onClick={() => setIsOpen(false)}
                        href='/app/settings/notification'
                    >
                        Notifications
                    </Link>
                </DropdownMenuItem> */}

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <button
            className="w-full text-left"
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
          >
            Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
