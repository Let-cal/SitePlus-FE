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
  client: {
    label: string;
    color: string;
  };
  manager: {
    label: string;
    color: string;
  };
  area_Manager: {
    label: string;
    color: string;
  };
  staff: {
    label: string;
    color: string;
  };
};

const chartData = [
  {
    date: "2024-01-01",
    client: 15000,
    manager: 16000,
    area_Manager: 12000,
    staff: 11000,
  },
  {
    date: "2024-02-01",
    client: 17500,
    manager: 18500,
    area_Manager: 14000,
    staff: 13000,
  },
  {
    date: "2024-03-01",
    client: 16800,
    manager: 17800,
    area_Manager: 13500,
    staff: 12500,
  },
  {
    date: "2024-04-01",
    client: 19200,
    manager: 20200,
    area_Manager: 15000,
    staff: 14000,
  },
  {
    date: "2024-05-01",
    client: 22000,
    manager: 23000,
    area_Manager: 18000,
    staff: 16000,
  },
  {
    date: "2024-06-01",
    client: 21500,
    manager: 22500,
    area_Manager: 17500,
    staff: 15500,
  },
  {
    date: "2024-07-01",
    client: 23000,
    manager: 24000,
    area_Manager: 19000,
    staff: 17000,
  },
  {
    date: "2024-08-01",
    client: 25000,
    manager: 26000,
    area_Manager: 20000,
    staff: 18000,
  },
  {
    date: "2024-09-01",
    client: 24500,
    manager: 25500,
    area_Manager: 19500,
    staff: 17500,
  },
  {
    date: "2024-10-01",
    client: 26000,
    manager: 27000,
    area_Manager: 21000,
    staff: 19000,
  },
  {
    date: "2024-11-01",
    client: 27500,
    manager: 28500,
    area_Manager: 22000,
    staff: 20000,
  },
  {
    date: "2024-12-01",
    client: 28000,
    manager: 29000,
    area_Manager: 23000,
    staff: 21000,
  },
];

const chartConfig = {
  stats: {
    label: "Statistics",
  },
  client: {
    label: "Clients",
    color: "#4CAF50", // Example color for clients
  },
  manager: {
    label: "Managers",
    color: "#2196F3", // Example color for managers
  },
  area_Manager: {
    label: "Area Managers",
    color: "#FFC107", // Example color for area managers
  },
  staff: {
    label: "Staff",
    color: "#FF5722", // Example color for staff
  },
} satisfies ChartConfig;

export default function UsersChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("client");

  const total = React.useMemo(
    () => ({
      client: chartData.reduce((acc, curr) => acc + curr.client, 0),
      manager: chartData.reduce((acc, curr) => acc + curr.manager, 0),
      area_Manager: chartData.reduce((acc, curr) => acc + curr.area_Manager, 0),
      staff: chartData.reduce((acc, curr) => acc + curr.staff, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Users Statistics</CardTitle>
          <CardDescription>Monthly users overview for the year</CardDescription>
        </div>
        <div className="flex">
          {["client", "manager", "area_Manager", "staff"].map((key) => {
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
