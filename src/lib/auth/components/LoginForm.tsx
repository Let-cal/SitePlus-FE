import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Heading from "@/lib/all-site/Heading";
import { authService } from "@/lib/auth/services/auth.service";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
          localStorage.setItem("email", formData.email);
          localStorage.setItem("hint", response.hint.toString());

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
        if (error instanceof Error) {
          enqueueSnackbar(error.message, {
            variant: "error",
            preventDuplicate: true,
            anchorOrigin: {
              horizontal: "left",
              vertical: "bottom",
            },
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

  const handleGoogleSignIn = () => {
    // Handle Google sign-in logic here
    enqueueSnackbar("Google sign-in is not implemented yet", {
      variant: "error",
      preventDuplicate: true,
      anchorOrigin: {
        horizontal: "left",
        vertical: "bottom",
      },
    });
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
        email: storedEmail,
        password: storedPassword,
      });
      setChecked(true);
    }
  }, []);

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <Heading text="Log in Account" hasMargin={false} size="sm" />
        <p className="mt-2 text-sm text-gray-600">
          Join our exclusive community
        </p>
      </div>

      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email Address"
            disabled={isLoading}
            className={errors.email ? "border-red-500" : ""}
            value={formData.email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && (
            <Alert variant="destructive" className="mt-1">
              <AlertDescription>{errors.email}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="relative">
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

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Create an account
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600">
          Did you forget your account?{" "}
          <Link
            to="/forgot-password"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Click here!!!
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
