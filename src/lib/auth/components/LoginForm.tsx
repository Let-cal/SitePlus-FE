import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Heading from "@/lib/all-site/Heading";
import { authService } from "@/services/auth.service";
import axios from "axios";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../services/AuthContext";
interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    setIsAuthenticated,
    setUserRole,
    setUserName,
    setUserEmail,
    setUserId,
  } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await authService.login(formData);

        if (response.success) {
          // Store user data
          localStorage.setItem("token", response.token);
          localStorage.setItem("role", response.role);
          localStorage.setItem("email", formData.username);
          localStorage.setItem("hint", response.hint.toString());
          localStorage.setItem("name", response.name);
          // Update auth context states directly
          setIsAuthenticated(true);
          setUserRole(response.role);
          setUserName(response.name);
          setUserEmail(formData.username);
          setUserId(response.hint);
          console.log(localStorage.getItem("token"));
          // Store password if remember me is checked
          if (checked) {
            localStorage.setItem("password", formData.password);
          } else {
            localStorage.removeItem("password");
          }

          // Update auth context
          setIsAuthenticated(true);
          setUserRole(response.role);

          enqueueSnackbar("Logged in successfully", {
            variant: "success",
            preventDuplicate: true,
            anchorOrigin: {
              horizontal: "left",
              vertical: "bottom",
            },
          });

          // Navigate based on role
          switch (response.role) {
            case "Admin":
              navigate("/admin-page");
              break;
            case "Customer":
              navigate("/customer-page");
              break;
            case "Manager":
              navigate("/manager-page");
              break;
            case "Area-Manager":
              navigate("/area-manager-page");
              break;
            case "Staff":
              navigate("/staff-page");
              break;
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle Axios-specific error
          const errorMessages = error.response?.data?.["error-messages"] || [
            "Wrong your email or password !!! Please try again.",
          ];
          errorMessages.forEach((message) => {
            enqueueSnackbar(`Error: ${message}`, {
              variant: "error",
              anchorOrigin: { horizontal: "left", vertical: "bottom" },
              preventDuplicate: true,
            });
          });
        } else {
          enqueueSnackbar("An error occurred during login", {
            variant: "error",
            preventDuplicate: true,
            anchorOrigin: {
              horizontal: "left",
              vertical: "bottom",
            },
          });
        }
        console.error("Login failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRememberMe = (checked: boolean) => {
    setChecked(checked);
    // If unchecked, remove stored password
    if (!checked) {
      localStorage.removeItem("password");
    }
  };
  React.useEffect(() => {
    const storedPassword = localStorage.getItem("password");
    const storedEmail = localStorage.getItem("email");
    if (storedPassword && storedEmail) {
      setFormData({
        username: storedEmail,
        password: storedPassword,
      });
      setChecked(true);
    }
  }, []);

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <Heading text="Login Account" hasMargin={false} size="sm" />
        <p className="mt-2 text-sm text-gray-600">
          Join our exclusive community
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Welcome</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="dark:text-theme-primary-dark">
          <Input
            type="username"
            placeholder="Username"
            disabled={isLoading}
            className={errors.username ? "border-red-500" : ""}
            value={formData.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          {errors.username && (
            <Alert variant="destructive" className="mt-1">
              <AlertDescription>{errors.username}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="relative dark:text-theme-primary-dark">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            disabled={isLoading}
            className={errors.password ? "border-red-500" : ""}
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span className="material-icons text-gray-500">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </span>
          {errors.password && (
            <Alert variant="destructive" className="mt-1">
              <AlertDescription>{errors.password}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember-me"
            checked={checked}
            onCheckedChange={handleRememberMe}
          />
          <label
            htmlFor="remember-me"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Remember me
          </label>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isLoading ? "LOGGING IN..." : "LOGIN"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;