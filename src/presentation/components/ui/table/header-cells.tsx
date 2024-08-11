import { Column, SortDirection } from "@tanstack/react-table";

import { cn } from "@/presentation/components/utils";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";


const SortingIndicator = (props: { sorting: false | SortDirection }) => {
  if (props.sorting === "asc") {
    return <ArrowsUpDownIcon className="w-5 h-5 text-gray-600 dark:text-[#DFE5FA]/25 ml-3" />
  } else if (props.sorting === "desc") {
    return <ArrowsUpDownIcon className="w-5 h-5 text-gray-600 dark:text-[#DFE5FA]/25 ml-3 rotate-180" />
  } else {
    return null;
  }
}

interface ColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>,
  title: string,
  sorting?: boolean,
  tooltip?: string
}

const StandardHeaderCell: React.FC<ColumnHeaderProps<any, any>> = ({ column, title, sorting }) => {
  const onClick = sorting ? () => column.toggleSorting(column.getIsSorted() === "asc") : undefined;

  return (
    <p
      className={cn(
        "flex items-center text-sm leading-5 font-medium text-gray-600 dark:text-[#DFE5FA]/50 text-nowrap",
        sorting && "cursor-pointer",
      )}
      onClick={onClick}
    >
      {title}
      {sorting && <SortingIndicator sorting={column.getIsSorted()} />}
    </p>
  );
}

export { StandardHeaderCell }