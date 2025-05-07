"use client";

import * as React from "react";
import { NavLink } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import HomePageNav from "./HomePageNav";

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="grid gap-4 sm:grid-cols-1 md:grid-cols-5 md:gap-4 lg:flex lg:space-x-4">
        <NavigationMenuItem>
          <NavLink to="/">
            {({ isActive }) => (
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  isActive ? "text-orange-500 " : "text-gray-600 hover:text-orange-500"
                }`}
              >
                <HomePageNav />
              </NavigationMenuLink>
            )}
          </NavLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavLink to="/survey-requests-page">
            {({ isActive }) => (
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  isActive ? "text-orange-500 " : "text-gray-600 hover:text-orange-500"
                }`}
              >
                Khảo sát tìm mặt bằng
              </NavigationMenuLink>
            )}
          </NavLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavLink to="/info-page">
            {({ isActive }) => (
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  isActive ? "text-orange-500 " : "text-gray-600 hover:text-orange-500"
                }`}
              >
                Giới Thiệu
              </NavigationMenuLink>
            )}
          </NavLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavLink to="/contact-page">
            {({ isActive }) => (
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  isActive ? "text-orange-500 " : "text-gray-600 hover:text-orange-500"
                }`}
              >
                Liên Hệ
              </NavigationMenuLink>
            )}
          </NavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// Component ListItem dùng lại cho từng mục trong dropdown
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";