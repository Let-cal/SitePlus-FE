import { Button } from "@/components/ui/button";
import Header from "@/lib/all-site/HeaderOtherRole";
import Heading from "@/lib/all-site/Heading";
import Sidebar from "@/lib/all-site/SideBar";
import { ClipboardList, Home, User } from "lucide-react";
import * as React from "react";
import { useAuth } from "../../../services/AuthContext";
import UsersChart from "../components/ChartUsers";
import UserTable from "../components/TableUsers";
import LogoSitePlus from "/icons/logo-SitePlus.svg";
export default function AdminUserPage() {
  const { handleLogout } = useAuth();
  const adminItems = [
    {
      icon: <Home size={20} />,
      label: "Home",
      href: "/admin-page",
    },
    {
      icon: <User size={20} />,
      label: "Users",
      href: "/admin-users",
      isActive: true,
    },

    {
      icon: <ClipboardList size={20} />,
      label: "Feedback",
      href: "/admin-feedback",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar container */}

      <Sidebar
        logoHref={LogoSitePlus}
        title="Admin Page"
        mainNavItems={adminItems}
        onLogout={handleLogout}
      />

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

        <div className="flex-grow p-6 space-y-6">
          <div className="flex flex-row justify-between">
            <Heading
              text="User Management"
              color={false}
              size="sm"
              center={false}
            />
            <Button type="submit" className="lg:w-[15%]  items-center  ">
              Create User
            </Button>
          </div>

          <UsersChart />
          <UserTable />
        </div>
      </div>
    </div>
  );
}
