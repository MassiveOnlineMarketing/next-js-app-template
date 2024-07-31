import React from "react";

import { LatestResultsDTO } from "@/dashboard/google-search/serp-types";

const PeopleAlsoAsk = ({
  keywordData,
}: {
  keywordData: LatestResultsDTO;
}) => {
  return (
    <div>
      <p className="mb-3 text-lg leading-7 font-medium text-gray-800">
        People Also Ask
      </p>
      {Array.isArray(keywordData.peopleAlsoAsk) &&
      keywordData.peopleAlsoAsk.length > 0 ? (
        <>
          {keywordData.peopleAlsoAsk.map((peopleAlsoSearchedFor: any) => (
            <div
              key={peopleAlsoSearchedFor.question}
              className=" py-[10px] border-t border-gray-200 text-base leading-6 font-normal text-gray-800"
            >
              {peopleAlsoSearchedFor.question}
            </div>
          ))}
        </>
      ) : (
        <p className="text-base leading-6 font-normal text-gray-800">
          No people also ask
        </p>
      )}
    </div>
  );
};

export default PeopleAlsoAsk;
