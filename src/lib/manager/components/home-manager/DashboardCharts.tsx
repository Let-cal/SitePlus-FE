import  { useEffect, useState } from "react";
import * as React from "react";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const DashboardCharts: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Kiểm tra theme hiện tại
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

    // Theo dõi thay đổi theme
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setTheme(isDark ? 'dark' : 'light');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Define chart colors
  const chartColors = {
    blue: '#3B82F6',
    green: '#22C55E',
    purple: '#A855F7',
    orange: '#F97316',
  };

  // Bar chart data
  const barData = {
    labels: ["Số lượng yêu cầu", "Khảo sát thành công"],
    datasets: [
      {
        label: "Số lượng",
        data: [650, 520],
        backgroundColor: [chartColors.orange, chartColors.blue],
        barThickness: 20,
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
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: theme === 'dark' ? '#000' : '#fff',
        bodyColor: theme === 'dark' ? '#000' : '#fff',
        padding: 12,
        cornerRadius: 4,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
          font: {
            size: 12,
            weight: 500,
          },
        },
        border: {
          display: false,
        }
      },
      y: {
        beginAtZero: true,
        border: {
          display: false,
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
          font: {
            size: 12,
          },
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          lineWidth: 1,
        },
      },
    },
  };

  // Doughnut chart data
  const doughnutData = {
    labels: ["Tìm mặt bằng mới", "Đánh giá mặt bằng"],
    datasets: [
      {
        label: "%",
        data: [38, 62],
        backgroundColor: [chartColors.purple, chartColors.green],
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
        position: "right" as const,
        labels: {
          font: {
            size: 12,
            weight: 500,
          },
          color: theme === 'dark' ? '#fff' : '#000',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        titleColor: theme === 'dark' ? '#000' : '#fff',
        bodyColor: theme === 'dark' ? '#000' : '#fff',
        padding: 12,
        cornerRadius: 4,
      }
    },
    cutout: "70%",
    radius: "80%",
  };

  return (
    <div className="flex flex-row justify-between gap-8">
      <div className="w-1/2 bg-background border border-border rounded-lg p-6 shadow-md" style={{ height: "500px" }}>
        <h3 className="text-lg font-semibold mb-6 text-foreground">
          Số lượng yêu cầu và khảo sát thành công
        </h3>
        <Bar data={barData} options={barOptions} />
      </div>

      <div className="w-1/2 bg-background border border-border rounded-lg p-6 shadow-md" style={{ height: "500px" }}>
        <h3 className="text-lg font-semibold mb-6 text-foreground">
          Số lượng mỗi yêu cầu
        </h3>
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
};

export default DashboardCharts;