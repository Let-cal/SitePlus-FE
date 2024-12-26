import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Divider } from "@/lib/cilent/all-site/divider";
import { Bell } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { AuthLinks } from "../auth/components/AuthLink";
import { NavigationMenuDemo } from "./NavigationMenu";
import logo from "/images/logo-site-plus/logo.png";
export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between lg:flex-row md:flex-col sm:flex-col xs:flex-col xs:gap-3 sm:gap-5">
          <Link to="/" className="flex items-center w-24 h-10">
            <img src={logo} alt="SitePlus Logo" className="h-auto w-full" />
          </Link>
          <div className="lg:hidden md:hidden">
            <Divider />
          </div>

          <NavigationMenuDemo />
          {/* Divider */}

          <div className="lg:hidden md:hidden">
            <Divider />
          </div>

          <div className="lg:w-auto flex items-center space-x-4 sm:justify-between sm:w-full xs:space-x-2 xs:w-full  xs:justify-center">
            <div className="lg:hidden sm:flex sm:flex-row  xs:flex xs:flex-row xs:items-center ">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
            </div>

            <div className="sm:hidden lg:flex gap-3 xs:hidden">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
            </div>

            <AuthLinks />
          </div>
        </div>
      </div>
    </header>
  );
}
