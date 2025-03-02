import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

// Định nghĩa các type cho props
type ButtonWidth = "full" | "half" | "auto" | "40";
type ButtonColor = "orange" | "blue" | "green" | "red" | "purple";
type ButtonTextColor = "white" | "black";
type ButtonType = "button" | "submit" | "reset";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: ButtonWidth;
  color?: ButtonColor;
  textColor?: ButtonTextColor;
  type?: ButtonType;
  className?: string;
  children: React.ReactNode;
  // Các prop cho icon
  icon?: React.ReactNode; // Cho phép truyền bất kỳ ReactNode nào làm icon
  iconPosition?: "left" | "right";
}

// Tạo component Button tùy chỉnh dựa trên Button của shadcn-ui
const CustomButton = ({
  type = "button",
  width = "auto",
  color = "orange",
  textColor = "white",
  children,
  className = "",
  icon = null, // Mặc định không có icon
  iconPosition = "right",
  ...props
}: CustomButtonProps) => {
  // Xác định các class màu sắc
  const getColorClasses = () => {
    switch (color) {
      case "orange":
        return "bg-orange-500 hover:bg-orange-600";
      case "blue":
        return "bg-blue-500 hover:bg-blue-600";
      case "green":
        return "bg-green-500 hover:bg-green-600";
      case "red":
        return "bg-red-500 hover:bg-red-600";
      case "purple":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-orange-500 hover:bg-orange-600";
    }
  };

  // Xác định lớp cho chiều rộng
  const getWidthClass = () => {
    switch (width) {
      case "full":
        return "w-full";
      case "half":
        return "w-1/2";
      case "auto":
        return "w-auto";
      case "40":
        return "w-2/5";
      default:
        return "w-auto";
    }
  };

  // Xác định lớp cho màu chữ
  const getTextColorClass = () => {
    switch (textColor) {
      case "white":
        return "text-white";
      case "black":
        return "text-black";
      default:
        return "text-white";
    }
  };

  return (
    <Button
      type={type}
      className={cn(
        getWidthClass(),
        getColorClasses(),
        getTextColorClass(),
        "items-center inline-flex gap-2",
        className
      )}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </Button>
  );
};

export default CustomButton;
