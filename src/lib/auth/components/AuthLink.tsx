import { Button } from "@/components/ui/button";
import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export function AuthLinks() {
  const navigate = useNavigate();

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn hành vi mặc định của NavLink
    // Navigate to login page with replace:true to prevent going back
    navigate("/sign-in", { replace: true });
  };

  return (
    <div className="flex items-center text-sm">
      {/* Sign In Link */}
      <NavLink
        to="/sign-in"
        onClick={handleLoginClick}
        className={({ isActive }) =>
          `relative ${
            isActive
              ? "text-orange-500 underline"
              : "text-gray-500 hover:text-orange-500"
          }`
        }
      >
        <Button variant="ghost">Đăng nhập</Button>
      </NavLink>
    </div>
  );
}