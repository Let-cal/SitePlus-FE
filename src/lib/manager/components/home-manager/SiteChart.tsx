import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import managerService from "../../../../services/manager/manager.service"; // Sử dụng managerService

// Định nghĩa interface cho dữ liệu biểu đồ
interface ChartData {
  month: string; // Ví dụ: "Tháng 1"
  surveyCount: number; // Số lượng mặt bằng khảo sát
}

// Định nghĩa interface cho dữ liệu từ API
interface MonthlySiteSurvey {
  month: string; // Ví dụ: "02/2025"
  count: number;
}

// Cấu hình biểu đồ
const chartConfig = {
  surveyCount: {
    label: "Số lượng khảo sát",
    color: "hsl(var(--chart-1))",
  },
} as any;

export default function SiteChart() {
  const [chartData, setChartData] = React.useState<ChartData[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<string>("2025"); // Mặc định là năm 2025
  const [availableYears, setAvailableYears] = React.useState<string[]>([]); // Danh sách các năm từ API
  const [apiData, setApiData] = React.useState<MonthlySiteSurvey[]>([]); // Lưu dữ liệu gốc từ API
  const [isLoading, setIsLoading] = React.useState<boolean>(true); // Thêm isLoading để kiểm soát render
  const [animationKey, setAnimationKey] = React.useState<number>(0); // Thêm animationKey để buộc re-render

  // Gọi API để lấy dữ liệu dashboard
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dashboardData = await managerService.fetchDashboardStatistics();
        if (dashboardData && dashboardData.data.monthlySiteSurveys) {
          // Lưu dữ liệu gốc từ API
          setApiData(dashboardData.data.monthlySiteSurveys);

          // Lấy danh sách các năm từ dữ liệu API
          const years = Array.from(
            new Set(
              dashboardData.data.monthlySiteSurveys.map((item) => item.month.split("/")[1])
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
        console.error("Error fetching dashboard data:", error);
        setChartData([]); // Đặt chartData rỗng nếu có lỗi
      } finally {
        setIsLoading(false);
        setAnimationKey((prev) => prev + 1); // Tăng animationKey để buộc re-animation
      }
    };

    fetchData();
  }, [selectedYear]); // Thêm selectedYear vào dependency để fetch lại khi năm thay đổi

  // Cập nhật dữ liệu biểu đồ khi API data thay đổi
  React.useEffect(() => {
    // Tạo mảng 12 tháng cố định cho năm được chọn
    const allMonths: ChartData[] = Array.from({ length: 12 }, (_, i) => {
      return {
        month: `Tháng ${i + 1}`,
        surveyCount: 0,
      };
    });

    // Ghép dữ liệu từ API vào mảng 12 tháng
    apiData.forEach((item) => {
      const [month, year] = item.month.split("/");
      if (year === selectedYear) {
        const monthIndex = parseInt(month) - 1;
        allMonths[monthIndex] = {
          month: `Tháng ${parseInt(month)}`,
          surveyCount: item.count, // Sử dụng count thay vì totalTasks
        };
      }
    });

    setChartData(allMonths);
  }, [apiData, selectedYear]);

  // Xác định khoảng thời gian hiển thị (luôn là cả năm)
  const timeRange = `Tháng 1 - Tháng 12 ${selectedYear}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Biểu đồ mặt bằng khảo sát</CardTitle>
            <CardDescription>{timeRange}</CardDescription>
          </div>
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[450px] text-gray-500">
            {/* Đang tải dữ liệu... */}
          </div>
        ) : chartData.every((item) => item.surveyCount === 0) ? (
          <div className="flex items-center justify-center h-[450px] text-gray-500">
            Không có dữ liệu để hiển thị
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="flex items-center justify-center h-[450px] w-full"
            key={`chart-container-${animationKey}`}
          >
            <BarChart data={chartData}>
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
              <Bar
                dataKey="surveyCount" // Thay totalTasks thành surveyCount
                fill="var(--color-surveyCount)"
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