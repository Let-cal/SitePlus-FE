import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeadingProps {
  text: string;
  hasMargin?: boolean;
  size?: "sm" | "md" | "lg";
  color?: boolean;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  text,
  hasMargin = true,
  size = "md",
  color = true,
  center = true,
}) => {
  const sizeClass =
    size === "sm"
      ? "text-xl md:text-2xl lg:text-3xl"
      : size === "lg"
      ? "text-4xl md:text-5xl lg:text-6xl"
      : "text-3xl md:text-4xl lg:text-5xl";

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
        } font-extrabold tracking-tight text-theme-orange-500 dark:text-theme-primary-light ${
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