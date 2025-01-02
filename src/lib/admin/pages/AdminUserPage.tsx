import { Button } from "@/components/ui/button";
import Header from "@/lib/all-site/HeaderOtherRole";
import Heading from "@/lib/all-site/Heading";
import Sidebar from "@/lib/all-site/SideBar";
import { Home, User } from "lucide-react";
import * as React from "react";
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
      label: "Home",
      href: "/admin-page",
    },
    {
      icon: <User size={20} />,
      label: "Users",
      href: "/admin-users",
      isActive: true,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        logoHref={LogoSitePlus}
        title="Admin Page"
        mainNavItems={adminItems}
        onLogout={handleLogout}
      />

      <div className="flex-grow flex flex-col">
        <Header
          defaultLocation="Quận 7 - TPHCM"
          onSearch={() => {}}
          onNotificationClick={() => {}}
        />

        <div className="flex-grow p-6 space-y-6">
          <div className="flex flex-row justify-between">
            <Heading
              text="User Management"
              color={false}
              size="sm"
              center={false}
            />
            <Button
              className="lg:w-[15%] items-center"
              onClick={() => setIsDialogOpen(true)}
            >
              Create User
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
    </div>
  );
}
