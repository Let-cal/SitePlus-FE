import Sidebar from "@/lib/all-site/SideBar";
import { FileText, Handshake, Home, Mail } from "lucide-react";
import * as React from "react";
import { useAuth } from "../../../services/AuthContext";
import Header from "../../all-site/HeaderOtherRole";
import DashboardCharts from "../components/home-manager/DashboardCharts";
import StatsCards from "../components/home-manager/StatsCard";
import UserManagement from "../components/home-manager/UserManagement";
import LogoSitePlus from "/icons/logo-SitePlus.svg";

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
    // {
    //   icon: <Briefcase size={20} />,
    //   label: "CẦN KHẢO SÁT",
    //   href: "/manager-task",
    // },
    {
      icon: <FileText size={20} />,
      label: "KHO MẶT BẰNG",
      href: "/manager-site",
    },
    {
      icon: <Handshake size={20} />,
      label: "ĐỐI TÁC",
      href: "/manager-brand",
    },
  ];

  const { handleLogout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar
          onLogout={handleLogout}
          logoHref={LogoSitePlus}
          title="Manager"
          mainNavItems={managerItems}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="TRANG CHỦ" />

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
