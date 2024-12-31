import Header from "@/lib/all-site/HeaderOtherRole";
import Heading from "@/lib/all-site/Heading";
import Sidebar from "@/lib/all-site/SideBar";
import { Briefcase, ClipboardList, FileText, Home } from "lucide-react";
import * as React from "react";
import { useAuth } from "../../../services/AuthContext";
import UsageChart from "../components/ChartTotal";
import StatCardGrid from "../components/StatCardGrid";
import RequestTable from "../components/TableRequests";
import LogoSitePlus from "/icons/logo-SitePlus.svg";

export default function AdminPage() {
  const { handleLogout } = useAuth();
  const adminItems = [
    {
      icon: <Home size={20} />,
      label: "TRANG CHỦ",
      href: "/admin/home",
      isActive: true,
    },
    {
      icon: <FileText size={20} />,
      label: "YÊU CẦU",
      href: "/admin/requests",
    },
    {
      icon: <Briefcase size={20} />,
      label: "GIAO VIỆC",
      href: "/admin/assignments",
    },
    {
      icon: <ClipboardList size={20} />,
      label: "NHẬN KHẢO SÁT",
      href: "/admin/surveys",
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
      title: "Total Employees",
      value: "2040",
      changeValue: "8.5%",
      changeText: "Up from yesterday",
      trend: "up",
      iconUrl: "https://cdn.lordicon.com/fqbvgezn.json",
    },
    {
      title: "Total Feedbacks",
      value: "560",
      changeValue: "8.5%",
      changeText: "Up from yesterday",
      trend: "down",
      iconUrl: "https://cdn.lordicon.com/fozsorqm.json",
    },
    {
      title: "Total Requests",
      value: "10293",
      changeValue: "8.5%",
      changeText: "Up from yesterday",
      trend: "down",
      iconUrl: "https://cdn.lordicon.com/jdgfsfzr.json",
    },
    // Add more card configs...
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
