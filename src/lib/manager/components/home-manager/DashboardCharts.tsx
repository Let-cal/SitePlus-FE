import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardCharts: React.FC = () => {
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
    blue: "#3B82F6",
    orange: "#F97316",
    green: "#22C55E",
    red: "#EF4444",
  };

  const barData = {
    labels: ["Number of Requests", "Successful Surveys"],
    datasets: [
      {
        label: "Quantity",
        data: [650, 520],
        backgroundColor: [`${chartColors.orange}dd`, `${chartColors.blue}dd`],
        borderRadius: 8,
        barThickness: 80,
        maxBarThickness: 100,
        hoverBackgroundColor: [chartColors.orange, chartColors.blue],
      },
    ],
  };

  const pieData = {
    labels: ["Completed Tasks", "Pending Tasks"],
    datasets: [
      {
        label: "Tasks",
        data: [300, 150],
        backgroundColor: [`${chartColors.green}dd`, `${chartColors.red}dd`],
        hoverBackgroundColor: [chartColors.green, chartColors.red],
        borderWidth: 0,
      },
    ],
  };

  const barOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
          label: (context) => `${context.label}: ${context.formattedValue}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === "dark" ? "#cbd5e1" : "#475569",
          font: {
            size: 13,
            weight: 500,
          },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        ticks: {
          color: theme === "dark" ? "#cbd5e1" : "#475569",
          font: {
            size: 12,
          },
          padding: 8,
          callback: (value) => value.toLocaleString(),
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(203, 213, 225, 0.1)"
              : "rgba(71, 85, 105, 0.1)",
          lineWidth: 1,
        },
      },
    },
  };

  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          color: theme === "dark" ? "#cbd5e1" : "#475569",
          font: {
            size: 13,
            weight: 500,
          },
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
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "65%",
  };

  return (
    <div className="flex flex-row gap-6">
      <div className="w-[70%]">
        <div className="w-full bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col gap-2 mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Number of Requests and Successful Surveys
            </h3>
            <p className="text-sm text-muted-foreground">
              Overview of total requests and successful survey completion rates
            </p>
          </div>
          <div className="w-full h-[400px] flex items-center justify-center">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      <div className="w-[30%]">
        <div className="w-full bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col gap-2 mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Task Completion Status
            </h3>
            <p className="text-sm text-muted-foreground">
              Distribution of completed vs pending tasks
            </p>
          </div>
          <div className="w-full h-[400px] flex items-center justify-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
