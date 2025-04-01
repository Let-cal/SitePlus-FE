import { defineElement } from "@lordicon/element";
import lottie from "lottie-web";
import { MapPin } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import DynamicLordIcon from "./DynamicLordIcon";
import Heading from "./Heading";

const Header = ({
  title, // Bỏ defaultLocation khỏi props
  className = "",
}) => {
  const [userRole, setUserRole] = useState("");
  const [location, setLocation] = useState(""); // Khởi tạo rỗng, sẽ cập nhật từ localStorage

  useEffect(() => {
    defineElement(lottie.loadAnimation);
  }, []);

  useEffect(() => {
    // Lấy thông tin từ localStorage
    const storedRole = localStorage.getItem("role");
    const storedDistrict = localStorage.getItem("area");

    if (storedRole) setUserRole(storedRole);
    if (storedDistrict) setLocation(storedDistrict); 
  }, []);

  // Render phần location dựa theo role
  const renderLocation = () => {
    if (userRole === "Admin") {
      return null;
    }

    if (userRole === "Area-Manager" && location) { // Chỉ hiển thị nếu có location
      return (
        <div className="flex items-center gap-2 pr-5 border-r border-theme-border-light dark:border-theme-border-dark">
          <MapPin className="w-6 h-6 text-theme-text-light dark:text-theme-text-dark" />
          <span className="text-sm font-bold text-theme-text-light dark:text-theme-text-dark">
            {location}
          </span>
        </div>
      );
    }

    if (userRole === "Manager") {
      return null;
    }

    return null;
  };

  return (
    <div
      className={`flex w-full p-2.5 justify-between items-center mx-auto pb-[18px] border-b border-border-light dark:border-border-dark${className}`}
    >
      {/* Heading */}
      <div className="w-[388px]">
        <Heading
          text={title}
          color={false}
          size="sm"
          center={false}
          hasMargin={false}
        />
      </div>

      {/* Location and User Info */}
      <div className="flex items-center gap-5">
        {renderLocation()}

        {/* User Info */}
        <div className="flex items-center gap-3">
          <DynamicLordIcon />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground">
              {userRole || "Area Manager"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;