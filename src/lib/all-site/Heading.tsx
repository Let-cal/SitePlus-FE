import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

interface HeadingProps {
  text: string;
  hasMargin?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  color?: boolean;
  center?: boolean;
  setColor?: string;
}

const Heading: React.FC<HeadingProps> = ({
  text,
  hasMargin = true,
  size = "md",
  color = true,
  center = true,
  setColor,
}) => {
  const sizeClass =
    size === "sm"
      ? "text-xl md:text-2xl lg:text-3xl"
      : size === "lg"
      ? "text-4xl md:text-5xl lg:text-6xl"
      : size === "md"
      ? "text-3xl md:text-4xl lg:text-5xl"
      : "text-[12px] md:text-xl lg:text-2xl";

  return (
    <AnimatePresence mode="wait">
      <motion.h2
        key={text} // Key thay đổi sẽ trigger animation
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`${
          center ? "text-center" : ""
        } ${setColor} font-extrabold tracking-tight dark:text-theme-primary-light ${
          hasMargin ? "mb-12" : ""
        } ${sizeClass} ${
          color ? "text-theme-orange-500" : "text-theme-text-light"
        }`}
      >
        {text}
      </motion.h2>
    </AnimatePresence>
  );
};

export default Heading;
