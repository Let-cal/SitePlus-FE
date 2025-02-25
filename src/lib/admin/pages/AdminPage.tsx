import Header from "@/lib/all-site/HeaderOtherRole";
import Sidebar from "@/lib/all-site/SideBar";
import { adminService } from "@/services/admin/admin.service";
import { Home, User } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../services/AuthContext";
import UsageChart from "../components/home-page/ChartTotal";
import StatCardGrid from "../components/home-page/StatCardGrid";
import RequestTable from "../components/home-page/TableRequests";
import LogoSitePlus from "/icons/logo-SitePlus.svg";
export default function AdminPage() {
  const { handleLogout } = useAuth();
  const adminItems = [
    {
      icon: <Home size={20} />,
      label: "HOME",
      href: "/admin-page",
      isActive: true,
    },
    {
      icon: <User size={20} />,
      label: "USERS",
      href: "/admin-users",
    },
  ];
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalRatings: 0,
    totalSurveys: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const [users, customers, ratings, surveys] = await Promise.all([
        adminService.getTotalUsers(),
        adminService.getTotalCustomers(),
        adminService.getTotalRatings(),
        adminService.getTotalSurveys(),
      ]);

      setStats({
        totalUsers: users,
        totalCustomers: customers,
        totalRatings: ratings,
        totalSurveys: surveys,
      });
    }

    fetchData();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      changeValue: "8.5%",
      changeText: "Up from yesterday",
      trend: "up",
      iconUrl: "https://cdn.lordicon.com/gznfrpfp.json",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      changeValue: "8.5%",
      changeText: "Up from yesterday",
      trend: "up",
      iconUrl: "https://cdn.lordicon.com/fqbvgezn.json",
    },
    {
      title: "Total Rating-Requests",
      value: stats.totalRatings,
      changeValue: "8.5%",
      changeText: "Down from yesterday",
      trend: "down",
      iconUrl: "https://cdn.lordicon.com/fozsorqm.json",
    },
    {
      title: "Total Survey-Requests",
      value: stats.totalSurveys,
      changeValue: "8.5%",
      changeText: "Down from yesterday",
      trend: "down",
      iconUrl: "https://cdn.lordicon.com/jdgfsfzr.json",
    },
    // Add more card configs...
  ];
  console.log(localStorage.getItem("tokens"));
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
        <Header
          defaultLocation="Quận 7 - TPHCM"
          title="Dashboard" // Truyền title vào đây
          onNotificationClick={() => {}}
        />
        <div className="flex-grow p-6 space-y-6">
          <StatCardGrid cards={cards} />
          <UsageChart />
          <RequestTable />
        </div>
      </div>
    </div>
  );
}
