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
import { X } from "lucide-react";
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
    status: true,
    isGoogleUser: false,
  });
  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await adminService.getAllRoles();
        // Filter out Admin role and sort by name
        const filteredRoles = data
          .filter((role) => role.name !== "Admin")
          .sort((a, b) => a.name.localeCompare(b.name));
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
      isGoogleUser: getRoleName(formData.roleId) === "Customer",
    }));
  };
  const showDistrictSelect = ["Area-Manager", "Staff"].includes(
    getRoleName(formData.roleId)
  );
  const showCitySelect = ["Manager", "Area-Manager", "Staff"].includes(
    getRoleName(formData.roleId)
  );

  const nextStep = () => {
    if (getRoleName(formData.roleId) === "Customer") {
      setStep(2); // Customer chỉ có 2 bước
    } else if (step < 3) {
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
        status: true,
        isGoogleUser: false,
      });
    }
    onOpenChange(open);
  };

  const getStepTitle = () => {
    if (getRoleName(formData.roleId) === "Customer") {
      return step === 1 ? "Select Role" : "User Information";
    }
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
    return getRoleName(formData.roleId) === "Customer" ? 2 : 3;
  };
  const isCustomer = getRoleName(formData.roleId) === "Customer";
  const renderUserInfoForm = () => (
    <div className="space-y-6">
      <div className="space-y-4">
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

        <div className="flex items-center space-x-2">
          <Checkbox checked={true} disabled className="bg-gray-200" />
          <Label>Status (Active)</Label>
        </div>

        <div className="flex items-center space-x-2 relative">
          <Checkbox
            checked={isCustomer}
            disabled
            className={isCustomer ? "bg-green-500" : "bg-red-500"}
          />
          {!isCustomer && (
            <div className="absolute left-[-8px] top-[1px] text-white">
              <X size={15} />
            </div>
          )}
          <Label>Is Google User</Label>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button onClick={prevStep} variant="outline" className="w-full">
          Previous
        </Button>
        <Button
          className="w-full"
          disabled={!formData.email || !formData.password || !formData.name}
          onClick={() => handleOpenChange(false)}
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
              <div className="grid grid-cols-2 gap-4">
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

        {step === 2 && getRoleName(formData.roleId) !== "Customer" && (
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

        {((step === 2 && getRoleName(formData.roleId) === "Customer") ||
          step === 3) &&
          renderUserInfoForm()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
