import * as React from "react";

interface BoxContentProps {
  iconUrl: string;
  title: string;
  description: string;
  bulletPoints?: string[];
}

export default function BoxContent({
  iconUrl,
  title,
  description,
  bulletPoints = [],
}: BoxContentProps) {
  return (
    <div className="group flex w-full lg:w-[370.667px] h-full pt-[20px] pr-0  pb-[20px] pl-0 flex-col gap-[24px] items-center flex-nowrap bg-[rgba(253,242,229,0.91)] rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-theme-orange-500 hover:scale-105 xs:hover:scale-100 hover:text-white xs:p-4 xs:gap-4">
      <img
        src={iconUrl}
        alt={title}
        className="w-8 h-8 object-contain transition-transform duration-300 hover:scale-110 group-hover:fill-white"
      />
      <div className="w-full space-y-4 px-6 xs:px-4">
        <h2 className="font-sans text-xl lg:text-2xl xs:text-lg font-semibold text-gray-900 text-center tracking-tight group-hover:text-white">
          {title}
        </h2>

        <div className="space-y-4">
          <p className="font-sans text-base lg:text-lg xs:text-sm text-gray-700 leading-relaxed  group-hover:text-white">
            {description}
          </p>

          {bulletPoints.length > 0 && (
            <div className="space-y-2">
              <p className="font-sans text-base lg:text-lg xs:text-sm text-gray-700  group-hover:text-white">
                Bao gồm:
              </p>
              <ul className="space-y-2">
                {bulletPoints.map((point, index) => (
                  <li
                    key={index}
                    className="font-sans text-base lg:text-lg xs:text-sm font-medium text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400  group-hover:text-white"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
