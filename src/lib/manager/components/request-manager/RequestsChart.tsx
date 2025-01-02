import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts/lib/index.js";

import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { ChartContainer } from "@/components/ui/chart";

type ChartConfig = {
  stats: {
    label: string;
  };
  requests: {
    label: string;
    color: string;
  };
};

const chartData = [
  { date: "2024-01-01", requests: 15000 },
  { date: "2024-02-01", requests: 17500 },
  { date: "2024-03-01", requests: 16800 },
  { date: "2024-04-01", requests: 19200 },
  { date: "2024-05-01", requests: 22000 },
  { date: "2024-06-01", requests: 21500 },
  { date: "2024-07-01", requests: 23000 },
  { date: "2024-08-01", requests: 25000 },
  { date: "2024-09-01", requests: 24500 },
  { date: "2024-10-01", requests: 26000 },
  { date: "2024-11-01", requests: 27500 },
  { date: "2024-12-01", requests: 28000 },
];

const chartConfig = {
  stats: {
    label: "Statistics",
  },
  requests: {
    label: "Requests",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function RequestsChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("requests");

  const total = React.useMemo(
    () => ({
      requests: chartData.reduce((acc, curr) => acc + curr.requests, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total Statistics</CardTitle>
          <CardDescription>
            Monthly requests overview for the year
          </CardDescription>
        </div>
        <div className="flex">
          {["requests"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
