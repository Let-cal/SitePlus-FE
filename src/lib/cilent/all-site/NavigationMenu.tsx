"use client";

import * as React from "react";
import { Link } from "react-router-dom";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import logo from "/images/logo-site-plus/logo.png";
export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="grid  gap-4 sm:grid-cols-1 md:grid-cols-5 md:gap-4 lg:flex lg:space-x-4 ">
        <NavigationMenuItem>
          <Link to="/home-page">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Trang chủ
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {/* Tư Vấn Chiến Lược với dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <div className="flex items-center">Tư Vấn Chiến Lược</div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              className="grid gap-3 p-4 
                  sm:grid-cols-1 sm:w-full 
                  md:grid-cols-2 md:w-[400px] 
                  lg:grid-cols-[.75fr_1fr] lg:w-[500px]"
            >
              {/* Logo */}
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="flex items-center justify-center w-full h-auto">
                      <img
                        src={logo}
                        alt="Logo"
                        className="h-auto w-full" // Điều chỉnh chiều cao logo theo nhu cầu
                      />
                    </div>

                    <div className="mb-2 mt-4 text-lg font-medium ">
                      SitePlus
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Tư Vấn Chiến Lược Điểm Bán
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>

              {/* Các ListItem */}
              <ListItem
                href="/khao-sat-tim-mat-bang"
                title="Khảo sát tìm mặt bằng"
              >
                Site Plus phân tích, tư vấn và lập chiến lược mở điểm bán tiềm
                năng, phù hợp với định hướng của doanh nghiệp.
              </ListItem>
              <ListItem
                href="/khao-sat-mat-bang-cua-ban"
                title="Khảo sát mặt bằng của bạn"
              >
                Đánh giá chi tiết mặt bằng hiện tại để tìm ra các giải pháp cải
                tiến hiệu quả. Tối ưu hóa không gian để phù hợp hơn với mục tiêu
                kinh doanh của bạn.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Các liên kết khác */}
        <NavigationMenuItem>
          <Link to="/giai-phap">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Giới Thiệu
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/khoa-sat-cua-ban">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Khảo Sát Của Bạn
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to="/contactpage">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Liên Hệ
            </NavigationMenuLink>
          </Link>
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
