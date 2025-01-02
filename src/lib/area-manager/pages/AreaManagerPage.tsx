import Sidebar from "@/lib/all-site/SideBar";
import { Briefcase, ClipboardList, FileText, Home, ClipboardCheck, Send } from "lucide-react";
import * as React from "react";
import LogoSitePlus from "/icons/logo-SitePlus.svg";
import { useAuth } from "../../../services/AuthContext";
import Header from "../../all-site/HeaderOtherRole";

export default function AreaManagerPage() {
  const managerItems = [
    {
      icon: <Home size={20} />,
      label: "TRANG CHỦ",
      href: "/area-manager/home",
      isActive: true,
    },
    {
      icon: <Briefcase size={20} />,
      label: "GIAO VIỆC",
      href: "/area-manager/requests",
    },
    {
      icon: <FileText size={20} />,
      label: "NHẬN KHẢO SÁT",
      href: "/area-manager/assignments",
    },
    {
      icon: <Send size={20} />,
      label: "GỬI QUẢN LÝ",
      href: "/area-manager/surveys",
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
          title="Area Manager"
          mainNavItems={managerItems}
        />
      </div>

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
        <div className="flex-grow p-6">
        </div>
      </div>
    </div>
  );
}
