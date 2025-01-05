import { Button } from "@/components/ui/button";
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
        <div className="flex items-center justify-between w-full relative">
          {/* Logo */}
          <div className="flex items-center w-24 h-10">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="SitePlus Logo" className="h-auto w-full" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenuDemo />
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center gap-2 border-l-2 border-solid pl-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
            {isAuthenticated ? <UserMenu /> : <AuthLinks />}
          </div>
          {/* Mobile Navigation */}
          <div className="flex lg:hidden">
            <MobileNavigationMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
