"use client";

import React from "react";

// assets
import { PencilIcon } from "@heroicons/react/20/solid";
import { useGoogleSearchProjectDetailsStore } from "@/lib/zustand/google-search-details-store";
import GoogleSearchProjectFormDialog from "@/app/(protected)/app/_components/project-form-dialog";

const KeywordTableHead = () => {
  const [open, setOpen] = React.useState(false);
  const currentGoogleSearchProject = useGoogleSearchProjectDetailsStore(
    (state) => state.ProjectDetails,
  );

  return (
    <div className="w-full mb-6 flex items-center border-b border-gray-200 ">
      <p className="mb-2 text-2xl leading-8 font-medium text-gray-800">
        Keyword Tracker
      </p>
      <button className="ml-auto" onClick={() => setOpen(true)}>
        <PencilIcon className=" h-4 w-4 text-gray-400" />
      </button>

      <GoogleSearchProjectFormDialog
        open={open}
        setOpen={setOpen}
        googleSearchProject={currentGoogleSearchProject}
      />
    </div>
  );
};

export default KeywordTableHead;
