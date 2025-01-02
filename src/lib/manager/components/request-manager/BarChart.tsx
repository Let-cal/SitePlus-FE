import { useEffect, useState } from "react";
import * as React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BarChart: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');

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
    purple: '#A855F7',
    green: '#22C55E',
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
    <div className="w-full bg-background border border-border rounded-lg p-6 shadow-md" style={{ height: "500px" }}>
      <h3 className="text-lg font-semibold mb-6 text-foreground">
        Số lượng mỗi yêu cầu
      </h3>
      <Doughnut data={doughnutData} options={doughnutOptions} />
    </div>
  );
};

export default BarChart;