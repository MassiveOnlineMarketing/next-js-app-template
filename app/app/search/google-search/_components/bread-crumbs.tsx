import Link from "next/link";
import React from "react";

const BreadCrumbsSearchKeywords = ({
  campaignName,
}: {
  campaignName?: string;
}) => {
  return (
    <p className="px-6 pb-6 w-full inline-flex gap-2 text-sm leading-5 font-base text-gray-400 border-b border-gray-200">
      <span>Home</span>
      <span>&gt;</span>
      <Link href="app/search">Search</Link>
      <span>&gt;</span>
      <span>Google Search Campaign</span>
      {campaignName && (
        <>
          <span>&gt;</span>
          <span className="text-gray-500">{campaignName}</span>
        </>
      )}
    </p>
  );
};

export default BreadCrumbsSearchKeywords;
