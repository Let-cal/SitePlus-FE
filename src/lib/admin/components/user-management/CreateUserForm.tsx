import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  adminService,
  Area,
  District,
  Role,
} from "@/services/admin/admin.service";
import { useUserContext } from "@/services/admin/UserContext";
import axios from "axios";
import {
  Building,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useEffect, useState } from "react";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { refreshData, fetchAllUsers } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(1);
  const [districts, setDistricts] = useState<District[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [roles, setRoles] = useState<Role[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [formData, setFormData] = useState({
    roleId: "",
    district: "",
    area: "",
    email: "",
    password: "",
    name: "",
  });

  // Fetch roles when component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await adminService.getAllRoles();
        // Only get roles "Manager", "Area-Manager", "Staff"
        const filteredRoles = data
          .filter((role) =>
            ["Manager", "Area-Manager", "Staff"].includes(role.name)
          )
          .sort((a, b) => a.name.localeCompare(b.name));
        setRoles(filteredRoles);
      } catch (error) {
        console.error("Lỗi khi lấy vai trò:", error);
      }
    };
    fetchRoles();
  }, []);

  // Fetch districts
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const data = await adminService.getAllDistricts();
        setDistricts(data);
      } catch (error) {
        console.error("Lỗi khi lấy quận:", error);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch areas when district is selected
  useEffect(() => {
    const fetchAreas = async () => {
      if (formData.district) {
        try {
          const districtId = parseInt(formData.district);
          const data = await adminService.getAreasByDistrict(districtId);
          setAreas(data);
        } catch (error) {
          console.error("Lỗi khi lấy khu vực:", error);
        }
      }
    };
    fetchAreas();
  }, [formData.district]);

  const handleRoleChange = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      roleId,
    }));
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStep(1);
      setFormData({
        roleId: "",
        district: "",
        area: "",
        email: "",
        password: "",
        name: "",
      });
    }
    onOpenChange(open);
  };

  // Validate before submit
  const validateBeforeSubmit = async () => {
    setIsValidating(true);
    try {
      // Check Manager role
      if (formData.roleId) {
        const selectedRole = roles.find(
          (role) => role.id.toString() === formData.roleId
        );

        // If Manager, check if one already exists
        if (selectedRole?.name === "Manager") {
          // Fetch all users with Manager role
          const allUsers = await fetchAllUsers();

          if (allUsers) {
            const existingManager = allUsers.listData.find(
              (user) => user.roleName === "Manager"
            );

            if (existingManager) {
              enqueueSnackbar("Chỉ được phép tồn tại một tài khoản Manager!", {
                variant: "error",
                preventDuplicate: true,
                anchorOrigin: {
                  horizontal: "left",
                  vertical: "bottom",
                },
              });
              return false;
            }
          }
        }

        // If Area-Manager, check if one already exists for this district
        if (selectedRole?.name === "Area-Manager" && formData.district) {
          const selectedDistrictId = parseInt(formData.district);

          // Get Area-Manager role ID
          const areaManagerRoleId = roles.find(
            (role) => role.name === "Area-Manager"
          )?.id;

          if (areaManagerRoleId) {
            const areaManagers = await fetchAllUsers(areaManagerRoleId);
            console.log(
              `Total Area Managers found: ${areaManagers?.listData.length}`
            );

            if (areaManagers && areaManagers.listData.length > 0) {
              for (const manager of areaManagers.listData) {
                if (!manager.areaId) continue;

                // Get the district directly from manager data
                const managerDistrictName = manager.districtName;
                const districtToCheck = districts.find(
                  (d) => d.name === managerDistrictName
                );

                if (districtToCheck) {
                  console.log(
                    `Checking Area-Manager: ${manager.name}, district: ${districtToCheck.id}, selected district: ${selectedDistrictId}`
                  );

                  if (districtToCheck.id === selectedDistrictId) {
                    console.log(
                      `Conflict found: ${manager.name} already manages district ${selectedDistrictId}`
                    );
                    enqueueSnackbar(
                      `Đã tồn tại Area-Manager (${manager.name}) cho quận này!`,
                      {
                        variant: "error",
                        preventDuplicate: true,
                        anchorOrigin: {
                          horizontal: "left",
                          vertical: "bottom",
                        },
                      }
                    );
                    return false;
                  }
                }
              }
            }
          }
        }
      }

      return true;
    } catch (error) {
      console.error("Validation error:", error);
      enqueueSnackbar("Lỗi kiểm tra dữ liệu", { variant: "error" });
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async () => {
    // Validate before sending request
    const isValid = await validateBeforeSubmit();
    if (!isValid) {
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleId: parseInt(formData.roleId),
        areaId: parseInt(formData.area),
      };
      console.log("user param: ", userData);

      await adminService.createUser(userData);

      enqueueSnackbar("Tạo người dùng thành công", {
        variant: "success",
        preventDuplicate: true,
        anchorOrigin: {
          horizontal: "left",
          vertical: "bottom",
        },
      });

      // Refresh the user data after successful creation
      refreshData();

      handleOpenChange(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Extract message from API response
        const errorMessage =
          error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";

        enqueueSnackbar(`Lỗi: ${errorMessage}`, {
          variant: "error",
          anchorOrigin: { horizontal: "left", vertical: "bottom" },
          preventDuplicate: true,
        });
      } else {
        enqueueSnackbar("Đã xảy ra lỗi khi tạo người dùng", {
          variant: "error",
          preventDuplicate: true,
          anchorOrigin: {
            horizontal: "left",
            vertical: "bottom",
          },
        });
      }
      console.error("Tạo người dùng thất bại:", error);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Chọn vai trò";
      case 2:
        return "Chọn khu vực";
      case 3:
        return "Thông Tin Người Dùng";
      default:
        return "Tạo Người Dùng Mới";
    }
  };

  const getTotalSteps = () => {
    return 3;
  };

  const renderRoleSelectionForm = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-muted-foreground text-sm mb-4">
          Chọn vai trò cho người dùng mới. Mỗi vai trò có các quyền hạn khác
          nhau trong hệ thống.
        </p>

        <RadioGroup
          value={formData.roleId}
          onValueChange={handleRoleChange}
          className="grid grid-cols-1 gap-4"
        >
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`border transition-all hover:shadow-md cursor-pointer ${
                formData.roleId === role.id.toString()
                  ? "border-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => handleRoleChange(role.id.toString())}
            >
              <CardContent className="flex items-center p-4">
                <RadioGroupItem
                  value={role.id.toString()}
                  id={role.id.toString()}
                  className="mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{role.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {role.name === "Manager" &&
                      "Quyền quản lý toàn bộ hệ thống"}
                    {role.name === "Area-Manager" &&
                      "Quyền quản lý khu vực được chỉ định"}
                    {role.name === "Staff" && "Nhân viên với quyền hạn cơ bản"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={nextStep}
          className="min-w-[120px]"
          disabled={!formData.roleId}
        >
          Tiếp theo <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderAreaSelectionForm = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm mb-4">
        Chọn khu vực cho người dùng này. Người dùng sẽ chỉ có quyền truy cập
        trong khu vực được chỉ định.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Thành phố
          </Label>
          <Input
            value="Thành Phố Hồ Chí Minh"
            disabled
            className="bg-muted/40"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Quận
          </Label>
          <Select
            value={formData.district}
            onValueChange={(district) =>
              setFormData((prev) => ({ ...prev, district, area: "" }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn quận" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id.toString()}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Khu vực
          </Label>
          <Select
            value={formData.area}
            onValueChange={(area) => setFormData((prev) => ({ ...prev, area }))}
            disabled={!formData.district}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn khu vực" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id.toString()}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!formData.district && (
            <p className="text-xs text-muted-foreground mt-1">
              Vui lòng chọn Quận trước
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={prevStep} variant="outline" className="min-w-[120px]">
          <ChevronLeft className="mr-2 h-4 w-4" /> Trước
        </Button>
        <Button
          onClick={nextStep}
          className="min-w-[120px]"
          disabled={!formData.district || !formData.area}
        >
          Tiếp theo <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderUserInfoForm = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm mb-4">
        Nhập thông tin cá nhân của người dùng. Thông tin này sẽ được dùng để
        đăng nhập và liên lạc.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Họ và tên
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Nhập họ và tên đầy đủ"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Tên đăng nhập
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="example@company.com"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Mật khẩu
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              placeholder="Nhập mật khẩu"
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Mật khẩu phải có ít nhất 8 ký tự
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={prevStep} variant="outline" className="min-w-[120px]">
          <ChevronLeft className="mr-2 h-4 w-4" /> Trước
        </Button>
        <Button
          className="min-w-[120px]"
          disabled={
            !formData.email ||
            !formData.password ||
            !formData.name ||
            isValidating
          }
          onClick={handleSubmit}
        >
          {isValidating ? "Đang kiểm tra..." : "Tạo Người Dùng"}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {getStepTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 mb-6">
          <Progress value={(step / getTotalSteps()) * 100} className="h-1.5" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>
              Bước {step} / {getTotalSteps()}
            </span>
            <span>
              {step === 1
                ? "Vai trò"
                : step === 2
                ? "Khu vực"
                : "Thông tin người dùng"}
            </span>
          </div>
        </div>

        {step === 1 && renderRoleSelectionForm()}
        {step === 2 && renderAreaSelectionForm()}
        {step === 3 && renderUserInfoForm()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
