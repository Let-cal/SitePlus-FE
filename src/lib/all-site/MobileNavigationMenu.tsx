import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Bell, Menu } from "lucide-react";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { AuthLinks } from "../auth/components/AuthLink";
import { Divider } from "./divider";
import logo from "/images/logo-site-plus/logo.png";

export function MobileNavigationMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle>
            <NavLink to="/" className="flex items-center w-24 h-10">
              <img src={logo} alt="SitePlus Logo" className="h-auto w-full" />
            </NavLink>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-6">
          {/* Notifications */}
          <div className="flex flex-row items-center gap-2">
            {/* <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button> */}

            {/* Auth Links */}
            <div className="flex flex-col gap-2">
              <AuthLinks />
            </div>
          </div>
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "text-orange-500 "
                    : "text-gray-600 hover:text-orange-500"
                }`
              }
            >
              Trang chủ
            </NavLink>

            <NavLink
              to="/survey-requests-page"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "text-orange-500 "
                    : "text-gray-600 hover:text-orange-500"
                }`
              }
            >
              Khảo sát tìm mặt bằng
            </NavLink>
            <Divider />
            <NavLink
              to="/info-page"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "text-orange-500 "
                    : "text-gray-600 hover:text-orange-500"
                }`
              }
            >
              Giới Thiệu
            </NavLink>
            <NavLink
              to="/contact-page"
              className={({ isActive }) =>
                `px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "text-orange-500 "
                    : "text-gray-600 hover:text-orange-500"
                }`
              }
            >
              Liên Hệ
            </NavLink>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}