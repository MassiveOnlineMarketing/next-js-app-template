"use client";

import React from "react";
import Link from "next/link";

import SteppedProgressBar from "./_components/google-connection-step-progress";
import GoogleServiceCard from "./_components/GoogleServiceCard";

import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { GoogleAdsSvg, GoogleIconSvg, GoogleSearchConsoleSvg } from "../../../../assets/logos";


const Page = () => {
  return (
    <>
      <div className="mb-16 flex justify-between">
        <div>
          <h2 className="font-semibold text-2xl text-gray-800">
            Integration & Authorization Settings
          </h2>
          <p className="max-w-[650px] text-base leading-6 font-normal text-gray-500">
            Set the appropriate authorizations to securely access the necessary
            features and integrations for your workflow
          </p>
        </div>

        <div className="max-w-[600px] p-6 bg-gray-50 rounded-xl shadow-base flex gap-2">
          <ShieldCheckIcon className="min-w-6 h-6 text-green-500 mt-1 flex-0" />
          <p className="text-sm text-gray-500">
            Our app’s use and transfer of information received from Google APIs will adhere to the <Link className="text-primary-500" href='https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes'>Google API Services User Data Policy</Link>, including the Limited Use requirements.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <SteppedProgressBar  />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <GoogleServiceCard
          scope="account"
          Icon={GoogleIconSvg}
          heading="Google Account"
          subHeading="Manage your account details and preferences here."
          currentlyAvailable={true}
        />
        <GoogleServiceCard
          scope="search-console"
          Icon={GoogleSearchConsoleSvg}
          heading="Google Search Console"
          subHeading="Manage your account details and preferences here."
          currentlyAvailable={true}
        />
        <GoogleServiceCard
          heading="Google Ads"
          scope='ads'
          subHeading="Manage your account details and preferences here."
          Icon={GoogleAdsSvg}
          currentlyAvailable={false}
        />
      </div>
    </>
  );
};

export default Page;