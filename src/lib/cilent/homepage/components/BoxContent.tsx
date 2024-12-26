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
    <div className=" flex w-[370.667px] h-full pt-[20px] pr-0 pb-[20px] pl-0 flex-col gap-[24px] items-center flex-nowrap bg-[rgba(253,242,229,0.91)] rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-[rgba(243,226,206,0.91)] hover:scale-105 xs:p-4 xs:gap-4">
      <img
        src={iconUrl}
        alt={title}
        className="w-8 h-8 object-contain transition-transform duration-300 hover:scale-110"
      />
      <div className="w-full space-y-4 px-4 xs:px-2">
        <h2 className="font-sans text-2xl md:text-xl xs:text-lg font-semibold text-gray-900 text-center tracking-tight">
          {title}
        </h2>

        <div className="space-y-4">
          <p className="font-sans text-lg md:text-base xs:text-sm text-gray-700 leading-relaxed">
            {description}
          </p>

          {bulletPoints.length > 0 && (
            <div className="space-y-2">
              <p className="font-sans text-lg md:text-base xs:text-sm text-gray-700">
                Bao gồm:
              </p>
              <ul className="space-y-2">
                {bulletPoints.map((point, index) => (
                  <li
                    key={index}
                    className="font-sans text-lg md:text-base xs:text-sm font-medium text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400"
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
