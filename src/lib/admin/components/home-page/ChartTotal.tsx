import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
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
import { adminService } from "@/services/admin/admin.service";
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts/lib/index.js";

type ChartConfig = {
  stats: {
    label: string;
  };
  requests: {
    label: string;
    color: string;
  };
  users: {
    label: string;
    color: string;
  };
};

type ChartDataItem = {
  date: string;
  requests: number;
  users: number;
};

const chartConfig = {
  stats: {
    label: "Thống kê",
  },
  requests: {
    label: "Yêu cầu",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "Người dùng",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function UsageChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("requests");
  const [selectedYear, setSelectedYear] = React.useState<string>(
    new Date().getFullYear().toString()
  );
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [animationKey, setAnimationKey] = React.useState<number>(0);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // Lấy dữ liệu từ AdminService
      const usersResponse = await adminService.getTotalUsersByMonth(
        parseInt(selectedYear)
      );
      const requestsResponse = await adminService.getTotalRequestsByMonth(
        parseInt(selectedYear)
      );

      // Xử lý và kết hợp dữ liệu
      const processedData: ChartDataItem[] = Array.from(
        { length: 12 },
        (_, index) => {
          const monthNumber = index + 1;
          const userItem = usersResponse.find(
            (item) => item.month === monthNumber
          );
          const requestItem = requestsResponse.find(
            (item) => item.month === monthNumber
          );

          // Tạo chuỗi ngày theo định dạng "YYYY-MM-01"
          const dateStr = `${selectedYear}-${monthNumber
            .toString()
            .padStart(2, "0")}-01`;

          return {
            date: dateStr,
            users: userItem?.total || 0,
            requests: requestItem?.total || 0,
          };
        }
      );

      setChartData(processedData);
      // Tăng giá trị animationKey để buộc re-animation
      setAnimationKey((prev) => prev + 1);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu biểu đồ:", error);
      // Thiết lập dữ liệu rỗng nếu có lỗi
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const total = React.useMemo(
    () => ({
      requests: chartData.reduce((acc, curr) => acc + curr.requests, 0),
      users: chartData.reduce((acc, curr) => acc + curr.users, 0),
    }),
    [chartData]
  );

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 0; year <= currentYear; year++) {
      years.push(year.toString());
    }
    return years;
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  // Hàm format số với số 0 đằng trước nếu dưới 10
  const formatTotalWithLeadingZero = (value: number) => {
    // Chuyển đổi số thành chuỗi với dấu phân cách hàng nghìn
    const formattedNumber = value.toLocaleString();

    // Thêm số 0 đằng trước nếu số nhỏ hơn 10
    if (value < 10) {
      return `0${formattedNumber}`;
    }

    return formattedNumber;
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Thống kê tổng</CardTitle>
              <CardDescription>
                Tổng quan yêu cầu và người dùng theo tháng
              </CardDescription>
            </div>
            <div className="w-32">
              <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn năm" />
                </SelectTrigger>
                <SelectContent>
                  {generateYearOptions().map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                  {/* <SelectItem value="2025">2025</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex">
          {["requests", "users"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {formatTotalWithLeadingZero(total[key as keyof typeof total])}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
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
              animationDuration={800}
              animationBegin={0}
              animationEasing="ease-out"
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
                  return date.toLocaleDateString("vi-VN", {
                    month: "short",
                  });
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
                  />
                }
              />
              <Bar
                dataKey={activeChart}
                fill={`var(--color-${activeChart})`}
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
