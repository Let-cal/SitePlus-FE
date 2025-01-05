import { Button } from "@/components/ui/button";
import * as React from "react";
import { NavLink } from "react-router-dom";

export function AuthLinks() {
  return (
    <div className="flex items-center text-sm ">
      {/* Sign In Link */}
      <NavLink
        to="/sign-in"
        className={({ isActive }) =>
          `relative ${
            isActive
              ? "text-orange-500 underline"
              : "text-gray-500 hover:text-orange-500"
          }`
        }
      >
        <Button variant="ghost">Sign in</Button>
      </NavLink>

      {/* Dấu gạch chéo giữa Sign In và Sign Up */}
      <span className="text-gray-500">/</span>

      {/* Sign Up Link */}
      <NavLink
        to="/sign-up"
        className={({ isActive }) =>
          `relative ${
            isActive
              ? "text-orange-500 underline"
              : "text-gray-500 hover:text-orange-500"
          }`
        }
      >
        <Button variant="ghost">Sign Up</Button>
      </NavLink>
    </div>
  );
}
