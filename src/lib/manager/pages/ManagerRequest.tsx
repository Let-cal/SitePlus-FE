import Sidebar from "@/lib/all-site/SideBar";
import { Briefcase, ClipboardList, FileText, Home, ClipboardCheck, Mail } from "lucide-react";
import * as React from "react";
import LogoSitePlus from "/icons/logo-SitePlus.svg";
import { useAuth } from "../../../services/AuthContext";
import Header from "../../all-site/HeaderOtherRole";
import BarChart from "../components/request-manager/BarChart";
import RequestTable from "../components/request-manager/RequestTable";


export default function ManagerRequest() {
  const managerItems = [
    {
      icon: <Home size={20} />,
      label: "TRANG CHỦ",
      href: "/manager-page",
    },
    {
      icon: <Mail size={20} />,
      label: "YÊU CẦU",
      href: "/manager-request",
      isActive: true,
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
  ];

  const { handleLogout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar container */}
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
        <Header
          title="YÊU CẦU" 
        />

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-12 max-w-full">
            <BarChart />
            <RequestTable />
          </div>
        </div>
      </div>
    </div>
  );
}