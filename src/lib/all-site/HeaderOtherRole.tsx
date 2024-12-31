import { Bell, MapPin, Search } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

const Header = ({
  defaultLocation = "Quận 7 - TPHCM",

  onSearch,
  onNotificationClick,
  className = "",
}) => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationCount] = useState(6);

  useEffect(() => {
    // Lấy thông tin từ localStorage
    const storedName = localStorage.getItem("name");
    const storedRole = localStorage.getItem("role");

    if (storedName) setUserName(storedName);
    if (storedRole) setUserRole(storedRole);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

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
      className={`flex w-full  p-2.5 justify-between items-center mx-auto ${className}`}
    >
      {/* Search Input */}
      <div className="relative w-[388px]">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="w-full h-[38px] pl-10 pr-4 bg-theme-secondary-light dark:bg-theme-secondary-dark 
                     text-theme-text-light dark:text-theme-text-dark
                     rounded-[19px] border-[0.6px] border-theme-border-light dark:border-theme-border-dark 
                     focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={handleSearchChange}
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
