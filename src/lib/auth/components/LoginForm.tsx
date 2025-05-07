import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Heading from "@/lib/all-site/Heading";
import { authService } from "@/services/auth.service";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useState, useEffect } from "react";
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

  // Prevent browser back button
  useEffect(() => {
    const preventGoBack = (e: PopStateEvent) => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener('popstate', preventGoBack);
    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener('popstate', preventGoBack);
    };
  }, []);

  // Load saved login data
  useEffect(() => {
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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
          window.history.pushState(null, "", window.location.href);

          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          localStorage.removeItem("hint");
          localStorage.removeItem("name");

          localStorage.setItem("token", response.token);
          localStorage.setItem("role", response.role);
          localStorage.setItem("email", formData.username);
          localStorage.setItem("hint", response.hint.toString());
          localStorage.setItem("name", response.name);

          if (checked) {
            localStorage.setItem("password", formData.password);
          } else {
            localStorage.removeItem("password");
          }

          setIsAuthenticated(true);
          setUserRole(response.role);
          setUserName(response.name);
          setUserEmail(formData.username);
          setUserId(response.hint);

          enqueueSnackbar("Đăng nhập thành công!", {
            variant: "success",
            preventDuplicate: true,
            anchorOrigin: {
              horizontal: "left",
              vertical: "bottom",
            },
          });

          let targetPath = "";
          switch (response.role) {
            case "Admin":
              targetPath = "/admin-page";
              break;
            case "Manager":
              targetPath = "/manager-page";
              break;
            case "Area-Manager":
              targetPath = "/area-manager-page";
              break;
          }

          navigate(targetPath, { replace: true });

          window.addEventListener('popstate', function preventReturn() {
            window.history.pushState(null, "", targetPath);
            return () => {
              window.removeEventListener('popstate', preventReturn);
            };
          });
        }
      } catch (error) {
        let errorMessage = "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau!";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        enqueueSnackbar(errorMessage, {
          variant: "error",
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
          preventDuplicate: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRememberMe = (checked: boolean) => {
    setChecked(checked);
    if (!checked) {
      localStorage.removeItem("password");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <Heading text="Đăng Nhập Tài Khoản" hasMargin={false} size="sm" />
        <p className="mt-2 text-sm text-gray-600">
          Đồng hành cùng cộng đồng thương hiệu tiên phong
          <br />
          cùng tìm ra vị trí kinh doanh lý tưởng cho bạn
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

      <form onSubmit={handleSubmit}>
        <div className="dark:text-theme-primary-dark">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            id="username"
            type="email"
            placeholder="Nhập email của bạn"
            disabled={isLoading}
            value={formData.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          {/* Reserve space for email error (if needed in the future) */}
          <p className="text-sm h-5 mt-1 text-red-500">{errors.username || " "}</p>
        </div>

        <div className="relative dark:text-theme-primary-dark mb-4" >
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu của bạn"
              disabled={isLoading}
              className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-icons text-gray-500">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </span>
          </div>
          {/* Reserve space for password error */}
          <p className="text-sm h-5 mt-1 text-red-500">{errors.password || " "}</p>
        </div>

        {/* Uncomment if remember me functionality is needed */}
        {/* <div className="flex items-center space-x-2">
          <Checkbox
            id="remember-me"
            checked={checked}
            onCheckedChange={handleRememberMe}
          />
          <label
            htmlFor="remember-me"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Nhớ mật khẩu
          </label>
        </div> */}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;