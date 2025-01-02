import Header from "@/lib/all-site/HeaderOtherRole";
import Heading from "@/lib/all-site/Heading";
import Sidebar from "@/lib/all-site/SideBar";
import { Home, User } from "lucide-react";
import * as React from "react";
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
      label: "Home",
      href: "/admin-page",
      isActive: true,
    },
    {
      icon: <User size={20} />,
      label: "Users",
      href: "/admin-users",
    },
  ];
  const cards = [
    {
      title: "Total Users",
      value: "40,689",
      changeValue: "8.5%",
      changeText: "Up from yesterday",
      trend: "up",
      iconUrl: "https://cdn.lordicon.com/gznfrpfp.json",
    },
    {
      title: "Total Customers",
      value: "2040",
      changeValue: "8.5%",
      changeText: "Up from yesterday",
      trend: "up",
      iconUrl: "https://cdn.lordicon.com/fqbvgezn.json",
    },
    {
      title: "Total Rating-Requests",
      value: "560",
      changeValue: "8.5%",
      changeText: "Down from yesterday",
      trend: "down",
      iconUrl: "https://cdn.lordicon.com/fozsorqm.json",
    },
    {
      title: "Total Survey-Requests",
      value: "10293",
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
          onSearch={() => {
            // Xử lý tìm kiếm
          }}
          onNotificationClick={() => {
            // Xử lý khi click vào notification
          }}
        />
        <div className="flex-grow p-6 space-y-6">
          <Heading text="Dashboard" color={false} size="sm" center={false} />

          <StatCardGrid cards={cards} />
          <UsageChart />
          <RequestTable />
        </div>
      </div>
    </div>
  );
}
