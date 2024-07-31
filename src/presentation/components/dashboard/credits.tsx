"use client";

import React, { useEffect, useState } from "react";

import { userTotalKeywordCount } from "@/presentation/actions/user-total-keyword-count";
import { ExtendedUser } from "../../../../next-auth";

import { TooltipArrow, TooltipContent } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipTrigger } from "@/presentation/components/ui/tooltip";

import { CreditCardIcon, PlusIcon } from "@heroicons/react/24/outline";

/**
 * `Credits` is a React component that displays the user's credits and daily SERP API spend.
 *
 * This component is responsible for fetching and displaying the total keyword count for a user,
 * which represents the daily spend for using the SERP Dashboard. It also displays the user's remaining credits.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {ExtendedUser} props.user - The user object containing the user's details and credits.
 *
 * @returns {JSX.Element} A JSX element containing the user's credits and daily SERP API spend.
 */
type DailySerpSpendPerProjectProps = {
  projectId: string;
  projectName: string;
  keywordCount: number;
};

const Credits = ({ user }: { user: ExtendedUser | undefined }): JSX.Element => {
  const [dailySerpSpendPerProject, setDailySerpSpendPerProject] = useState<
    DailySerpSpendPerProjectProps[] | []
  >([]);

  useEffect(() => {
    const getTotalKeywordCount = async () => {
      if (user?.id) {
        const userId = user.id;
        const res = await userTotalKeywordCount(userId);

        if (res !== 0) {
          setDailySerpSpendPerProject(res);
        }
      }
    };

    getTotalKeywordCount();
  }, [user]);

  return (
    <div className="absolute top-[22px] right-[22px]">
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="bg-white shadow-base pr-4 pl-3 py-2 rounded-lg flex gap-1 text-sm">
          <CreditCardIcon className="w-5 h-5 text-gray-500" />{" "}
          <span>{user?.credits || 0}</span>{" "}
          <span className="text-gray-400">Credits</span>
        </TooltipTrigger>
        <TooltipContent
          className="p-5 bg-white z-50 overflow-hidden rounded-lg shadow-lg text-xs text-primary-foreground "
          side="bottom"
          align="end"
        >
          <TooltipArrow fill="white" width={35} height={20} />
          <div className="relative mb-2 flex flex-col space-y-2 font-medium">
            <p className="mb-[6px] text-xs text-gray-400">Daily Cost</p>
            {/* <p className='mb-[6px] text-sm text-gray-600'>Campaigns</p> */}
            {dailySerpSpendPerProject.map((project) => (
              <div key={project.projectId} className="text-sm leading-5">
                <p className="text-gray-800">{project.projectName}</p>
                <p className="text-gray-400">
                  - {project.keywordCount} Credits
                </p>
              </div>
            ))}
            <div className="absolute right-0 bottom-1">
              <PlusIcon className="w-3 h-3 text-gray-500" />
            </div>
          </div>
          <p className="text-gray-800 text-sm pt-3 border-t border-gray-200">
            <span className="text-gray-500">Total:</span> -{" "}
            {dailySerpSpendPerProject.reduce(
              (acc, project) => acc + project.keywordCount,
              0,
            )}{" "}
            Credits
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Credits;
