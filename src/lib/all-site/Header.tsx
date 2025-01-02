import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell } from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import { AuthLinks } from "../auth/components/AuthLink";
import { MobileNavigationMenu } from "./MobileNavigationMenu";
import { NavigationMenuDemo } from "./NavigationMenu";
import UserMenu from "./UserMenu";
import logo from "/images/logo-site-plus/logo.png";

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        isScrolled
          ? "shadow-md transform -translate-y-0"
          : "transform -translate-y-0"
      }`}
    >
      <div className="container mx-auto px-4 py-3 ">
        <div className="flex items-center w-full">
          <div className="flex items-center gap-4 justify-between w-full">
            <Link to="/" className="flex items-center w-24 h-10">
              <img src={logo} alt="SitePlus Logo" className="h-auto w-full" />
            </Link>
            <MobileNavigationMenu />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenuDemo />
          </div>

          {/* Desktop Language and Auth */}
          <div className="hidden lg:flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-[140px]">
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
            {isAuthenticated ? <UserMenu /> : <AuthLinks />}
          </div>
        </div>
      </div>
    </header>
  );
}
