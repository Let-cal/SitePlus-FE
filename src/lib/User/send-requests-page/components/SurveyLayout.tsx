import * as React from "react";

const SurveyLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full">
      {/* Decorative circles - Lowered z-index */}
      <div className="fixed left-[-400px] top-1/4 w-[600px] h-[600px] rounded-full bg-theme-orange-500/70 pointer-events-none z-0" />
      <div className="fixed right-[-100px] top-52 w-[400px] h-[400px] rounded-full bg-theme-orange-500/40 pointer-events-none z-0" />

      {/* Main content - Adjust z-index */}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default SurveyLayout;
