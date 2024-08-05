'use client';

import Link from "next/link";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/presentation/components/ui/tooltip";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { cn } from "@/presentation/components/utils";

type SearchConsoleNotAuthorizedProps = {
  title: string;
};

const SearchConsoleNotAuthorized = ({
  title,
}: SearchConsoleNotAuthorizedProps) => {
  return (
    <div
      className={`w-full h-[152px] border border-gray-100 rounded-2xl p-[6px]`}
    >
      <div
        className={cn(
          "relative w-full h-full border rounded-xl",
          `border-gray-100 bg-gradient-to-b from-white to-[#f8fafc]`,
        )}
      >
        <h2 className="ml-4 mt-4 text-base leading-6 font-medium text-gray-800">
          {title}
        </h2>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 flex flex-col justify-center gap-1">
          <Tooltip>
            <TooltipTrigger>
              <LockClosedIcon className="w-8 h-8 text-gray-400 mx-auto" />
            </TooltipTrigger>
            <TooltipContent>
              <Link
                href="/app/settings/integrations"
                className="text-primary-500 text-center"
              >
                Connect Search Console
              </Link>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default SearchConsoleNotAuthorized;