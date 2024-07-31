import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { GoogleSearchSerpResult } from "@prisma/client";

const SerpResultCard = ({ result }: { result: GoogleSearchSerpResult }) => {
  const url = new URL(result.url);
  const domainName = url.hostname
    .replace("www.", "")
    .split(".")
    .slice(0, -1)
    .join(".");

  const { metaTitle, metaDescription } = result;

  return (
    <div key={result.id} className="mb-4">
      <a href={result.url || ""} target="_blank" rel="noopener noreferrer">
        <div className="mb-1 flex gap-[6px] items-center">
          <div className="w-8 h-8 flex items-center justify-center bg-primary-50 rounded-full">
            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <p className="text-gray-800">{domainName}</p>
            <p className="-mt-1 text-gray-500 text-sm">
              {result.url.length > 60
                ? `${result.url.slice(0, 60)}...`
                : result.url}
            </p>
          </div>
        </div>

        <p className="mb-1 text-2xl leading-6 text-primary-600">{metaTitle}</p>
        <p className="text-sm text-gray-800">{metaDescription}</p>
      </a>
    </div>
  );
};

export default SerpResultCard;
