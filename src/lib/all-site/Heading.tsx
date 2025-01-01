import * as React from "react";

interface HeadingProps {
  text: string; // Nội dung sẽ hiển thị trong heading
  hasMargin?: boolean; // Điều chỉnh việc thêm class mb-12
  size?: "sm" | "md" | "lg"; // Kích cỡ chữ: sm, md, lg
  color?: boolean; //
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  text,
  hasMargin = true,
  size = "md",
  color = true,
  center = true,
}) => {
  // Xác định class kích cỡ chữ dựa vào size
  const sizeClass =
    size === "sm"
      ? "text-xl md:text-2xl lg:text-3xl"
      : size === "lg"
      ? "text-4xl md:text-5xl lg:text-6xl"
      : "text-3xl md:text-4xl lg:text-5xl"; // Mặc định là "md"

  return (
    <h2
      className={`${
        center ? "text-center" : ""
      } font-extrabold tracking-tight text-theme-orange-500  ${
        hasMargin ? "mb-12" : ""
      } ${sizeClass} ${
        color ? "text-theme-orange-500" : " text-theme-text-light"
      }`}
    >
      {text}
    </h2>
  );
};

export default Heading;
