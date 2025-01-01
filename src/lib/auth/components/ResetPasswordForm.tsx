import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Heading from "@/lib/all-site/Heading";
import { authService } from "@/services/auth.service";
import { enqueueSnackbar } from "notistack";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  //   useEffect(() => {
  //     const savedEmail = localStorage.getItem("email");
  //     if (!savedEmail) {
  //       // Redirect back to forgot password if no email is found
  //       navigate("/forgot-password");
  //       enqueueSnackbar("Plese enter your email again !!!", {
  //         variant: "error",
  //         preventDuplicate: true,
  //         anchorOrigin: {
  //           horizontal: "left",
  //           vertical: "bottom",
  //         },
  //       });
  //       return;
  //     }
  //     setFormData((prev) => ({ ...prev, email: savedEmail }));
  //   }, [navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await authService.resetPassword(formData);

        if (response.success) {
          enqueueSnackbar("Password reset successfully", {
            variant: "success",
            preventDuplicate: true,
            anchorOrigin: {
              horizontal: "left",
              vertical: "bottom",
            },
          });

          // Clear email from localStorage
          localStorage.removeItem("email");

          // Redirect to login page
          navigate("/sign-in");
        } else {
          throw new Error(response.message || "Password reset failed");
        }
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error ? error.message : "Password reset failed",
          {
            variant: "error",
            preventDuplicate: true,
            anchorOrigin: {
              horizontal: "left",
              vertical: "bottom",
            },
          }
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <Heading text="Reset Password" hasMargin={false} size="sm" />
        <p className="mt-2 text-sm text-gray-600">Enter your new password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email display field (disabled) */}
        <div>
          <Input
            type="email"
            value={formData.email}
            className="bg-gray-100"
            disabled
          />
        </div>

        {/* Password field */}
        <div>
          <Input
            type="password"
            placeholder="New Password"
            className={errors.password ? "border-red-500" : ""}
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={isLoading}
          />
          {errors.password && (
            <Alert variant="destructive" className="mt-1">
              <AlertDescription>{errors.password}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Confirm Password field */}
        <div>
          <Input
            type="password"
            placeholder="Confirm New Password"
            className={errors.confirmPassword ? "border-red-500" : ""}
            value={formData.confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <Alert variant="destructive" className="mt-1">
              <AlertDescription>{errors.confirmPassword}</AlertDescription>
            </Alert>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
