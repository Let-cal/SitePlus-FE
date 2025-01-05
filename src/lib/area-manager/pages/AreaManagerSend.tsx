import Sidebar from "@/lib/all-site/SideBar";
import { Briefcase, ClipboardList, FileText, Home, ClipboardCheck, Send } from "lucide-react";
import * as React from "react";
import LogoSitePlus from "/icons/logo-SitePlus.svg";
import { useAuth } from "../../../services/AuthContext";
import Header from "../../all-site/HeaderOtherRole";
import AreaMap from "../components/home-am/Map";
import SendToManager from "../components/send-am/SendToManager";


export default function AreaManagerSend() {
  const areaManagerItems = [
    {
      icon: <Home size={20} />,
      label: "HOME",
      href: "/area-manager-page",
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
      label: "SEND TO MANAGER",
      href: "/area-manager-send",
      isActive: true,
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
          defaultLocation="Quận 9 - TPHCM"
          onSearch={() => {
            // Xử lý tìm kiếm
          }}
          onNotificationClick={() => {
            // Xử lý khi click vào notification
          }}
        />

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-12 max-w-full">
            <h2 className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl">SEND TO MANAGER</h2>
            <AreaMap/>
            <SendToManager/>
          </div>
        </div>
      </div>
    </div>
  );
}
