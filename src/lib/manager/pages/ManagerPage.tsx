import Sidebar from "@/lib/all-site/SideBar";
import { Briefcase, ClipboardList, FileText, Home, ClipboardCheck } from "lucide-react";
import * as React from "react";
import LogoSitePlus from "/icons/logo-SitePlus.svg";
import { useAuth } from "../../../services/AuthContext";
import Header from "../../all-site/HeaderOtherRole";
import ManagerHome from '../components/home-manager/ManagerHome';
import ManagerRequest from '../components/request-manager/ManagerRequest';

export default function ManagerPage() {
  const managerItems = [
    {
      icon: <Home size={20} />,
      label: "TRANG CHỦ",
      href: "../components/home-manager/ManagerHome",
      isActive: true,
    },
    {
      icon: <FileText size={20} />,
      label: "YÊU CẦU",
      href: "../components/request-manager/ManagerRequest",
    },
    {
      icon: <Briefcase size={20} />,
      label: "GIAO VIỆC",
      href: "/manager/assignments",
    },
    {
      icon: <FileText size={20} />,
      label: "NHẬN KHẢO SÁT",
      href: "/manager/surveys",
    },
  ];

  const { handleLogout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar container */}
      <div className="flex-shrink-0">
        <Sidebar
          onLogout={handleLogout}
          logoHref={LogoSitePlus}
          title="Manager"
          mainNavItems={managerItems}
        />
      </div>

      {/* Main content area */}
      <div className="flex-grow flex flex-col">
        <div className="fixed top-0 left-64 right-0 z-50">
          <Header
            defaultLocation="Quận 7 - TPHCM"
            onSearch={() => {
              // Xử lý tìm kiếm
            }}
            onNotificationClick={() => {
              // Xử lý khi click vào notification
            }}
          />
        </div>

        {/* Content area */}
        <div className="flex-grow p-6 mt-12">
          <ManagerHome />
          {/* <ManagerRequest /> */}
        </div>
      </div>
    </div>
  );
}
