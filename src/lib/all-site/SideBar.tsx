import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, LogOut, Moon, Sun } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeProvider";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  logoHref?: string;
  title?: string;
  mainNavItems: NavItem[];
  className?: string;
  defaultCollapsed?: boolean;
  onLogout?: () => void;
}

const Sidebar = ({
  logoHref = "/",
  title = "",
  mainNavItems,
  className,
  defaultCollapsed = false,
  onLogout,
}: SidebarProps) => {
  // Đọc trạng thái thu gọn từ localStorage hoặc defaultCollapsed
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : defaultCollapsed;
  });

  const { isDarkMode, toggleTheme } = useTheme();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Hàm toggleCollapse để thay đổi trạng thái và lưu vào localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        isCollapsed ? "w-20" : "w-64",
        "transition-[width,transform] duration-300 ease-in-out",
        "border-r",
        "bg-primary-light dark:bg-primary-dark",
        "border-border-light dark:border-border-dark",
        "sticky top-0 h-screen overflow-y-auto overflow-x-hidden",
        className
      )}
      style={{
        transform: `translateY(${Math.min(scrollPosition, 20)}px)`,
        transition: "transform 0.3s ease-out, width 0.3s ease-in-out",
      }}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark",
          "sticky top-0 bg-primary-light dark:bg-primary-dark z-10",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            isCollapsed && "justify-center",
            "min-w-0",
            "transition-all duration-300 ease-in-out"
          )}
        >
          {!isCollapsed ? (
            <>
              <Link to={logoHref} className="flex-shrink-0">
                <img
                  src={logoHref}
                  alt="Logo"
                  className="w-8 h-8 object-contain transition-transform duration-300 ease-in-out"
                  style={{ imageRendering: "auto" }}
                />
              </Link>
              <h1 className="font-bold text-xl whitespace-nowrap overflow-hidden text-ellipsis text-text-light dark:text-text-dark transition-all duration-300 ease-in-out">
                {title}
              </h1>
            </>
          ) : (
            <h1 className="font-bold text-xl text-text-light dark:text-text-dark transition-all duration-300 ease-in-out">
              {title.charAt(0)}
            </h1>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="hover:bg-secondary-light dark:hover:bg-secondary-dark flex-shrink-0 transition-transform duration-300 ease-in-out"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4 transition-all duration-300 ease-in-out">
        <div className="px-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-4 transition-opacity duration-300 ease-in-out">
            {!isCollapsed && "Main"}
          </p>
        </div>
        <nav className="space-y-1 px-2">
          {mainNavItems.map((item, index) => (
            <Link key={index} to={item.href} className="block">
              <Button
                variant={item.isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isCollapsed && "justify-center",
                  "text-text-light dark:text-text-dark",
                  "hover:bg-secondary-light dark:hover:bg-secondary-dark",
                  "transition-all duration-300 ease-in-out"
                )}
              >
                {item.icon}
                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 ease-in-out">
                    {item.label}
                  </span>
                )}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Section */}
      <div className="px-2 mb-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3",
            isCollapsed && "justify-center",
            "text-text-light dark:text-text-dark",
            "hover:bg-secondary-light dark:hover:bg-secondary-dark",
            "transition-all duration-300 ease-in-out"
          )}
          onClick={onLogout}
        >
          <LogOut size={20} />
          {!isCollapsed && (
            <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 ease-in-out">
              Logout
            </span>
          )}
        </Button>
      </div>

      {/* Footer with Theme Toggle */}
      <div
        className={cn(
          "border-t border-border-light dark:border-border-dark p-4",
          "sticky bottom-0 bg-primary-light dark:bg-primary-dark",
          "transition-all duration-300 ease-in-out"
        )}
      >
        <div className="flex justify-center bg-secondary-light dark:bg-secondary-dark rounded-lg p-1">
          <Button
            variant={!isDarkMode ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-2",
              isCollapsed && "w-full justify-center",
              "transition-all duration-300 ease-in-out"
            )}
          >
            <Sun size={16} />
            {!isCollapsed && (
              <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 ease-in-out">
                Light
              </span>
            )}
          </Button>
          <Button
            variant={isDarkMode ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-2",
              isCollapsed && "w-full justify-center",
              "transition-all duration-300 ease-in-out"
            )}
          >
            <Moon size={16} />
            {!isCollapsed && (
              <span className="whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300 ease-in-out">
                Dark
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;