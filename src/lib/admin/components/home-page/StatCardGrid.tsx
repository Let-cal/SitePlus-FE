import { defineElement } from "@lordicon/element";
import lottie from "lottie-web";
import * as React from "react";
import { useEffect } from "react";
const StatCard = ({
  title,
  value,
  changeValue,
  changeText,
  trend,
  iconUrl,
  iconSize = "46px",
}) => {
  useEffect(() => {
    defineElement(lottie.loadAnimation);
  }, []);

  return (
    <div className="w-full xs:w-[180px] sm:w-[200px] md:w-[220px] lg:w-[262px] h-auto min-h-[161px] bg-theme-primary-light dark:bg-theme-primary-dark rounded-lg border border-theme-border-light dark:border-theme-border-dark shadow-lg transition-colors">
      <div className="p-4 relative">
        <span className="block lg:text-2xl xs:text-base font-semibold text-theme-text-light/70 dark:text-theme-text-dark/70 tracking-tight">
          {title}
        </span>
        <div className="w-[60px] h-[60px] absolute top-4 right-4">
          <lord-icon
            src={iconUrl}
            trigger="loop"
            delay="2000"
            state="in-reveal"
            style={{ width: "100%", height: iconSize }}
          />
        </div>
        <span className="block mt-2 text-2xl xs:text-3xl font-bold text-theme-text-light dark:text-theme-text-dark tracking-tight">
          {value}
        </span>

        <div className="flex items-center gap-3 mt-4">
          <div className="w-6 h-6 shrink-0">
            <lord-icon
              src={
                trend === "up"
                  ? "https://cdn.lordicon.com/yxyampao.json"
                  : "https://cdn.lordicon.com/utqytqrt.json"
              }
              trigger="loop"
              colors={trend === "up" ? "primary:#00b69b" : "primary:#e83a30"}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          <div className="text-sm xs:text-base font-semibold tracking-tight">
            <span
              className={trend === "up" ? "text-[#00b69b]" : "text-[#f93c65]"}
            >
              {changeValue}
            </span>
            <span className="text-theme-text-light/60 dark:text-theme-text-dark/60">
              {" "}
              {changeText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCardGrid = ({ cards }) => {
  return (
    <div className=" w-full mx-auto">
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 justify-items-center">
        {cards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default StatCardGrid;
