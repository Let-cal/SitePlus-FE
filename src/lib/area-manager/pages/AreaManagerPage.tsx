import Sidebar from "@/lib/all-site/SideBar";
import { Briefcase, FileText, Home, Send } from "lucide-react";
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
      label: "HOME",
      href: "/area-manager-page",
      isActive: true,
    },
    {
      icon: <Briefcase size={20} />,
      label: "ASSIGN TASK",
      href: "/area-manager-task",
    },
    {
      icon: <FileText size={20} />,
      label: "SURVEY",
      href: "/area-manager-survey",
    },
    {
      icon: <Send size={20} />,
      label: "SEND REPORTS",
      href: "/area-manager-send",
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
          defaultLocation="Quận 7 - TPHCM"
          title="HomePage" // Truyền title vào đây
          onNotificationClick={() => {}}
        />

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-12 max-w-full">
            <Cards />
            <AreaMap />
            <StaffManagement />
          </div>
        </div>
      </div>
    </div>
  );
}
