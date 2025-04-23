import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const { refreshData } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(1);
  const [districts, setDistricts] = useState<District[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    roleId: "",
    district: "",
    area: "",
    email: "",
    password: "",
    name: "",
  });

  // Lấy danh sách vai trò khi component được mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await adminService.getAllRoles();
        // Chỉ lấy các vai trò "Manager", "Area-Manager", "Staff"
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

  // Lấy danh sách quận
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

  // Lấy danh sách khu vực khi đã chọn quận
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

  const handleSubmit = async () => {
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
        // Trích xuất message từ API response
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
        return "Chọn Vai Trò";
      case 2:
        return "Chọn Khu Vực";
      case 3:
        return "Thông Tin Người Dùng";
      default:
        return "Tạo Người Dùng Mới";
    }
  };

  const getTotalSteps = () => {
    return 3;
  };

  const renderAreaSelectionForm = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Thành phố</Label>
        <Input value="Thành Phố Hồ Chí Minh" disabled className="bg-gray-100" />
      </div>

      <div className="space-y-2">
        <Label>Quận</Label>
        <Select
          value={formData.district}
          onValueChange={(district) =>
            setFormData((prev) => ({ ...prev, district, area: "" }))
          }
        >
          <SelectTrigger>
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
        <Label>Khu vực</Label>
        <Select
          value={formData.area}
          onValueChange={(area) => setFormData((prev) => ({ ...prev, area }))}
          disabled={!formData.district}
        >
          <SelectTrigger>
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
      </div>

      <div className="flex space-x-4">
        <Button onClick={prevStep} variant="outline" className="w-full">
          Trước
        </Button>
        <Button
          onClick={nextStep}
          className="w-full"
          disabled={!formData.district || !formData.area}
        >
          Tiếp
        </Button>
      </div>
    </div>
  );

  const renderUserInfoForm = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Tên</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Nhập tên"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Nhập email"
          />
        </div>

        <div>
          <Label>Mật khẩu</Label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            placeholder="Nhập mật khẩu"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <Button onClick={prevStep} variant="outline" className="w-full">
          Trước
        </Button>
        <Button
          className="w-full"
          disabled={!formData.email || !formData.password || !formData.name}
          onClick={handleSubmit}
        >
          Tạo Người Dùng
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-5">
            {getStepTitle()} - Bước {step}/{getTotalSteps()}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {roles.map((role) => (
                  <div key={role.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={role.id.toString()}
                      checked={formData.roleId === role.id.toString()}
                      onCheckedChange={() =>
                        handleRoleChange(role.id.toString())
                      }
                    />
                    <Label htmlFor={role.id.toString()}>{role.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={nextStep}
              className="w-full"
              disabled={!formData.roleId}
            >
              Tiếp
            </Button>
          </div>
        )}

        {step === 2 && renderAreaSelectionForm()}

        {step === 3 && renderUserInfoForm()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
