"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormStepButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isSubmitting: boolean;
}

const FormStepButtons: React.FC<FormStepButtonsProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting,
}) => {
  return (
    <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1 || isSubmitting}
        className="focus-visible:ring-orange-400 focus-visible:ring-offset-0"
      >
        Quay lại
      </Button>

      {currentStep < totalSteps ? (
        <Button
          type="button"
          onClick={() => {
            console.log("Next button clicked");
            onNext();
          }}
          disabled={isSubmitting}
          className="bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-400 focus-visible:ring-offset-0"
        >
          Tiếp theo
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-orange-500 hover:bg-orange-600 focus-visible:ring-orange-400 focus-visible:ring-offset-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi...
            </>
          ) : (
            "Gửi yêu cầu"
          )}
        </Button>
      )}
    </div>
  );
};

export default FormStepButtons;
