import Sidebar from "@/lib/all-site/SideBar";
import { Briefcase, Home, CheckCircle } from "lucide-react";
import * as React from "react";
import { useAuth } from "../../../services/AuthContext";
import Header from "../../all-site/HeaderOtherRole";
import Cards from "../components/home-am/Cards";
import AreaMap from "../components/home-am/Map";
import StaffManagement from "../components/home-am/StaffManagement";
import LogoSitePlus from "/icons/logo-SitePlus.svg";

export default function AreaManagerPage() {
  const areaManagerItems = [
    {
      icon: <Home size={20} />,
      label: "TRANG CHỦ",
      href: "/area-manager-page",
      isActive: true,
    },
    {
      icon: <Briefcase size={20} />,
      label: "GIAO VIỆC",
      href: "/area-manager-task",
    },
    {
      icon: <CheckCircle size={20} />,
      label: "KIỂM TRA MẶT BẰNG",
      href: "/area-manager-sitecheck",
    },
  ];

  const { handleLogout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar
          onLogout={handleLogout}
          logoHref={LogoSitePlus}
          title="Area Manager"
          mainNavItems={areaManagerItems}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title="TRANG CHỦ" 
        />

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-12 max-w-full">
            <Cards />
            <StaffManagement />
          </div>
        </div>
      </div>
    </div>
  );
}
