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
import { X } from "lucide-react";
import * as React from "react";
import { useState } from "react";
const CreateUserDialog = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(1);
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

  const roles = [
    { id: "manager", label: "Manager" },
    { id: "area-manager", label: "Area-Manager" },
    { id: "staff", label: "Staff" },
    { id: "client", label: "Client" },
  ];

  const cities = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];
  const districts = ["Quận 1", "Quận 2", "Quận 3"];

  const handleRoleChange = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      roleId,
      isGoogleUser: roleId === "client",
    }));
  };

  const showDistrictSelect = ["area-manager", "staff"].includes(
    formData.roleId
  );
  const showCitySelect = ["manager", "area-manager", "staff"].includes(
    formData.roleId
  );

  const nextStep = () => {
    if (formData.roleId === "client") {
      setStep(2); // Client chỉ có 2 bước
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
    if (formData.roleId === "client") {
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
    return formData.roleId === "client" ? 2 : 3;
  };
  const isClient = formData.roleId === "client";
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
            checked={isClient}
            disabled
            className={isClient ? "bg-green-500" : "bg-red-500"}
          />
          {!isClient && (
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
                      id={role.id}
                      checked={formData.roleId === role.id}
                      onCheckedChange={() => handleRoleChange(role.id)}
                    />
                    <Label htmlFor={role.id}>{role.label}</Label>
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

        {step === 2 && formData.roleId !== "client" && (
          <div className="space-y-6">
            {showCitySelect && (
              <div className="space-y-2">
                <Label>City</Label>
                <Select
                  value={formData.city}
                  onValueChange={(city) =>
                    setFormData((prev) => ({ ...prev, city }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
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
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
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

        {((step === 2 && formData.roleId === "client") || step === 3) &&
          renderUserInfoForm()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
