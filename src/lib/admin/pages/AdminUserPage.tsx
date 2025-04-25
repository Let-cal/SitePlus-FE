import { Button } from "@/components/ui/button";
import Header from "@/lib/all-site/HeaderOtherRole";
import Sidebar from "@/lib/all-site/SideBar";
import { Home, User } from "lucide-react";
import * as React from "react";
import { UserProvider } from "../../../services/admin/UserContext";
import { useAuth } from "../../../services/AuthContext";
import UsersChart from "../components/user-management/ChartUsers";
import CreateUserDialog from "../components/user-management/CreateUserForm";
import UserTable from "../components/user-management/TableUsers";
import LogoSitePlus from "/icons/logo-SitePlus.svg";

export default function AdminUserPage() {
  const { handleLogout } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const adminItems = [
    {
      icon: <Home size={20} />,
      label: "TRANG CHỦ",
      href: "/admin-page",
    },
    {
      icon: <User size={20} />,
      label: "QUẢN LÝ NGƯỜI DÙNG",
      href: "/admin-users",
      isActive: true,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar container */}
      <div className="flex-none">
        <Sidebar
          logoHref={LogoSitePlus}
          title="Admin"
          mainNavItems={adminItems}
          onLogout={handleLogout}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="QUẢN LÝ NGƯỜI DÙNG" />
        <UserProvider>
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-12 max-w-full">
              <div className="flex flex-row justify-between">
                <Button
                  className="lg:w-[15%] items-center"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Tạo Người Dùng
                </Button>
              </div>

              <CreateUserDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
              />

              <UsersChart />
              <UserTable />
            </div>
          </div>
        </UserProvider>
      </div>
    </div>
  );
}
