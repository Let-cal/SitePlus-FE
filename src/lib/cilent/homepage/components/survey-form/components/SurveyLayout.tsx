import { Button } from "@/components/ui/button";
import * as React from "react";
import { Link, useLocation } from "react-router-dom";

const SurveyLayout = ({ children }) => {
  const location = useLocation();
  const isRatingPage = location.pathname === "/rating-requests-page";

  return (
    <div className="relative min-h-screen w-full">
      {/* Decorative circles - Lowered z-index */}
      <div className="fixed left-[-300px] top-1/4 w-[600px] h-[600px] rounded-full bg-theme-orange-500/80 pointer-events-none z-0" />
      <div className="fixed right-[-100px] top-52 w-[400px] h-[400px] rounded-full bg-theme-orange-500/55 pointer-events-none z-0" />

      {/* Switch button - Position relative to viewport with lower z-index than header */}
      <div className="fixed top-24 right-24 z-40">
        <Link
          to={isRatingPage ? "/survey-requests-page" : "/rating-requests-page"}
          className="inline-flex items-center justify-center"
        >
          <Button variant="outline" className="group relative overflow-hidden">
            <span className="relative z-10 group-hover:text-theme-primary-light">
              {isRatingPage
                ? "Chuyển sang Khảo sát tìm mặt bằng"
                : "Chuyển sang Khảo sát mặt bằng của bạn"}
            </span>
            <div className="absolute inset-0 bg-theme-orange-500 transform -translate-x-full group-hover:translate-x-0 group-hover:bg-theme-orange-600 transition-transform duration-300" />
          </Button>
        </Link>
      </div>

      {/* Main content - Adjust z-index */}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default SurveyLayout;
