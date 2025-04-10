import Sidebar from "@/lib/all-site/SideBar";
import { Briefcase, Home, CheckCircle } from "lucide-react";
import * as React from "react";
import { useAuth } from "../../../services/AuthContext";
import Header from "../../all-site/HeaderOtherRole";
import LogoSitePlus from "/icons/logo-SitePlus.svg";
import SiteCheck from "../components/sitecheck-am/SiteCheck";

export default function AreaManagerSiteCheck() {
    const areaManagerItems = [
        {
            icon: <Home size={20} />,
            label: "TRANG CHỦ",
            href: "/area-manager-page",
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
                    title="KIỂM TRA MẶT BẰNG" 
                />

                {/* Content area */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-12 max-w-full">
                        <SiteCheck />
                    </div>
                </div>
            </div>
        </div>
    );
}
