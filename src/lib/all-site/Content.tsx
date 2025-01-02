import * as React from "react";

interface ContentProps {
  text: string; // Nội dung sẽ hiển thị trong heading
}

const Content: React.FC<ContentProps> = ({ text }) => {
  return (
    <blockquote className="text-lg md:text-xl text-theme-text-light dark:text-theme-text-dark text-center mb-6 max-w-2xl mx-auto leading-relaxed">
      {text}
    </blockquote>
  );
};

export default Content;
