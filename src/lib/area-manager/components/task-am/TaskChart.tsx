import * as React from "react";
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Tháng 1", thongThuong: 22, theoYeuCau: 11 },
  { month: "Tháng 2", thongThuong: 18, theoYeuCau: 12 },
  { month: "Tháng 3", thongThuong: 27, theoYeuCau: 14 },
  { month: "Tháng 4", thongThuong: 23, theoYeuCau: 12 },
  { month: "Tháng 5", thongThuong: 29, theoYeuCau: 10 },
  { month: "Tháng 6", thongThuong: 14, theoYeuCau: 6 },
  { month: "Tháng 7", thongThuong: 11, theoYeuCau: 8 },
  { month: "Tháng 8", thongThuong: 15, theoYeuCau: 15 },
  { month: "Tháng 9", thongThuong: 17, theoYeuCau: 13 },
  { month: "Tháng 10", thongThuong: 16, theoYeuCau: 11 },
  { month: "Tháng 11", thongThuong: 17, theoYeuCau: 12 },
  { month: "Tháng 12", thongThuong: 13, theoYeuCau: 13 },
]

const chartConfig = {
  thongThuong: {
    label: "Thông thường",
    color: "hsl(var(--chart-1))",
  },
  theoYeuCau: {
    label: "Theo yêu cầu",
    color: "hsl(var(--chart-2))",
  },
} as any;

export default function TaskChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu đồ công việc</CardTitle>
        <CardDescription>Tháng 1 - Tháng 12 2024</CardDescription>
      </CardHeader>
      <CardContent >
        <ChartContainer config={chartConfig} className="flex items-center justify-center h-[450px] w-full" >
          <BarChart
            data={chartData}
          >
            <CartesianGrid vertical={false} />
            {/* @ts-ignore */}
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value} 
              interval={0}
              height={30} 
              textAnchor="middle" 
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="thongThuong" fill="var(--color-thongThuong)" radius={4} />
            <Bar dataKey="theoYeuCau" fill="var(--color-theoYeuCau)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}