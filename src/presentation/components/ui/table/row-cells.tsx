import { urlWithoutDomain } from "@/presentation/lib/utils";
import { cn } from "@/presentation/components/utils";

import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from "@heroicons/react/20/solid";
import { format, parseISO, isValid } from 'date-fns';

interface ColumnRowCellProps {
  value: string | number | null | undefined;
  highlight?: boolean
}

const StandardRowCell: React.FC<ColumnRowCellProps> = ({ value, highlight }) => {
  return (
    <p className={cn(
      "text-sm leading-5 font-normal",
      highlight ? 'text-gray-800 dark:text-dark-text-light' : 'text-gray-500 dark:text-dark-text-dark'
    )}>
      {value}
    </p>
  );
}


interface TrendingIndicatorProps {
  value: number | null;
}

const TrendingIndicatorRowCell: React.FC<TrendingIndicatorProps> = ({ value }) => {
  let colorClass = "";
  let icon = null;

  if (value) {
    if (value > 0) {
      colorClass = "";
      icon = <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    } else if (value < 0) {
      colorClass = "";
      icon = <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />;
    }
  }

  return (
    <div className="flex gap-[2px] items-center">
      <span className={cn(
        'text-sm leading-5 font-normal text-gray-500 dark:text-dark-text-dark',
        colorClass
      )}>{value}</span>
      {icon}
    </div>
  );
}


interface DateRowCellProps {
  value: Date | string;
}
const DateRowCell: React.FC<DateRowCellProps> = ({ value }) => {
  if (value && isValid(value)) {
    const date = value instanceof Date ? value : parseISO(value.toString());
    if (isValid(date)) {
      return (
        <p className="text-sm leading-5 font-normal text-gray-500 dark:text-dark-text-dark">
          {format(date, "MM/dd/yyyy")}
        </p>
      );
    }
  }

  return (
    <p className="text-sm leading-5 font-normal text-gray-500 dark:text-dark-text-dark">
      Not yet Checked
    </p>
  );
};

export default DateRowCell;


interface UrlRowCellProps {
  value: string | null;
  domainUrl?: string;
}

const UrlRowCell: React.FC<UrlRowCellProps> = ({ value, domainUrl }) => {
  const url = value;

  if (url === null || url === undefined || url === "") {
    return (
      <p className="max-auto text-sm leading-5 font-normal text-gray-500 dark:text-dark-text-dark">
        No Result Found
      </p>
    );
  }

  return (
    <p className="mx-auto text-sm leading-5 font-normal text-gray-500 dark:text-dark-text-dark">
      {
        domainUrl ? (
          url.length > 52
            ? urlWithoutDomain(url, domainUrl).substring(0, 52) + "..."
            : urlWithoutDomain(url, domainUrl)
        ) : (
          url.length > 52
            ? url.substring(0, 52) + "..."
            : url
        )
      }
    </p>
  );
}


export { StandardRowCell, TrendingIndicatorRowCell, DateRowCell, UrlRowCell }

