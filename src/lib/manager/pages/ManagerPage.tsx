import Sidebar from "@/lib/all-site/SideBar";
import { AuthProvider } from "@/services/AuthContext";
import { ThemeProvider } from "@/lib/all-site/ThemeProvider";
import { Briefcase, ClipboardList, FileText, Home, ClipboardCheck, Mail } from "lucide-react";
import * as React from "react";
import LogoSitePlus from "/icons/logo-SitePlus.svg";
import { useAuth } from "../../../services/AuthContext";
import Header from "../../all-site/HeaderOtherRole";
import StatsCards from "../components/home-manager/StatsCard";
import DashboardCharts from "../components/home-manager/DashboardCharts";
import UserManagement from "../components/home-manager/UserManagement";


export default function ManagerPage() {
  const managerItems = [
    {
      icon: <Home size={20} />,
      label: "TRANG CHỦ",
      href: "/manager-page",
      isActive: true,
    },
    {
      icon: <Mail size={20} />,
      label: "YÊU CẦU",
      href: "/manager-request",
    },
    {
      icon: <Briefcase size={20} />,
      label: "ASSIGN TASK",
      href: "/manager-task",
    },
    {
      icon: <FileText size={20} />,
      label: "KHO MẶT BẰNG",
      href: "/manager-survey",
    },
  ];

  const { handleLogout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar
          onLogout={() => { }} // Moved inside to access useAuth
          logoHref={LogoSitePlus}
          title="Manager"
          mainNavItems={managerItems}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          defaultLocation="Quận 7 - TPHCM"
          title="TRANG CHỦ"
          onNotificationClick={() => { }}
        />

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-12 max-w-full">
            <StatsCards />
            <DashboardCharts />
            <UserManagement />
          </div>
        </div>
      </div>
    </div>
  );
}
