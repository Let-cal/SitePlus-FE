import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts/lib/index.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import managerService from "../../../../services/manager/manager.service";

// Định nghĩa interface cho dữ liệu biểu đồ
interface ChartData {
  date: string; // Ví dụ: "2025-01-01"
  requests: number;
}

// Định nghĩa interface cho dữ liệu từ API
interface MonthlyRequest {
  month: string; // Ví dụ: "03/2025"
  count: number;
}

type ChartConfigType = {
  stats: {
    label: string;
  };
  requests: {
    label: string;
    color: string;
  };
};

const chartConfig = {
  stats: {
    label: "Thống kê",
  },
  requests: {
    label: "Yêu cầu",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfigType;

export default function RequestsChart() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("requests");
  const [selectedYear, setSelectedYear] = React.useState<string>("2025");
  const [availableYears, setAvailableYears] = React.useState<string[]>([]);
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [apiData, setApiData] = React.useState<MonthlyRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [animationKey, setAnimationKey] = React.useState<number>(0);

  // Tính tổng số yêu cầu
  const total = React.useMemo(
    () => ({
      requests: chartData.reduce((acc, curr) => acc + curr.requests, 0),
    }),
    [chartData]
  );

  // Gọi API để lấy dữ liệu
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const chartResponse = await managerService.fetchBrandRequestChart();
        if (chartResponse && chartResponse.data.monthlyRequests) {
          // Lưu dữ liệu gốc từ API
          setApiData(chartResponse.data.monthlyRequests);

          // Lấy danh sách các năm từ dữ liệu API
          const years = Array.from(
            new Set(
              chartResponse.data.monthlyRequests.map((item) => item.month.split("/")[1])
            )
          ).sort();
          setAvailableYears(years);

          // Nếu không có năm nào trong API, mặc định là [2025]
          if (years.length === 0) {
            setAvailableYears(["2025"]);
            setSelectedYear("2025");
          } else {
            // Chọn năm mới nhất làm mặc định
            setSelectedYear(years[years.length - 1]);
          }
        }
      } catch (error) {
        console.error("Error fetching brand request chart data:", error);
        setChartData([]);
      } finally {
        setIsLoading(false);
        setAnimationKey((prev) => prev + 1);
      }
    };

    fetchData();
  }, []);

  // Cập nhật dữ liệu biểu đồ khi API data hoặc selectedYear thay đổi
  React.useEffect(() => {
    // Tạo mảng 12 tháng cố định cho năm được chọn
    const allMonths: ChartData[] = Array.from({ length: 12 }, (_, i) => {
      return {
        date: `${selectedYear}-${String(i + 1).padStart(2, "0")}-01`,
        requests: 0,
      };
    });

    // Ghép dữ liệu từ API vào mảng 12 tháng
    apiData.forEach((item) => {
      const [month, year] = item.month.split("/");
      if (year === selectedYear) {
        const monthIndex = parseInt(month) - 1;
        allMonths[monthIndex] = {
          date: `${year}-${month}-01`,
          requests: item.count,
        };
      }
    });

    setChartData(allMonths);
    setAnimationKey((prev) => prev + 1);
  }, [apiData, selectedYear]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Tổng Yêu Cầu Nhận Được</CardTitle>
          <CardDescription>
            Tổng quan số lượng yêu cầu hàng tháng trong năm {selectedYear} {/* Cập nhật năm động */}
          </CardDescription>
        </div>
        <div className="flex items-center">
          <div className="pr-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            {/* Đang tải dữ liệu... */}
          </div>
        ) : chartData.every((item) => item.requests === 0) ? (
          <div className="flex items-center justify-center h-[250px] text-gray-500">
            Không có dữ liệu để hiển thị
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
            key={`chart-container-${animationKey}`}
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
                minTickGap={0}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `Tháng ${date.getMonth() + 1}`;
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("vi-VN", {
                        month: "long",
                        year: "numeric",
                      });
                    }}
                    formatter={(value) => `${value.toLocaleString()} yêu cầu`}
                  />
                }
              />
              <Bar
                dataKey={activeChart}
                fill={`var(--color-${activeChart})`}
                radius={4}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}