import Sidebar from "@/lib/all-site/SideBar";
import { Briefcase, ClipboardList, FileText, Home, ClipboardCheck, Mail } from "lucide-react";
import * as React from "react";
import LogoSitePlus from "/icons/logo-SitePlus.svg";
import { useAuth } from "../../../services/AuthContext";
import Header from "../../all-site/HeaderOtherRole";
import ReceiveSurvey from "../components/survey-manager/ReceiveSurvey";


export default function ManagerSurvey() {
  const managerItems = [
    {
      icon: <Home size={20} />,
      label: "HOME",
      href: "/manager-page",
    },
    {
      icon: <Mail size={20} />,
      label: "REQUEST",
      href: "/manager-request",
    },
    {
      icon: <Briefcase size={20} />,
      label: "ASSIGN TASK",
      href: "/manager-task",
    },
    {
      icon: <FileText size={20} />,
      label: "SURVEY",
      href: "/manager-survey",
      isActive: true,
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
          defaultLocation="Quận 7 - TPHCM"
          title="RECEIVE SURVEY" // Truyền title vào đây
          onNotificationClick={() => { }}
        />

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-12 max-w-full">
            {/* <h2 className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl">RECEIVE SURVEY</h2> */}
            <ReceiveSurvey />
          </div>
        </div>
      </div>
    </div>
  );
}
