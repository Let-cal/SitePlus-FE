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
import { adminService } from "@/services/admin/admin.service";
import axios from "axios";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useEffect, useState } from "react";
interface Province {
  code: string;
  name: string;
}

interface District {
  code: string;
  name: string;
  province: string;
}
interface Role {
  id: number;
  name: string;
  accounts: null;
}
const CreateUserDialog = ({ open, onOpenChange }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(1);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    roleId: "",
    city: "",
    district: "",
    email: "",
    password: "",
    name: "",
  });
  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await adminService.getAllRoles();
        // Chỉ lấy các role là "Manager", "Area-Manager", "Staff"
        const filteredRoles = data
          .filter((role) =>
            ["Manager", "Area-Manager", "Staff"].includes(role.name)
          )
          .sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp theo tên
        setRoles(filteredRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await adminService.getAllProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);
  // Fetch districts when a province is selected
  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.city) {
        try {
          const selectedProvince = provinces.find(
            (p) => p.name === formData.city
          );
          if (selectedProvince) {
            const data = await adminService.getDistrictsByProvince(
              selectedProvince.code
            );
            setDistricts(data);
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [formData.city, provinces]);
  // Helper function to get role name by id
  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id.toString() === roleId);
    return role?.name || "";
  };
  const handleRoleChange = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      roleId,
    }));
  };
  const showDistrictSelect = ["Area-Manager", "Staff"].includes(
    getRoleName(formData.roleId)
  );
  const showCitySelect = ["Manager", "Area-Manager", "Staff"].includes(
    getRoleName(formData.roleId)
  );

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleOpenChange = (open) => {
    if (!open) {
      setStep(1);
      setFormData({
        roleId: "",
        city: "",
        district: "",
        email: "",
        password: "",
        name: "",
      });
    }
    onOpenChange(open);
  };
  const handleSubmit = async () => {
    try {
      // Prepare area based on role
      let area: string | null = null;
      const roleName = getRoleName(formData.roleId);

      if (["Area-Manager", "Staff"].includes(roleName)) {
        area = `${formData.city},${formData.district}`;
      } else if (roleName === "Manager") {
        area = formData.city;
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleId: parseInt(formData.roleId),
        area: area,
      };

      await adminService.createUser(userData);
      // Close the dialog and optionally show success message
      enqueueSnackbar("Create user successfully", {
        variant: "success",
        preventDuplicate: true,
        anchorOrigin: {
          horizontal: "left",
          vertical: "bottom",
        },
      });
      handleOpenChange(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific error
        const errorMessages = error.response?.data?.["error-messages"] || [
          "An error occurred. Please try again.",
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
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Select Role";
      case 2:
        return "Choose Area";
      case 3:
        return "User Information";
      default:
        return "Create New User";
    }
  };

  const getTotalSteps = () => {
    return 3;
  };

  const renderUserInfoForm = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter name"
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
            placeholder="Enter email"
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            placeholder="Enter password"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox checked={true} disabled className="bg-gray-200" />
          <Label>Status (Active)</Label>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button onClick={prevStep} variant="outline" className="w-full">
          Previous
        </Button>
        <Button
          className="w-full"
          disabled={!formData.email || !formData.password || !formData.name}
          onClick={handleSubmit}
        >
          Create User
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-5">
            {getStepTitle()} - Step {step}/{getTotalSteps()}
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
              Next
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {showCitySelect && (
              <div className="space-y-2">
                <Label>City</Label>
                <Select
                  value={formData.city}
                  onValueChange={(city) =>
                    setFormData((prev) => ({ ...prev, city, district: "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.name}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showDistrictSelect && (
              <div className="space-y-2">
                <Label>District</Label>
                <Select
                  value={formData.district}
                  onValueChange={(district) =>
                    setFormData((prev) => ({ ...prev, district }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {districts.map((district) => (
                      <SelectItem key={district.code} value={district.name}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex space-x-4">
              <Button onClick={prevStep} variant="outline" className="w-full">
                Previous
              </Button>
              <Button
                onClick={nextStep}
                className="w-full"
                disabled={
                  (showCitySelect && !formData.city) ||
                  (showDistrictSelect && !formData.district)
                }
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 3 && renderUserInfoForm()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
