import { cn } from "@/presentation/components/utils";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, TooltipProps } from "recharts";
import { capitalizeFirstLetter } from "@/presentation/utils/stringUtils";

export interface GoogleSearchConsoleChartData {
  date: string;
  clicks: number;
  ctr: number;
  impressions: number;
  position: number;
}
type GoogleSearchConsoleChartProps = {
  data: GoogleSearchConsoleChartData[];
  positionDomain: [number, number];

  dataKey: string;
  color: string;
  title: string;
  interactive?: boolean;
  reverse?: boolean;
}

const GoogleSearchConsoleChart = ({ data, positionDomain, dataKey, color, title, interactive = true, reverse }: GoogleSearchConsoleChartProps) => {
  const baseValue = reverse ? positionDomain[1] : positionDomain[0];
  return (
    <ResponsiveContainer width="100%" height="100%" style={{ borderRadius: 23, overflow: 'hidden' }} className={cn(
      interactive ? 'opacity-100' : 'opacity-20 dark:opacity-50',
      // reverse && 'pb-20'
    )}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`color${title}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={color}
              stopOpacity={0.6}
            />
            <stop
              offset="85%"
              stopColor={color}
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <XAxis hide={true} dataKey="date" />
        <YAxis hide={true} axisLine={false} domain={positionDomain} reversed={reverse} />
        {interactive && <Tooltip wrapperStyle={{ zIndex: 9999 }} content={< CustomTooltip />} />}
        <Area
          type="monotoneX"
          dataKey={dataKey}
          stroke={color}
          fill={`url(#color${title})`}
          baseValue={baseValue}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const CustomTooltip = ({payload, label }: TooltipProps<string, string>) => {

  return (
    <div
      className='p-3 bg-white shadow-md rounded-lg debug dark:bg-dark-bg-light dark:border dark:border-dark-stroke backdrop-blur'
    >
      <p>{label}</p>
      <div>
        {payload?.map((entry, index) => (
          <div key={index}>
            <span style={{ color: entry.color }}>{entry.name ? capitalizeFirstLetter(entry.name) : ''}</span> : {entry.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleSearchConsoleChart;