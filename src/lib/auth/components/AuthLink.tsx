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
    </div>
  );
}
