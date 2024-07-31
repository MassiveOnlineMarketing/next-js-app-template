import { GoogleSearchLatestKeywordResult } from "@/domain/serpTracker/enitities/GoogleSearchLatestKeywordResult";

import { Pill } from "@/presentation/components/ui/pill";

// charts
import { Cell, Pie, PieChart } from "recharts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/presentation/components/ui/tooltip";
import { urlWithoutDomain } from "@/presentation/lib/utils";

const MAX_URL_LENGTH = 52;
type PillColor = "red" | "yellow" | "green";

const CONFIG = {
  metaTitle: [
    { min: 0, max: 35, color: "red", text: "Poor", activePieColor: "#ef4444", pieColor: "#ef444440" },
    { min: 35, max: 50, color: "yellow", text: "Moderate", activePieColor: "#f59e0b", pieColor: "#f59e0b40" },
    { min: 50, max: 60, color: "green", text: "Excellent", activePieColor: "#059669", pieColor: "#05966940" },
    { min: 60, max: Infinity, color: "red", text: "Poor", activePieColor: "#ef4444", pieColor: "#ef444440" },
  ],
  metaDescription: [
    { min: 0, max: 100, color: "red", text: "Poor", activePieColor: "#ef4444", pieColor: "#ef444440" },
    { min: 100, max: 140, color: "yellow", text: "Moderate", activePieColor: "#f59e0b", pieColor: "#f59e0b40" },
    { min: 140, max: 160, color: "green", text: "Excellent", activePieColor: "#059669", pieColor: "#05966940" },
    { min: 160, max: Infinity, color: "red", text: "Poor", activePieColor: "#ef4444", pieColor: "#ef444440" },
  ],
  position: [
    { min: 0, max: 5, color: "green", text: "Excellent", activePieColor: "#059669", pieColor: "#05966940" },
    { min: 5, max: 10, color: "yellow", text: "Moderate", activePieColor: "#f59e0b", pieColor: "#f59e0b40" },
    { min: 10, max: Infinity, color: "red", text: "Poor", activePieColor: "#ef4444", pieColor: "#ef444440" },
  ],
};

const UserResultDetails = ({
  keywordData,
  domainUrl,
}: {
  keywordData: GoogleSearchLatestKeywordResult;
  domainUrl: string | undefined;
}) => {

  const copyUrlToClipboard = (url: string | null) => {
    if (!url) return;

    navigator.clipboard.writeText(url);
  }

  return (
    <div className="max-w-[500px] flex flex-col bg-white rounded-lg shadow-base px-5 py-4">
      <p className="mb-1 text-lg leading-7 font-medium text-gray-800">
        Result Overview
      </p>
      {/* Keyword */}
      <div className="py-3 flex justify-between items-center w-full border-b border-dashed border-gray-200">
        <p className="text-gray-800 font-medium">Keyword</p>
        <Pill color="primary" variant="text">
          {keywordData.keywordName}
        </Pill>
      </div>

      {/* Url */}
      <div className="py-3 flex justify-between items-center w-full border-b border-dashed border-gray-200">
        <p className="text-gray-800 font-medium">Url</p>
        <Tooltip>
          <TooltipTrigger>
            <Pill color="primary" variant="text" onClick={() => copyUrlToClipboard(keywordData.url)}>
              {
                domainUrl && keywordData.url ? (
                  (keywordData.url as string).length > MAX_URL_LENGTH
                    ? urlWithoutDomain(keywordData.url as string, domainUrl).substring(0, MAX_URL_LENGTH) + "..."
                    : urlWithoutDomain(keywordData.url as string, domainUrl)
                ) : (
                  (keywordData.url as string).length > MAX_URL_LENGTH
                    ? (keywordData.url as string).substring(0, MAX_URL_LENGTH) + "..."
                    : keywordData.url
                )
              }
            </Pill>
          </TooltipTrigger>
          <TooltipContent>
            Copy URL
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Position */}
      <div className="py-3 flex items-center w-full border-b border-dashed border-gray-200">
        <p className="text-gray-800 font-medium">Position</p>
        {keywordData.position && (
          <Pill
            color={getColorAndText(keywordData.position, CONFIG.position).color}
            variant="icon"
            className="ml-auto mr-2 flex gap-2 items-center"
          >
            <PieChartUserResultDetails
              item={getPieChartData(keywordData.position, CONFIG.position)}
            />
            {getColorAndText(keywordData.position, CONFIG.position).text}
          </Pill>
        )}
        <Pill color="primary" variant="text">
          #{keywordData.position}
        </Pill>
      </div>

      {/* Meta Title */}
      <div className="py-3 flex items-center w-full border-b border-dashed border-gray-200">
        <p className="text-gray-800 font-medium">Meta Title</p>
        {keywordData.position && (
          <Pill
            color={
              getColorAndText(
                keywordData.metaTitle?.length || 0,
                CONFIG.metaTitle,
              ).color
            }
            variant="icon"
            className="ml-auto mr-2 flex gap-2 items-center"
          >
            <PieChartUserResultDetails
              item={getPieChartData(
                keywordData.metaTitle?.length || 0,
                CONFIG.metaTitle,
              )}
            />
            {
              getColorAndText(
                keywordData.metaTitle?.length || 0,
                CONFIG.metaTitle,
              ).text
            }
          </Pill>
        )}
        <Pill color="primary" variant="text">
          {keywordData.metaTitle?.length || 0}/60
        </Pill>
      </div>
      <p className="py-3 text-base leading-6 font-normal text-gray-500">
        {keywordData.metaTitle}
      </p>

      {/* Meta Description */}
      <div className="py-3 flex items-center w-full border-b border-dashed border-gray-200">
        <p className="text-gray-800 font-medium">Meta Description</p>
        {keywordData.position && (
          <Pill
            color={
              getColorAndText(
                keywordData.metaDescription?.length || 0,
                CONFIG.metaDescription,
              ).color
            }
            variant="icon"
            className="ml-auto mr-2 flex gap-2 items-center"
          >
            <PieChartUserResultDetails
              item={getPieChartData(
                keywordData.metaDescription?.length || 0,
                CONFIG.metaDescription,
              )}
            />
            {
              getColorAndText(
                keywordData.metaDescription?.length || 0,
                CONFIG.metaDescription,
              ).text
            }
          </Pill>
        )}
        <Pill color="primary" variant="text">
          {keywordData.metaDescription?.length || 0}/160
        </Pill>
      </div>
      <p className="py-3 text-base leading-6 font-normal text-gray-500">
        {keywordData.metaDescription}
      </p>{" "}
    </div>
  );
};

