import { Label } from "@/components/ui/label";
import * as React from "react";

interface FormFieldProps {
  label?: string;
  subtitle?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label = "",
  required = false,
  subtitle = "",
  error = "",
  children,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-row space-x-2 items-center">
        {label && (
          <Label className="text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      {children}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FormField;
