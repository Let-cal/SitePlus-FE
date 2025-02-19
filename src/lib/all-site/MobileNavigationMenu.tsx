import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Link } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import { AuthLinks } from "../auth/components/AuthLink";
import UserMenu from "../User/profile-update/pages/UserMenu";
import logo from "/images/logo-site-plus/logo.png";
export function MobileNavigationMenu() {
  const { isAuthenticated } = useAuth();
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
            <Link to="/" className="flex items-center w-24 h-10">
              <img src={logo} alt="SitePlus Logo" className="h-auto w-full" />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 mt-6">
          {/* Notifications */}
          <div className="flex flex-row items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>

            {/* Auth Links */}
            <div className="flex flex-col gap-2">
              {isAuthenticated ? <UserMenu /> : <AuthLinks />}
            </div>
          </div>
          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
            >
              Trang chủ
            </Link>

            <Accordion type="single" collapsible>
              <AccordionItem value="strategic-consulting">
                <AccordionTrigger className="px-4">
                  Tư Vấn Chiến Lược
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2 pl-6">
                    <Link
                      to="/survey-requests-page"
                      className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      Khảo sát tìm mặt bằng
                    </Link>
                    <Link
                      to="/rating-requests-pagen"
                      className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      Khảo sát mặt bằng của bạn
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Link
              to="/info-page"
              className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
            >
              Giới Thiệu
            </Link>
            <Link
              to="/contact-page"
              className="px-4 py-2 hover:bg-accent rounded-md transition-colors"
            >
              Liên Hệ
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
