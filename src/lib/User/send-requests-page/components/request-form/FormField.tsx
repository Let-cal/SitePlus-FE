import { Label } from "@/components/ui/label";
import * as React from "react";

interface FormFieldProps {
  label?: string;
  subtitle?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
  textTheme?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label = "",
  required = false,
  subtitle = "",
  error = "",
  children,
  className = "",
  textTheme = false,
}) => {
  const labelClassName = textTheme 
    ? "text-md font-medium text-theme-orange-500 mb-2" 
    : "text-gray-700";

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-row space-x-2 items-center">
        {label && (
          <Label className={labelClassName}>
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