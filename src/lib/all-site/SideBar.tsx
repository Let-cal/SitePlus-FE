import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Moon, Sun } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeProvider";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

interface SidebarProps {
  logoHref?: string;
  title?: string;
  mainNavItems: NavItem[];
  className?: string;
  defaultCollapsed?: boolean;
}

const Sidebar = ({
  logoHref = "/",
  title = "",
  mainNavItems,
  className,
  defaultCollapsed = false,
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { isDarkMode, toggleTheme } = useTheme();

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        isCollapsed ? "w-20" : "w-64",
        "transition-all duration-300 ease-in-out",
        "min-h-screen border-r",
        "bg-primary-light dark:bg-primary-dark",
        "border-border-light dark:border-border-dark",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-border-dark">
        <div
          className={cn(
            "flex items-center gap-2",
            isCollapsed && "justify-center",
            "min-w-0"
          )}
        >
          {!isCollapsed ? (
            <>
              <Link to={logoHref} className="flex-shrink-0">
                <img
                  src={logoHref}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                  style={{ imageRendering: "auto" }}
                />
              </Link>
              <h1 className="font-bold text-xl whitespace-nowrap overflow-hidden text-ellipsis text-text-light dark:text-text-dark">
                {title}
              </h1>
            </>
          ) : (
            <h1 className="font-bold text-xl text-text-light dark:text-text-dark">
              {title.charAt(0)}
            </h1>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="hover:bg-secondary-light dark:hover:bg-secondary-dark flex-shrink-0"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-4">
        <div className="px-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-4">
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
                  "hover:bg-secondary-light dark:hover:bg-secondary-dark"
                )}
              >
                {item.icon}
                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.label}
                  </span>
                )}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer with Theme Toggle */}
      <div className="border-t border-border-light dark:border-border-dark p-4">
        <div className="flex justify-center bg-secondary-light dark:bg-secondary-dark rounded-lg p-1">
          <Button
            variant={!isDarkMode ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-2",
              isCollapsed && "w-full justify-center"
            )}
          >
            <Sun size={16} />
            {!isCollapsed && <span>Sáng</span>}
          </Button>
          <Button
            variant={isDarkMode ? "secondary" : "ghost"}
            size="sm"
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-2",
              isCollapsed && "w-full justify-center"
            )}
          >
            <Moon size={16} />
            {!isCollapsed && <span>Tối</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
