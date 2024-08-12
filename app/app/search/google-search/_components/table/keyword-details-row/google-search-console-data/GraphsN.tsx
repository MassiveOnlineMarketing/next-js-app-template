import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

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
}

const GoogleSearchConsoleChart = ({ data, positionDomain, dataKey, color, title, interactive = true }: GoogleSearchConsoleChartProps) => {

  return (
    <ResponsiveContainer width="100%" height="100%" style={{ borderRadius: 23, overflow: 'hidden' }} className={ interactive ? 'opacity-100' : 'opacity-20 dark:opacity-50'}>
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
        <YAxis hide={true} axisLine={false} domain={positionDomain} />
        {interactive && <Tooltip />}
        <Area
          type="monotoneX"
          dataKey={dataKey}
          stroke={color}
          fill={`url(#color${title})`}
          baseValue={positionDomain[0]} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default GoogleSearchConsoleChart;