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
import { Progress } from "@/components/ui/progress";
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
import { useUserContext } from "@/services/admin/UserContext";
import { Building, MapPin, Pencil, Shield } from "lucide-react";
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
  passWord: string;
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
  const [isValidating, setIsValidating] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [districtWithoutArea, setDistrictWithoutArea] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { fetchAllUsers } = useUserContext();

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
    originalRoleId: user.roleId || null, // Store original role for comparison
  });

  // Track if user has interacted with the district or area selectors
  const [hasInteracted, setHasInteracted] = useState(false);

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
        originalRoleId: user.roleId || null,
      });
      setHasInteracted(false); // Reset interaction state when dialog opens
    }
  }, [open, user]);

  useEffect(() => {
    // Only check for district without area after user interaction
    // or if user has modified the selections
    if (hasInteracted) {
      if (formData.districtId && !formData.areaId) {
        setDistrictWithoutArea(true);
      } else {
        setDistrictWithoutArea(false);
      }
    } else {
      // If no interaction has occurred, don't show the warning
      setDistrictWithoutArea(false);
    }
  }, [formData.districtId, formData.areaId, hasInteracted]);

  // Fetch data when dialog opens
  const fetchData = useCallback(async () => {
    if (!open) return;

    try {
      setIsDataLoaded(false);

      // Fetch districts
      const districtsData = await adminService.getAllDistricts();
      setDistricts(Array.isArray(districtsData) ? districtsData : []);

      // Fetch all areas for validation purposes
      const allAreasData = await adminService.getAllAreas();

      // Fetch areas based on districtId
      let districtId = user.districtId;
      if (user.areaId && !districtId) {
        const selectedArea = allAreasData.find(
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
  }, [formData.districtId, enqueueSnackbar, user.districtId, hasInteracted]);

  // Validate changes before submission
  const validateBeforeUpdate = async () => {
    setIsValidating(true);
    try {
      // 1. Check Manager role changes
      const originalRole = roles.find(
        (role) => role.id === formData.originalRoleId
      );
      const newRoleId = formData.roleId;
      const newRole = roles.find((role) => role.id === newRoleId);

      // Check if changing FROM Manager role to another role
      if (originalRole?.name === "Manager" && newRole?.name !== "Manager") {
        // Fetch all users to check if there are other Managers
        const allUsers = await fetchAllUsers();
        if (allUsers) {
          // Count managers excluding the current user
          const otherManagers = allUsers.listData.filter(
            (u) => u.roleName === "Manager" && u.id !== user.id
          );

          if (otherManagers.length === 0) {
            enqueueSnackbar(
              "Không thể thay đổi vai trò của Manager duy nhất trong hệ thống!",
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

      // 2. Check Area-Manager district conflicts
      if (newRole?.name === "Area-Manager" && formData.districtId) {
        const selectedDistrictId = formData.districtId;

        // Get Area-Manager role ID
        const areaManagerRoleId = roles.find(
          (role) => role.name === "Area-Manager"
        )?.id;

        if (areaManagerRoleId) {
          // Fetch all area managers directly using roleId parameter
          const areaManagers = await fetchAllUsers(areaManagerRoleId);
          console.log(
            `Total Area Managers found: ${areaManagers?.listData.length}`
          );

          if (areaManagers && areaManagers.listData.length > 0) {
            // Filter out the current user
            const otherAreaManagers = areaManagers.listData.filter(
              (manager) => manager.id !== user.id
            );
            console.log(
              `Other Area Managers to check: ${otherAreaManagers.length}`
            );

            // Check for conflicts with district
            for (const manager of otherAreaManagers) {
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
      if (originalRole?.name !== "Manager" && newRole?.name === "Manager") {
        // Lấy ID của role Manager
        const managerRoleId = roles.find((r) => r.name === "Manager")?.id;
        if (managerRoleId) {
          // Lấy danh sách tất cả Managers
          const allManagers = await fetchAllUsers(managerRoleId);
          if (allManagers?.listData) {
            // Lọc ra những Manager khác cùng thành phố với user hiện tại
            const conflict = allManagers.listData.find(
              (u) => u.id !== user.id && u.cityName === user.cityName
            );
            if (conflict) {
              enqueueSnackbar(`Mỗi thành phố chỉ cho phép 1 Manager`, {
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

  const handleDistrictChange = useCallback((districtId: number) => {
    setHasInteracted(true); // Mark that user has interacted with district selector
    setFormData((prev) => ({
      ...prev,
      districtId,
      areaId: null, // Reset area when district changes
    }));
  }, []);

  const handleAreaChange = useCallback((areaId: number) => {
    setHasInteracted(true); // Mark that user has interacted with area selector
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
    // Only check for district without area when submitting
    if (!isFormValid()) {
      // Chỉ hiển thị thông báo nếu người dùng đã tương tác và chưa chọn areaId khi đã chọn districtId
      if (hasInteracted && formData.districtId && !formData.areaId) {
        enqueueSnackbar("Vui lòng chọn khu vực khi đã chọn quận/huyện", {
          variant: "error",
        });
      }
      return;
    }

    // Validate before sending request
    const isValid = await validateBeforeUpdate();
    if (!isValid) {
      console.log("Validation failed. Stopping submission.");
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        id: formData.id,
        roleId: formData.roleId || user.roleId || 0,
        status: formData.status ? 1 : 2,
        areaId: formData.areaId || user.areaId || 0,
        districtId: formData.districtId || user.districtId || 0,
        password: user.passWord,
      };
      console.log("payload update user: ", updateData);
      await adminService.updateUser(updateData);
      swal("Thành công!", "Cập nhật người dùng thành công!", "success");
      await onUpdate();
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

  // Check if any changes have been made to enable/disable submit button
  const hasChanges = () => {
    return (
      formData.roleId !== user.roleId ||
      formData.status !== (user.status === 1) ||
      formData.districtId !== user.districtId ||
      formData.areaId !== user.areaId
    );
  };

  // Determine if form is valid for submission
  const isFormValid = () => {
    // Show warning only if user has interacted with the form and district/area is invalid
    if (hasInteracted && formData.districtId && !formData.areaId) {
      return false;
    }
    return true;
  };

  // Determine if role is being changed
  const isRoleChanged = formData.roleId !== user.roleId;

  // Determine if selected role is Area-Manager
  const isAreaManagerRole =
    roles.find((role) => role.id === formData.roleId)?.name === "Area-Manager";

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

        {!isDataLoaded ? (
          <div className="py-8">
            <Progress className="w-full h-2" value={50} />
            <p className="text-center mt-4 text-gray-500">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <Card className="p-4 space-y-4 border border-gray-200 shadow-sm bg-white rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{formData.name}</p>
                  <p className="text-sm text-gray-500">{formData.email}</p>
                </div>
                <Badge
                  className={`${
                    user.roleName === "Manager"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : user.roleName === "Area-Manager"
                      ? "bg-purple-500 hover:bg-purple-600"
                      : "bg-black hover:bg-gray-800"
                  }`}
                >
                  {user.roleName}
                </Badge>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-700 flex items-center"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Vai trò
                </Label>
                <Select
                  value={formData.roleId?.toString() || ""}
                  onValueChange={handleRoleChange}
                  disabled={isLoading || !isDataLoaded}
                >
                  <SelectTrigger className="w-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-md">
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
                {isRoleChanged && (
                  <p className="text-amber-600 text-xs mt-1">
                    Lưu ý: Thay đổi vai trò sẽ ảnh hưởng đến quyền hạn của người
                    dùng
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="district"
                  className="text-sm font-medium text-gray-700 flex items-center"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Quận/Huyện
                </Label>
                <DistrictCombobox
                  districts={districts}
                  selectedDistrictId={formData.districtId}
                  onSelect={handleDistrictChange}
                  isDataLoaded={isDataLoaded}
                  defaultName={user.districtName}
                />
                {isAreaManagerRole && (
                  <p className="text-amber-600 text-xs mt-1">
                    Mỗi quận chỉ được phép có một Area-Manager
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="area"
                  className="text-sm font-medium text-gray-700 flex items-center"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Khu vực
                </Label>
                <AreaCombobox
                  areas={areas}
                  selectedAreaId={formData.areaId}
                  onSelect={handleAreaChange}
                  disabled={!formData.districtId}
                  defaultName={!hasInteracted ? user.areaName : undefined}
                />
                {districtWithoutArea && (
                  <p className="text-amber-600 text-xs mt-1">
                    Lưu ý: Bạn phải chọn khu vực khi đã chọn quận/huyện
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium text-gray-700">
                Trạng thái người dùng
              </Label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    formData.status ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formData.status ? "Đang hoạt động" : "Vô hiệu hóa"}
                </span>
                <Switch
                  checked={formData.status}
                  onCheckedChange={handleStatusChange}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:hover:bg-green-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => handleOpenChangeInternal(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  isLoading || isValidating || !hasChanges() || !isFormValid()
                }
                className="bg-black hover:bg-gray-800 text-white rounded-md"
              >
                {isLoading || isValidating
                  ? "Đang xử lý..."
                  : "Cập nhật người dùng"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserDialog;
