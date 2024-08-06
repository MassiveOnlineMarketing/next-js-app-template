"use client";

import React from "react";
import GeneralUserSettingsForm from "./_components/general-user-settings-from";

const Page = () => {
  return (
    <>
      <div className="w-full pb-12 border-b border-gray-200">
        <div className="max-w-[650px] mx-auto ">
          <GeneralUserSettingsForm />
        </div>
      </div>
    </>
  );
};

export default Page;
