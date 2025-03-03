import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

const FormStepButtons = ({ currentStep, totalSteps, onPrevious, onNext, isSubmitting = false }) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="border-orange-300 text-orange-600 hover:bg-orange-50"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Quay lại
      </Button>

      {currentStep < totalSteps ? (
        <Button 
          type="button" 
          onClick={onNext}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Tiếp theo
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          type="submit"
          className="bg-orange-500 hover:bg-orange-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
          <Check className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default FormStepButtons;