import { Bell, MapPin } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import Heading from "./Heading";

const Header = ({
  defaultLocation = "Quận 9 - TPHCM",
  title,
  onNotificationClick,
  className = "",
}) => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  const [notificationCount] = useState(6);

  useEffect(() => {
    // Lấy thông tin từ localStorage
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");

    if (storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);
  }, []);

  // Render phần location dựa theo role
  const renderLocation = () => {
    if (userRole === "Admin") {
      return null;
    }

    if (userRole === "Area-Manager") {
      return (
        <div className="flex items-center gap-2 pr-5 border-r border-theme-border-light dark:border-theme-border-dark">
          <MapPin className="w-6 h-6 text-theme-text-light dark:text-theme-text-dark" />
          <span className="text-sm font-bold text-theme-text-light dark:text-theme-text-dark">
            {defaultLocation}
          </span>
        </div>
      );
    }

    if (userRole === "Manager") {
      return null;
    }

    return null;
  };

  return (
    <div
      className={`flex w-full p-2.5 justify-between items-center mx-auto pb-[18px] border-b border-border-light dark:border-border-dark${className}`}
    >
      {/* Heading */}
      <div className="w-[388px]">
        <Heading
          text={title}
          color={false}
          size="sm"
          center={false}
          hasMargin={false} // Thêm prop này để không có margin bottom
        />
      </div>

      {/* Location and User Info */}
      <div className="flex items-center gap-5">
        {renderLocation()}

        {/* User Info and Notification */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <div className="relative">
            <Bell
              className="w-6 h-6 cursor-pointer text-theme-text-light dark:text-theme-text-dark"
              onClick={onNotificationClick}
            />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-theme-secondary-light dark:bg-theme-secondary-dark rounded-full" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-theme-text-light dark:text-theme-text-dark">
                {userName || "Moni Roy"}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {userRole || "Area Manager"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
