import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from "chart.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import RequestsChart from "./RequestsChart";

ChartJS.register(ArcElement, Tooltip, Legend);

const BarChart: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDark = document.documentElement.classList.contains("dark");
          setTheme(isDark ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const chartColors = {
    green: "#22C55E", // Màu cho Chấp nhận
    red: "#EF4444",   // Màu cho Từ chối
  };

  // Số lượng thực tế
  const rawData = {
    accepted: 350, // Số yêu cầu được chấp nhận
    rejected: 150, // Số yêu cầu bị từ chối
  };

  const total = rawData.accepted + rawData.rejected; // Tổng số yêu cầu

  const doughnutData = {
    labels: ["Chấp nhận", "Từ chối"],
    datasets: [
      {
        label: "%",
        data: [rawData.accepted, rawData.rejected], // Dữ liệu là số lượng thực tế
        backgroundColor: [chartColors.green, chartColors.red],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        align: "center" as const,
        labels: {
          font: {
            size: 13,
            weight: 500,
          },
          color: theme === "dark" ? "#fff" : "#64748b",
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor:
          theme === "dark"
            ? "rgba(30, 41, 59, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
        titleColor: theme === "dark" ? "#fff" : "#1e293b",
        bodyColor: theme === "dark" ? "#cbd5e1" : "#475569",
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        bodyFont: {
          size: 13,
        },
        titleFont: {
          size: 14,
          weight: 600,
        },
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "75%",
    radius: "90%",
  };

  return (
    <div className="flex flex-row space-x-6">
      <div className="w-[70%]">
        <RequestsChart />
      </div>

      <div className="bg-background border border-border rounded-xl p-6 shadow-sm w-[30%] hover:shadow-md transition-shadow duration-200">
        <div className="h-[350px] flex flex-col">
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            Tỷ lệ xử lý yêu cầu
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Phân bố giữa yêu cầu được chấp nhận và từ chối
          </p>
          <div className="flex-1 flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;