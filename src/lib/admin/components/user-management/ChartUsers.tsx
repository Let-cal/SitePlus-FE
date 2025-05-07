import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts/lib/index.js";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  adminService,
  UserRoleCountByMonth,
} from "@/services/admin/admin.service";

// Định nghĩa interface cho dữ liệu biểu đồ
interface UserRoleChartData {
  date: string;
  manager: number;
  area_Manager: number;
  staff: number;
}

// Định nghĩa config cho biểu đồ
type ChartConfig = {
  stats: {
    label: string;
    color: string;
    fillColor: string;
  };
  manager: {
    label: string;
    color: string;
    fillColor: string;
  };
  area_Manager: {
    label: string;
    color: string;
    fillColor: string;
  };
  staff: {
    label: string;
    color: string;
    fillColor: string;
  };
};

const chartConfig = {
  stats: {
    label: "Thống kê",
    color: "#9E9E9E",
    fillColor: "#9E9E9E20",
  },
  manager: {
    label: "Quản lý",
    color: "#2196F3",
    fillColor: "#2196F320",
  },
  area_Manager: {
    label: "Quản lý khu vực",
    color: "#FFC107",
    fillColor: "#FFC10720",
  },
  staff: {
    label: "Nhân viên",
    color: "#FF5722",
    fillColor: "#FF572220",
  },
} satisfies ChartConfig;

export default function UsersChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("manager");
  const [chartData, setChartData] = React.useState<UserRoleChartData[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<string>(
    new Date().getFullYear().toString()
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [key, setKey] = React.useState<number>(0); // State để khởi động lại animation

  // Hàm tạo danh sách năm cho select option
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
    // Reset key để khi dữ liệu mới được tải, animation sẽ chạy lại
    setKey((prevKey) => prevKey + 1);
  };

  // Hàm chuyển đổi dữ liệu từ API sang định dạng cho biểu đồ
  const transformApiDataToChartData = (
    apiData: UserRoleCountByMonth[]
  ): UserRoleChartData[] => {
    return apiData.map((item) => {
      // Tạo ngày từ tháng và năm
      const date = new Date(parseInt(selectedYear), item.month - 1, 1);
      const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      return {
        date: formattedDate,
        manager: item.manager,
        area_Manager: item.areaManager,
        staff: item.staff,
      };
    });
  };

  // Fetching data từ API
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await adminService.getUserCountByRolePerMonth(
          selectedYear
        );
        const transformedData = transformApiDataToChartData(response);
        setChartData(transformedData);
        // Kích hoạt lại animation
        setKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.error("Failed to fetch user count data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  // Khi thay đổi loại biểu đồ, cũng kích hoạt lại animation
  const handleChartTypeChange = (chart: keyof typeof chartConfig) => {
    setActiveChart(chart);
    setKey((prevKey) => prevKey + 1);
  };

  const total = React.useMemo(
    () => ({
      manager: chartData.reduce((acc, curr) => acc + curr.manager, 0),
      area_Manager: chartData.reduce((acc, curr) => acc + curr.area_Manager, 0),
      staff: chartData.reduce((acc, curr) => acc + curr.staff, 0),
    }),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tăng trưởng người dùng</CardTitle>
              <CardDescription>
                Xu hướng tăng trưởng người dùng hàng tháng trong năm
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
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex">
          {["manager", "area_Manager", "staff"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => handleChartTypeChange(chart)}
              >
                <span className="text-xs text-muted-foreground whitespace-nowrap">
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
          <div className="flex h-[250px] w-full items-center justify-center">
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : (
          <ChartContainer
            key={key} // Thêm key để re-render và kích hoạt lại animation
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
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
              <Area
                type="monotone"
                dataKey={activeChart}
                stroke={chartConfig[activeChart].color}
                fill={chartConfig[activeChart].fillColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                fillOpacity={1}
                isAnimationActive={true}
                animationDuration={1500}
                animationBegin={0}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
