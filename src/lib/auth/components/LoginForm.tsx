import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Heading from "@/lib/all-site/Heading";
import { authService } from "@/services/auth.service";
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
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("email");
          localStorage.removeItem("hint");
          localStorage.removeItem("name");
          // Store user data
          localStorage.setItem("token", response.token);
          localStorage.setItem("role", response.role);
          localStorage.setItem("email", formData.username);
          localStorage.setItem("hint", response.hint.toString());
          localStorage.setItem("name", response.name);

          console.log(localStorage.getItem("token"));
          // Store password if remember me is checked
          if (checked) {
            localStorage.setItem("password", formData.password);
          } else {
            localStorage.removeItem("password");
          }
          // Update auth context states directly
          setIsAuthenticated(true);
          setUserRole(response.role);
          setUserName(response.name);
          setUserEmail(formData.username);
          setUserId(response.hint);

          enqueueSnackbar("Đăng nhập thành công !", {
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="dark:text-theme-primary-dark">
          <Input
            type="username"
            placeholder="Nhập email của bạn"
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
            placeholder="Nhập mật khẩu của bạn"
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
            Nhớ mặt khẩu
          </label>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
