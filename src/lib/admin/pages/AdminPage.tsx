import Header from "@/lib/all-site/HeaderOtherRole";
import Sidebar from "@/lib/all-site/SideBar";
import { adminService } from "@/services/admin/admin.service";
import { Home, User } from "lucide-react";
import * as React from "react";
import { useAuth } from "../../../services/AuthContext";
import UsageChart from "../components/home-page/ChartTotal";
import StatCardGrid from "../components/home-page/StatCardGrid";
import LogoSitePlus from "/icons/logo-SitePlus.svg";

export default function AdminPage() {
  const { handleLogout } = useAuth();
  const adminItems = [
    {
      icon: <Home size={20} />,
      label: "TRANG CHỦ",
      href: "/admin-page",
      isActive: true,
    },
    {
      icon: <User size={20} />,
      label: "QUẢN LÝ NGƯỜI DÙNG",
      href: "/admin-users",
    },
  ];

  const [stats, setStats] = React.useState({
    totalUsers: { total: 0, percentageChange: 0, trend: "Neutral" },
    totalStaff: { total: 0, percentageChange: 0, trend: "Neutral" },
    totalSites: { total: 0, percentageChange: 0, trend: "Neutral" },
    totalReports: { total: 0, percentageChange: 0, trend: "Neutral" },
  });

  React.useEffect(() => {
    async function fetchData() {
      const [usersData, staffData, sitesData, reportsData] = await Promise.all([
        adminService.getTotalUsers(),
        adminService.getTotalStaff(),
        adminService.getTotalSites(),
        adminService.getTotalReports(),
      ]);

      setStats({
        totalUsers: {
          total: usersData.total,
          percentageChange: usersData.percentageChange,
          trend: usersData.trend.toLowerCase(),
        },
        totalStaff: {
          total: staffData.total,
          percentageChange: staffData.percentageChange,
          trend: staffData.trend.toLowerCase(),
        },
        totalSites: {
          total: sitesData.total,
          percentageChange: sitesData.percentageChange,
          trend: sitesData.trend.toLowerCase(),
        },
        totalReports: {
          total: reportsData.total,
          percentageChange: reportsData.percentageChange,
          trend: reportsData.trend.toLowerCase(),
        },
      });
    }

    fetchData();
  }, []);

  // Format percentage change (round to 1 decimal place)
  const formatPercentage = (value: number) => {
    return (value / 100).toFixed(1) + "%";
  };

  // Get change text based on trend
  const getChangeText = (trend: string) => {
    if (trend === "up") return "Tăng so với hôm qua";
    if (trend === "down") return "Giảm hơn so với hôm qua";
    return "Không thay đổi";
  };

  const cards = [
    {
      title: "Tổng số người dùng",
      value: stats.totalUsers.total.toString().padStart(2, "0"),
      changeValue: formatPercentage(stats.totalUsers.percentageChange),
      changeText: getChangeText(stats.totalUsers.trend),
      trend: stats.totalUsers.trend,
      iconUrl: "https://cdn.lordicon.com/gznfrpfp.json",
    },
    {
      title: "Tổng số nhân viên",
      value: stats.totalStaff.total.toString().padStart(2, "0"),
      changeValue: formatPercentage(stats.totalStaff.percentageChange),
      changeText: getChangeText(stats.totalStaff.trend),
      trend: stats.totalStaff.trend,
      iconUrl: "https://cdn.lordicon.com/fqbvgezn.json",
    },
    {
      title: "Tổng số mặt bằng",
      value: stats.totalSites.total.toString().padStart(2, "0"),
      changeValue: formatPercentage(stats.totalSites.percentageChange),
      changeText: getChangeText(stats.totalSites.trend),
      trend: stats.totalSites.trend,
      iconUrl: "https://cdn.lordicon.com/jeuxydnh.json",
    },
    {
      title: "Tổng số báo cáo",
      value: stats.totalReports.total.toString().padStart(2, "0"),
      changeValue: formatPercentage(stats.totalReports.percentageChange),
      changeText: getChangeText(stats.totalReports.trend),
      trend: stats.totalReports.trend,
      iconUrl: "https://cdn.lordicon.com/fikcyfpp.json",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar container */}
      <div className="flex-none">
        <Sidebar
          logoHref={LogoSitePlus}
          title="Admin"
          mainNavItems={adminItems}
          onLogout={handleLogout}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="TRANG CHỦ" />
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-12 max-w-full">
            <StatCardGrid cards={cards} />
            <UsageChart />
          </div>
        </div>
      </div>
    </div>
  );
}