export default UserResultDetails;

// red: #ef4444 #ef444440
// yellow: #f59eob #f59e0b40
// green: #059699 #05969940

type PieChartUserResultDetails = {
  item: {
    activePieColor: string;
    pieColor: string;
    data: { name: string; value: number }[];
  };
};

function PieChartUserResultDetails({ item }: PieChartUserResultDetails) {
  return (
    <PieChart width={20} height={20}>
      <Pie
        data={item.data}
        cx="50%"
        cy="50%"
        innerRadius={5}
        outerRadius={10}
        fill="#8884d8"
        dataKey="value"
      >
        <Cell fill={item.activePieColor} />
        <Cell fill={item.pieColor} />
      </Pie>
    </PieChart>
  );
}

/**
 * This function generates the data for a pie chart based on a given value and configuration.
 *
 * @param {number} value - The value to be represented on the pie chart.
 * @param {Array} CONFIG - The configuration array containing the pie chart settings.
 * Each item in the array should be an object with the following properties:
 * - min: The minimum value for this category.
 * - max: The maximum value for this category.
 * - activePieColor: The color of the active part of the pie chart.
 * - pieColor: The color of the inactive part of the pie chart.
 * - text: The name of this category.
 *
 * @returns {Object} An object containing the following properties:
 * - activePieColor: The color of the active part of the pie chart.
 * - pieColor: The color of the inactive part of the pie chart.
 * - data: An array of objects, each representing a part of the pie chart.
 * Each object in the data array has the following properties:
 * - name: The name of this part.
 * - value: The value of this part.
 */
const getPieChartData = (
  value: number,
  config: ConfigItem[],
): {
  activePieColor: string;
  pieColor: string;
  data: { name: string; value: number }[];
} => {
  for (let item of config) {
    // if the value is within the range of this category
    if (value >= item.min && value <= item.max) {
      // if the max value is infinity, we only have one part in the pie chart
      if (item.max === Infinity) {
        return {
          activePieColor: item.activePieColor,
          pieColor: item.pieColor,
          data: [{ name: item.text, value: 1 }],
        };
      }
      // if the value is equal to the max value, we only have one part in the pie chart
      return {
        activePieColor: item.activePieColor,
        pieColor: item.pieColor,
        data:
          value === item.max
            ? [{ name: item.text, value: value }]
            : [
              { name: item.text, value: value },
              { name: "Good", value: item.max - value },
            ],
      };
    }
  }
  // if the value is not within any of the categories, we return a default pie chart
  return {
    activePieColor: "#059669",
    pieColor: "#05966940",
    data: [
      { name: "Good", value: 0 },
      { name: "Good", value: 1 },
    ],
  };
};

interface ConfigItem {
  min: number;
  max: number | typeof Infinity;
  color: string;
  text: string;
  activePieColor: string;
  pieColor: string;
}

interface Config {
  metaTitle: ConfigItem[];
  metaDescription: ConfigItem[];
  position: ConfigItem[];
}

/**
 * This function determines the color and text for a pill based on a given value and configuration.
 *
 * @param {number} value - The value to be represented by the pill.
 * @param {Array} CONFIG - The configuration array containing the pill settings.
 * Each item in the array should be an object with the following properties:
 * - min: The minimum value for this category.
 * - max: The maximum value for this category.
 * - color: The color of the pill for this category.
 * - text: The text to be displayed on the pill for this category.
 *
 * @returns {Object} An object containing the following properties:
 * - color: The color of the pill.
 * - text: The text to be displayed on the pill.
 */
const getColorAndText = (
  value: number,
  config: ConfigItem[],
): { color: PillColor; text: string } => {
  for (let item of config) {
    if (value >= item.min && value <= item.max) {
      return { color: item.color as PillColor, text: item.text };
    }
  }
  return { color: "yellow", text: "Moderate" };
};

// const getPieChartData = (value: number, config: any[]): { activePieColor: string, pieColor: string, data: { name: string, value: number }[] } => {
//     for (let item of config) {
//         if (value >= item.min && value <= item.max) {
//             return {
//                 activePieColor: item.activePieColor,
//                 pieColor: item.pieColor,
//                 data: value === item.max
//                     ? [{ name: item.text, value: value }]
//                     : [
//                         { name: item.text, value: value },
//                         { name: 'Good', value: item.max - value }
//                       ]
//             };
//         }
//     }
//     return {
//         activePieColor: '#059669',
//         pieColor: '#05966940',
//         data: [
//             { name: 'Good', value: META_TITLE_LIMIT },
//             { name: 'Good', value: META_TITLE_LIMIT }
//         ]
//     };
// }
