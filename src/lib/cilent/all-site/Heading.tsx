import * as React from "react";

interface HeadingProps {
  text: string; // Nội dung sẽ hiển thị trong heading
}

const Heading: React.FC<HeadingProps> = ({ text }) => {
  return (
    <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl text-theme-orange-500 mb-12">
      {text}
    </h2>
  );
};

export default Heading;
