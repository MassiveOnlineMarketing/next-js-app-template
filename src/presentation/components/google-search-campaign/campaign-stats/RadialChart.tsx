"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"


import { ChartConfig, ChartContainer } from "@/presentation/components/ui/chart"
import { useTheme } from "next-themes"

export function RadialChart({ value, total }: { value: number, total: number }) {
  const dataValue = value ? value : 0
  const chartData = [
    { browser: "safari", visitors: dataValue, fill: "#7857FE" },
  ]

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    }
  } satisfies ChartConfig

  const { theme } = useTheme()
  console.log('theme',theme)

  const startingAngle = 0
  const endingAngle = calculateEndingAngle(value, total)

  function calculateEndingAngle(value: number, total: number) {
    const percentage = value / total
    const endingAngle = 360 * percentage

    return endingAngle + startingAngle
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="max-w-[60px] max-h-[60px] w-full h-full"
    >
      <RadialBarChart
        width={60}
        height={60}
        data={chartData}
        startAngle={startingAngle}
        endAngle={endingAngle}
        innerRadius={26}
        outerRadius={50}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="#d3d3d3"
          fill="#fff"
          strokeWidth={4}
          polarRadius={[25, 27]}
        />
        <RadialBar dataKey="visitors" background={{ fill: '#d3d3d3' }} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-xl font-bold"
                      fill={
                        theme === 'dark' ? "#DFE5FA" : "#7857FE"
                      }
                    >
                      {chartData[0].visitors.toLocaleString()}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}
