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
      label: "Trang chủ",
      href: "/admin-page",
      isActive: true,
    },
    {
      icon: <User size={20} />,
      label: "Quản lý người dùng",
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
    if (trend === "up") return "Up from yesterday";
    if (trend === "down") return "Down from yesterday";
    return "No change";
  };

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers.total.toString().padStart(2, "0"),
      changeValue: formatPercentage(stats.totalUsers.percentageChange),
      changeText: getChangeText(stats.totalUsers.trend),
      trend: stats.totalUsers.trend,
      iconUrl: "https://cdn.lordicon.com/gznfrpfp.json",
    },
    {
      title: "Total Staff",
      value: stats.totalStaff.total.toString().padStart(2, "0"),
      changeValue: formatPercentage(stats.totalStaff.percentageChange),
      changeText: getChangeText(stats.totalStaff.trend),
      trend: stats.totalStaff.trend,
      iconUrl: "https://cdn.lordicon.com/fqbvgezn.json",
    },
    {
      title: "Total Sites",
      value: stats.totalSites.total.toString().padStart(2, "0"),
      changeValue: formatPercentage(stats.totalSites.percentageChange),
      changeText: getChangeText(stats.totalSites.trend),
      trend: stats.totalSites.trend,
      iconUrl: "https://cdn.lordicon.com/jeuxydnh.json",
    },
    {
      title: "Total Reports",
      value: stats.totalReports.total.toString().padStart(2, "0"),
      changeValue: formatPercentage(stats.totalReports.percentageChange),
      changeText: getChangeText(stats.totalReports.trend),
      trend: stats.totalReports.trend,
      iconUrl: "https://cdn.lordicon.com/fikcyfpp.json",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar container */}
      <Sidebar
        logoHref={LogoSitePlus}
        title="Admin Page"
        mainNavItems={adminItems}
        onLogout={handleLogout}
      />

      {/* Main content area */}
      <div className="flex-grow flex flex-col">
        <Header title="Tổng Quan" />
        <div className="flex-grow p-6 space-y-6">
          <StatCardGrid cards={cards} />
          <UsageChart />
        </div>
      </div>
    </div>
  );
}
