import { Progress } from "@/components/ui/progress";
import * as React from "react";

const ProgressHeader = ({ currentStep, totalSteps }) => {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">
          Bước {currentStep}/{totalSteps}
        </p>
        <p className="text-sm font-medium">{progressPercentage}%</p>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
};

export default ProgressHeader;
