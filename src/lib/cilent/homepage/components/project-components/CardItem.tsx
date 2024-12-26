import * as React from "react";

interface CardItemProps {
  image: string;
  title: string;
}

export const CardItem: React.FC<CardItemProps> = ({ image, title }) => {
  return (
    <div
      className="relative group overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out"
      style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Hình ảnh */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform select-none"
      />
      {/* Gradient phủ toàn bộ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      {/* Tiêu đề */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 via-transparent to-transparent p-4">
        <h3 className="text-lg font-semibold text-white transition-all duration-300 ease-in-out group-hover:-translate-y-3 group-hover:text-gray-100 select-none">
          {title}
        </h3>
      </div>
    </div>
  );
};
