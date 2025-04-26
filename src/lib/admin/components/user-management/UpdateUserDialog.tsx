import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  adminService,
  Area,
  District,
  Role,
} from "@/services/admin/admin.service";
import { Pencil } from "lucide-react";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import swal from "sweetalert";
import AreaCombobox from "./AreaCombobox";
import DistrictCombobox from "./DistrictCombobox";

interface User {
  id: number;
  email: string;
  name: string;
  roleName: string;
  roleId?: number;
  areaId?: number;
  districtId?: number;
  districtName?: string;
  areaName?: string;
  cityName?: string;
  status: boolean | number;
  statusName: string;
  createdAt: string;
  password: string;
}

interface UpdateUserDialogProps {
  user: User;
  roles: Role[];
  onUpdate: () => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asTrigger?: boolean;
}

const UpdateUserDialog = ({
  user,
  onUpdate,
  roles,
  open,
  onOpenChange,
  asTrigger = false,
}: UpdateUserDialogProps) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Initialize formData with user data
  const [formData, setFormData] = useState({
    id: user.id,
    email: user.email,
    name: user.name,
    roleId: user.roleId || null,
    status: user.status === 1,
    districtId: user.districtId || null,
    areaId: user.areaId || null,
    password: "",
  });

  // Reset formData only when dialog opens or user changes
  useEffect(() => {
    if (open) {
      setFormData({
        id: user.id,
        email: user.email,
        name: user.name,
        roleId: user.roleId || null,
        status: user.status === 1,
        districtId: user.districtId || null,
        areaId: user.areaId || null,
        password: "",
      });
    }
  }, [open, user]);

  // Fetch data when dialog opens
  const fetchData = useCallback(async () => {
    if (!open) return;

    try {
      setIsDataLoaded(false);

      // Fetch districts
      const districtsData = await adminService.getAllDistricts();
      setDistricts(Array.isArray(districtsData) ? districtsData : []);

      // Fetch areas based on districtId
      let districtId = user.districtId;
      if (user.areaId && !districtId) {
        const allAreas = await adminService.getAllAreas();
        const selectedArea = allAreas.find(
          (area: Area) => area.id === user.areaId
        );
        districtId = selectedArea?.districtId || null;
      }

      if (districtId) {
        const areasData = await adminService.getAreasByDistrict(districtId);
        const validAreas = Array.isArray(areasData) ? areasData : [];
        setAreas(validAreas);

        // Update formData only for districtId and areaId
        setFormData((prev) => {
          const newDistrictId = districtId || prev.districtId;
          const newAreaId =
            user.areaId &&
            validAreas.some((area: Area) => area.id === user.areaId)
              ? user.areaId
              : null;

          if (newDistrictId === prev.districtId && newAreaId === prev.areaId) {
            return prev;
          }

          return {
            ...prev,
            districtId: newDistrictId,
            areaId: newAreaId,
          };
        });
      } else {
        setAreas([]);
        setFormData((prev) => ({
          ...prev,
          districtId: null,
          areaId: null,
        }));
      }

      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDistricts([]);
      setAreas([]);
      setIsDataLoaded(true);
      enqueueSnackbar("Không thể tải dữ liệu", { variant: "error" });
    }
  }, [open, user.areaId, user.districtId, enqueueSnackbar]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load areas when districtId changes
  useEffect(() => {
    const loadAreasByDistrict = async () => {
      if (formData.districtId) {
        try {
          const areasData = await adminService.getAreasByDistrict(
            formData.districtId
          );
          setAreas(Array.isArray(areasData) ? areasData : []);
          setFormData((prev) => ({
            ...prev,
            areaId: null,
          }));
        } catch (error) {
          console.error("Error fetching areas:", error);
          setAreas([]);
          enqueueSnackbar("Không thể tải danh sách khu vực", {
            variant: "error",
          });
        }
      }
    };

    loadAreasByDistrict();
  }, [formData.districtId, enqueueSnackbar]);

  const handleDistrictChange = useCallback((districtId: number) => {
    setFormData((prev) => ({
      ...prev,
      districtId,
      areaId: null,
    }));
  }, []);

  const handleAreaChange = useCallback((areaId: number) => {
    setFormData((prev) => ({
      ...prev,
      areaId,
    }));
  }, []);

  const handleRoleChange = useCallback((roleId: string) => {
    const parsedRoleId = parseInt(roleId) || null;
    setFormData((prev) => ({
      ...prev,
      roleId: parsedRoleId,
    }));
  }, []);

  const handleStatusChange = useCallback((status: boolean) => {
    setFormData((prev) => ({
      ...prev,
      status,
    }));
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        id: formData.id,
        email: formData.email,
        name: formData.name,
        roleId: formData.roleId || user.roleId || 0,
        status: formData.status ? 1 : 0,
        areaId: formData.areaId || user.areaId || 0,
        districtId: formData.districtId || user.districtId || 0,
        password: formData.password || user.password,
      };

      await adminService.updateUser(updateData);
      swal("Thành công!", "Cập nhật người dùng thành công!", "success");
      await onUpdate();
      // Reset body styles after successful update
      onOpenChange(false);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Không thể cập nhật người dùng",
        { variant: "error" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog open/close
  const handleOpenChangeInternal = (open: boolean) => {
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeInternal}>
      {asTrigger ? (
        <DialogTrigger asChild>
          <div
            className="flex items-center justify-start gap-2 text-sm hover:bg-accent w-full cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenChange(true);
            }}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Cập nhật
          </div>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-[500px] p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Cập nhật người dùng
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Chỉnh sửa thông tin và trạng thái của người dùng.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-6">
          <Card className="p-4 space-y-4 border-none shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{formData.name}</p>
                <p className="text-sm text-gray-500">{formData.email}</p>
              </div>
              <Badge className="bg-black hover:bg-gray-800">
                {user.roleName}
              </Badge>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="role"
                className="text-sm font-medium text-gray-700"
              >
                Vai trò
              </Label>
              <Select
                value={formData.roleId?.toString() || ""}
                onValueChange={handleRoleChange}
                disabled={isLoading || !isDataLoaded}
              >
                <SelectTrigger className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="district"
                className="text-sm font-medium text-gray-700"
              >
                Quận/Huyện
              </Label>
              <DistrictCombobox
                districts={districts}
                selectedDistrictId={formData.districtId}
                onSelect={handleDistrictChange}
                isDataLoaded={isDataLoaded}
                defaultName={user.districtName}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="area"
                className="text-sm font-medium text-gray-700"
              >
                Khu vực
              </Label>
              <AreaCombobox
                areas={areas}
                selectedAreaId={formData.areaId}
                onSelect={handleAreaChange}
                disabled={!formData.districtId}
                defaultName={user.areaName}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              Trạng thái
            </Label>
            <Switch
              checked={formData.status}
              onCheckedChange={handleStatusChange}
              className="data-[state=checked]:bg-green-500 data-[state=checked]:hover:bg-green-600"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => handleOpenChangeInternal(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-black hover:bg-gray-800 text-white"
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserDialog;
