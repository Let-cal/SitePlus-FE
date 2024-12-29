import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/auth/services/auth.service";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "@/lib/all-site/Heading";
interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

const ForgotForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await authService.forgotPassword(formData.email);
        setSuccessMessage(
          "Password reset instructions have been sent to your email"
        );
        setFormData({ email: "" });
        localStorage.setItem("email", formData.email);
        navigate("/OTP_page");
      } catch (error) {
        setErrors({
          email: error instanceof Error ? error.message : "An error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
   
        <Heading text="Forgot Your Password" hasMargin={false} size="sm"/>
        <p className="mt-2 text-sm text-gray-600">
          Enter your email to receive OTP code
        </p>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email Address"
            className={errors.email ? "border-red-500" : ""}
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={isLoading}
          />
          {errors.email && (
            <Alert variant="destructive" className="mt-1">
              <AlertDescription>{errors.email}</AlertDescription>
            </Alert>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default ForgotForm;
