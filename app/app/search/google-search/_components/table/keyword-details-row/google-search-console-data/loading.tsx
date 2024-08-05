import { LoadingSpinner } from "@/presentation/components/ui/loading-spinner";
import { cn } from "@/presentation/components/utils";

type SearchConsoleLoadingProps = {
  title: string;
  borderColor: string;
  backgroundGradientColor: string;
};

const SearchConsoleLoading = ({
  title,
  borderColor,
  backgroundGradientColor,
}: SearchConsoleLoadingProps) => {
  return (
    <div
      className={`w-full h-full border border-${borderColor} rounded-2xl p-[6px]`}
    >
      <div
        className={cn(
          "relative w-full h-full border rounded-xl",
          `border-${borderColor} bg-gradient-to-b from-white to-[#${backgroundGradientColor}]`,
        )}
      >
        <h2 className="ml-4 mt-4 text-base leading-6 font-medium text-gray-800">
          {title}
        </h2>
        <LoadingSpinner className="absolute left-1/2 top-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
};

export default SearchConsoleLoading;